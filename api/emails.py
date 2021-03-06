"""The email controller forwards frontend requests to Solr for searching email or similar email info by doc_id."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, parse_all_topics
from collections import defaultdict
from .topics import Topics
from .dates import Dates
from ast import literal_eval
import json
import datetime


class Emails(Controller):
    """Makes the get_email_by_doc_id and get_similar_emails_by_doc_id methods accessible.

    Example request for get_email_by_doc_id:
    /api/email?doc_id=8d133bbf8d7a540185f15998b15bc078&dataset=enron

    Example request for get_similar_emails_by_doc_id:
    /api/email/similar?doc_id=8d133bbf8d7a540185f15998b15bc078&dataset=enron
    """

    @staticmethod
    def parse_topic_terms(topic):
        topic['terms'] = topic['terms'] \
            .replace('[(', '["(').replace(')]', ')"]').replace(', (', ', \"(').replace('), ', ')\", ')
        topic['terms'] = json.loads(topic['terms'])
        topic['terms'] = list(map(lambda serialized_tuple: literal_eval(serialized_tuple), topic['terms']))
        return topic

    @staticmethod
    def parse_topics(request_results):
        topics_with_unparsed_terms = request_results['response']['docs']
        topics = [Emails.parse_topic_terms(topic) for topic in topics_with_unparsed_terms]

        topics_as_objects = list(map(lambda topic_dict: {
            'confidence': topic_dict['topic_conf'],
            'topic_id': topic_dict['topic_id'],
            'words': list(map(lambda word_topic_relation: {
                'word': word_topic_relation[0],
                'confidence': float(word_topic_relation[1])
            }, topic_dict['terms']))
        }, topics))

        return topics_as_objects

    @json_response_decorator
    def get_email_by_doc_id():
        dataset = Controller.get_arg('dataset')
        doc_id = Controller.get_arg('doc_id')

        solr_result = Emails.get_email_from_solr(dataset, doc_id, True)
        parsed_solr_result = parse_solr_result(solr_result)

        if parsed_solr_result['response']['numFound'] == 0:
            return parsed_solr_result

        email = parse_email_list(parsed_solr_result['response']['docs'])[0]

        similars = solr_result['moreLikeThis'][solr_result['response']['docs'][0]['id']]['docs']

        similar_ids = list(map(lambda x: x['doc_id'], similars))

        if email['header']['recipients'][0] != 'NO RECIPIENTS FOUND':
            email['header']['recipients'] = [literal_eval(recipient) for recipient in email['header']['recipients']]

        if email['keyphrases'][0] != 'NO KEYPHRASES FOUND':
            email['keyphrases'] = [literal_eval(keyphrase)[0] for keyphrase in email['keyphrases']]

        if parsed_solr_result['response']['docs'][0]:
            request_results = Emails.get_topic_distribution_for_email(dataset, doc_id)
            topics_as_objects = Emails.parse_topics(request_results)

            solr_result_all_topics = Emails.get_all_topics(dataset)
            all_topics_parsed = parse_all_topics(solr_result_all_topics['response']['docs'])

            topics_as_objects = Topics.complete_distribution_and_add_ranks(topics_as_objects, all_topics_parsed)

            completed_dists = []

            if similar_ids:
                dists = [Emails.parse_topics(Emails
                                             .get_topic_distribution_for_email(dataset, id)) for id in similar_ids]
                completed_dists = [
                    {
                        'topics': Topics.remove_words(Topics.complete_distribution_and_add_ranks(dist,
                                                                                                 all_topics_parsed))
                    } for dist in dists]

                for dist, id in zip(completed_dists, similar_ids):
                    dist['highlightId'] = id

            email['topics'] = {
                'main': {
                    'topics': topics_as_objects
                },
                'singles': completed_dists if similar_ids else []
            }

            if email['predecessor'] == 'NO THREAD DATA FOUND':
                email['predecessor'] = {
                    'subject': email['predecessor'],
                    'doc_id': ''
                }
            else:
                email['predecessor'] = Emails.get_subjects_for_doc_ids([email['predecessor']], dataset)[0]
            if email['successor'][0] == 'NO THREAD DATA FOUND':
                email['successor'][0] = {
                    'subject': email['successor'][0],
                    'doc_id': ''
                }
            else:
                email['successor'] = Emails.get_subjects_for_doc_ids(email['successor'], dataset)

            return {
                'email': email,
                'numFound': parsed_solr_result['response']['numFound'],
                'searchTerm': doc_id
            }
        else:
            return {
                'numFound': parsed_solr_result['response']['numFound'],
                'searchTerm': doc_id
            }

    @staticmethod
    def get_subjects_for_doc_ids(doc_ids, dataset):
        results = []

        for doc_id in doc_ids:
            solr_result = Emails.get_email_from_solr(dataset, doc_id)
            parsed_solr_result = parse_solr_result(solr_result)
            if parsed_solr_result['response']['numFound'] == 0:
                results.append({
                    'subject': 'NO THREAD DATA FOUND',
                    'doc_id': doc_id
                })
            else:
                email = parse_email_list(parsed_solr_result['response']['docs'])[0]
                results.append({
                    'subject': email['header']['subject'],
                    'doc_id': doc_id
                })

        return results

    @json_response_decorator
    def get_similar_emails_by_doc_id():
        dataset = Controller.get_arg('dataset')

        doc_id = Controller.get_arg('doc_id')

        solr_result = Emails.get_email_from_solr(dataset, doc_id, more_like_this=True)

        if solr_result['response']['numFound'] == 0 or \
                solr_result['moreLikeThis'][solr_result['response']['docs'][0]['id']]['numFound'] == 0:
            return []

        result = {
            'response': {
                'docs': []
            }
        }
        parsed_solr_result = parse_solr_result(solr_result)
        main_email = parse_email_list(parsed_solr_result['response']['docs'])[0]

        result['response']['docs'] = solr_result['moreLikeThis'][main_email['id']]['docs']
        parsed_similar_result = parse_solr_result(result)
        parsed_similar_mails = parse_email_list(parsed_similar_result['response']['docs'])

        date = main_email['header']['date'].split("T")[0] if main_email['header']['date'] != 'NO DATE FOUND' else None
        similar_dates = {
            date: {
                'date': date,
                'business': 0,
                'personal': 0,
                'spam': 0,
                'this email': 1
            }
        }

        for mail in parsed_similar_mails:
            date = mail['header']['date'].split("T")[0] if mail['header']['date'] != 'NO DATE FOUND' else None
            if date not in similar_dates:
                similar_dates[date] = {
                    'date': date,
                    'business': 0,
                    'personal': 0,
                    'spam': 0
                }
            similar_dates[date][mail['category']] += 1

        dates = [x['date'] for x in similar_dates.values() if x['date'] is not None]
        start_date = datetime.datetime.strptime(min(dates), '%Y-%m-%d')
        end_date = datetime.datetime.strptime(max(dates), '%Y-%m-%d')

        for offset in range((end_date - start_date).days):
            date = (start_date + datetime.timedelta(days=offset)).strftime('%Y-%m-%d')
            if date not in similar_dates:
                similar_dates[date] = {
                    'date': date,
                    'business': 0,
                    'personal': 0,
                    'spam': 0
                }

        similar_dates = sorted(filter(lambda x: x['date'] is not None, similar_dates.values()), key=lambda k: k['date'])
        for i, entry in enumerate(similar_dates):
            similar_dates[i]['date'] = Dates.format_date_for_axis(entry['date'], 'day')

        return {
            'docs': parsed_similar_mails,
            'dates': {
                'month': [],
                'week': [],
                'day': similar_dates
            }
        }

    @staticmethod
    def get_email_from_solr(dataset, doc_id, more_like_this=False):
        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            more_like_this=more_like_this
        )
        return query_builder.send()

    @staticmethod
    def get_topic_distribution_for_email(dataset, doc_id):
        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            dataset=dataset,
            core_type='Core-Topics',
            query=query,
            limit=1000
        )
        return query_builder.send()

    @staticmethod
    def get_all_topics(dataset):

        all_topics_query = '{!collapse field=topic_id nullPolicy=collapse}'

        query_builder = QueryBuilder(
            dataset=dataset,
            query='*:*',
            fq=all_topics_query,
            limit=100,
            fl='topic_id,terms,topic_rank',
            core_type='Core-Topics'
        )

        return query_builder.send()

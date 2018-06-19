"""The email controller forwards frontend requests to Solr for searching email or similar email info by doc_id."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, parse_all_topics
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
        result['response']['docs'] = solr_result['moreLikeThis'][solr_result['response']['docs'][0]['id']]['docs']

        parsed_solr_result = parse_solr_result(result)

        parsed_similar_mails = parse_email_list(parsed_solr_result['response']['docs'])
        similar_dates = []
        for mail in parsed_similar_mails:
            date = mail['header']['date'].split("T")[0]
            category = mail['category']
            existing_date = next((x for x in similar_dates if x.get('date') == date), False)
            if existing_date:
                similar_dates[similar_dates.index(existing_date)][category] += 1
            else:
                similar_dates.append({
                    'date': date,
                    'business': 1 if category == 'business' else 0,
                    'personal': 1 if category == 'personal' else 0,
                    'spam': 1 if category == 'spam' else 0
                })
        similar_dates = sorted(similar_dates, key=lambda k: k['date'])

        start_date = datetime.datetime.strptime(similar_dates[0]['date'], '%Y-%m-%d')
        end_date = datetime.datetime.strptime(similar_dates[-1]['date'], '%Y-%m-%d')
        generated_dates = [start_date + datetime.timedelta(days=x) for x in range(0, (end_date - start_date).days)]

        for date in generated_dates:
            date_str = date.strftime('%Y-%m-%d')
            if not any([similar_dates[x]['date'] == date_str for x in range(0, len(similar_dates))]):
                similar_dates.append({
                    'date': date_str,
                    'business': 0,
                    'personal': 0,
                    'spam': 0
                })

        similar_dates = sorted(similar_dates, key=lambda k: k['date'])
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

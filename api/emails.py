"""The email controller forwards frontend requests to Solr for searching email or similar email info by doc_id."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, parse_all_topics
from .topics import Topics
from ast import literal_eval
import json


class Emails(Controller):
    """Makes the get_email_by_doc_id and get_similar_emails_by_doc_id methods accessible.

    Example request for get_email_by_doc_id:
    /api/email?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd&dataset=enron

    Example request for get_similar_emails_by_doc_id:
    /api/email/similar?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd&dataset=enron
    """

    @staticmethod
    def parse_topic_terms(topic):
        topic['terms'] = topic['terms'].replace('(', '\"(').replace(')', ')\"')
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

            topics_as_objects = Topics.remove_words(Topics.complete_distribution(topics_as_objects, all_topics_parsed))

            completed_dists = []

            if similar_ids:
                dists = [Emails.parse_topics(Emails
                                             .get_topic_distribution_for_email(dataset, id)) for id in similar_ids]
                completed_dists = [
                    {
                        'topics': Topics.remove_words(Topics.complete_distribution(dist, all_topics_parsed))
                    } for dist in dists]

                for dist, id in zip(completed_dists, similar_ids):
                    dist['highlightId'] = id

            email['topics'] = {
                'main': {
                    'topics': topics_as_objects
                },
                'singles': completed_dists
            }

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

    @json_response_decorator
    def get_similar_emails_by_doc_id():
        dataset = Controller.get_arg('dataset')

        doc_id = Controller.get_arg('doc_id')

        solr_result = Emails.get_email_from_solr(dataset, doc_id, more_like_this=True)

        if solr_result['moreLikeThis'][solr_result['response']['docs'][0]['id']]['numFound'] == 0:
            return []

        result = {
            'response': {
                'docs': []
            }
        }
        result['response']['docs'] = solr_result['moreLikeThis'][solr_result['response']['docs'][0]['id']]['docs']

        parsed_solr_result = parse_solr_result(result)

        return parse_email_list(parsed_solr_result['response']['docs'])

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

        all_topics_query = '{!collapse field=topic_id}'

        query_builder = QueryBuilder(
            dataset=dataset,
            query='*:*',
            fq=all_topics_query,
            limit=100,
            fl='topic_id,terms',
            core_type='Core-Topics'
        )

        return query_builder.send()

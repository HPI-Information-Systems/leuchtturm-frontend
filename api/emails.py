"""The email controller forwards frontend requests to Solr for searching email or similar email info by doc_id."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list
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

    @json_response_decorator
    def get_email_by_doc_id():
        dataset = Controller.get_arg('dataset')
        doc_id = Controller.get_arg('doc_id')

        solr_result = Emails.get_email_from_solr(dataset, doc_id, False)
        parsed_solr_result = parse_solr_result(solr_result)
        email = parse_email_list(parsed_solr_result['response']['docs'])[0]

        if email['header']['recipients'][0] != 'NO RECIPIENTS FOUND':
            email['header']['recipients'] = [literal_eval(recipient) for recipient in email['header']['recipients']]

        if parsed_solr_result['response']['docs'][0]:
            request_results = Emails.get_topic_distribution_for_email(dataset, doc_id)
            topics_with_unparsed_terms = request_results['response']['docs']
            topics = [Emails.parse_topic_terms(topic) for topic in topics_with_unparsed_terms]

            topics_as_objects = list(map(lambda topic_dict: {
                'confidence': topic_dict['topic_conf'],
                'words': list(map(lambda word_topic_relation: {
                    'word': word_topic_relation[0],
                    'confidence': float(word_topic_relation[1])
                }, topic_dict['terms']))
            }, topics))

            # add topic representing all topics that have not been returned in the pipeline due to little confidence
            sum_confs = sum(topic["confidence"] for topic in topics_as_objects)

            topics_as_objects.append({
                'confidence': 1 - sum_confs,
                "words": []
            })

            email['topics'] = topics_as_objects

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

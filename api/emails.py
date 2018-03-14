"""The email controller forwards frontend requests to Solr for searching email or similar email info by doc_id."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list
from ast import literal_eval
import json


class Emails:
    """Makes the get_email_by_doc_id and get_similar_emails_by_doc_id methods accessible.

    Example request for get_email_by_doc_id:
    /api/email?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd&dataset=enron

    Example request for get_similar_emails_by_doc_id:
    /api/email/similar?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd&dataset=enron
    """

    @json_response_decorator
    def get_email_by_doc_id():
        dataset = request.args.get('dataset')

        doc_id = request.args.get('doc_id')
        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        solr_result = Emails.get_email_from_solr(dataset, doc_id, False)
        parsed_solr_result = parse_solr_result(solr_result)
        email = parse_email_list(parsed_solr_result['response']['docs'])[0]

        if email['header']['recipients'][0] != 'NO RECIPIENTS FOUND':
            email['header']['recipients'] = [literal_eval(recipient) for recipient in email['header']['recipients']]

        if parsed_solr_result['response']['docs'][0]:

            # parse topics
            parsed_topic_dist_string = json.loads(parsed_solr_result['response']['docs'][0]['topics'][0])

            parsed_topic_dist_tuple = list(map(lambda topic_distribution_l_of_s:
                                               literal_eval(topic_distribution_l_of_s), parsed_topic_dist_string))

            topics_as_objects = list(map(lambda topic_tuple: {
                'confidence': float(topic_tuple[0]),
                'words': list(map(lambda word: {
                    'word': word[0],
                    'confidence': float(word[1])
                }, topic_tuple[1]))
            }, parsed_topic_dist_tuple))

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
        dataset = request.args.get('dataset')

        doc_id = request.args.get('doc_id', type=str)

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

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

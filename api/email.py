"""The email controller forwards frontend requests to Solr for searching email information by doc_id."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_config
from ast import literal_eval
import json


class Email:
    """Takes search request from the frontend containing a doc_id, uses QueryBuilder to search the mail data in Solr.

    Afterwards, it processes the Solr response by unflattening the entities. The Flask response is built by
    json_response_decorator.

    Example request for get_mail_by_doc_id: /api/email?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd
    Example request for get_similar_mails_by_doc_id: /api/similar_mails?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd
    """

    @json_response_decorator
    def get_mail_by_doc_id():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        doc_id = request.args.get('doc_id')
        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        result = Email.get_email_from_solr(config, doc_id, False)
        parsed_result = parse_solr_result(result)
        email = parse_email_list(parsed_result['response']['docs'])[0]

        if email['header']['recipients'][0] != 'NO RECIPIENTS FOUND':
            email['header']['recipients'] = [literal_eval(recipient) for recipient in email['header']['recipients']]

        if parsed_result['response']['docs'][0]:

            # parse topics
            parsed_topic_dist_string = json.loads(parsed_result['response']['docs'][0]['topics'][0])

            parsed_topic_dist_tuple = list(map(lambda topic_distribution_l_of_s:
                                               literal_eval(topic_distribution_l_of_s), parsed_topic_dist_string))

            topics_as_objects = list(map(lambda topic_tuple: {
                'confidence': float(topic_tuple[0]),
                'words': list(map(lambda word: {
                    'word': word[0],
                    'confidence': float(word[1])
                }, topic_tuple[1]))
            }, parsed_topic_dist_tuple))

            email['topics'] = topics_as_objects

            return {
                'email': email,
                'numFound': parsed_result['response']['numFound'],
                'searchTerm': doc_id
            }
        else:
            return {
                'numFound': parsed_result['response']['numFound'],
                'searchTerm': doc_id
            }

    @json_response_decorator
    def get_similar_mails_by_doc_id():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        doc_id = request.args.get('doc_id', type=str)

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        email_result = Email.get_email_from_solr(config, doc_id, more_like_this=True)

        if email_result['moreLikeThis'][email_result['response']['docs'][0]['id']]['numFound'] == 0:
            return []

        result = {
            'response': {
                'docs': []
            }
        }
        result['response']['docs'] = email_result['moreLikeThis'][email_result['response']['docs'][0]['id']]['docs']

        parsed_result = parse_solr_result(result)

        return parse_email_list(parsed_result['response']['docs'])

    @staticmethod
    def get_email_from_solr(config, doc_id, more_like_this=False):
        host = config['SOLR_CONNECTION']['Host']
        port = config['SOLR_CONNECTION']['Port']
        core = config['SOLR_CONNECTION']['Core']
        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            host=host,
            port=port,
            core=core,
            query=query,
            more_like_this=more_like_this
        )
        return query_builder.send()

"""The email controller forwards frontend requests to Solr for searching email information by doc_id."""

from flask import request
from functools import reduce
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_default_core
from ast import literal_eval


class Email:
    """Takes search request from the frontend containing a doc_id, uses QueryBuilder to search the mail data in Solr.

    Afterwards, it processes the Solr response by unflattening the entities. The Flask response is built by
    json_response_decorator.

    Example request for get_mail_by_doc_id: /api/email?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd
    Example request for get_similar_mails_by_doc_id: /api/similar_mails?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd
    """

    @json_response_decorator
    def get_mail_by_doc_id():
        core = request.args.get('core', default=get_default_core(), type=str)
        doc_id = request.args.get('doc_id')

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        result = Email.get_email_from_solr(core, doc_id, False)
        parsed_result = parse_solr_result(result)
        email = parse_email_list(parsed_result['response']['docs'])[0]

        if email['header']['recipients'][0] != 'NO RECIPIENTS FOUND':
            email['header']['recipients'] = [literal_eval(recipient) for recipient in email['header']['recipients']]

        if parsed_result['response']['docs'][0]:
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
        core = request.args.get('core', default=get_default_core(), type=str)
        doc_id = request.args.get('doc_id', type=str)

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        email_result = Email.get_email_from_solr(core, doc_id, more_like_this=True)

        similar_mails = email_result['moreLikeThis'][1]['docs']
        similar_mails_score_dict = {}

        similar_mail_id_array = []
        for doc in similar_mails:
            similar_mails_score_dict[doc['id']] = doc['score']
            similar_mail_id_array.append(doc['id'])

        similar_email_query = Email.generate_multi_search("id", similar_mail_id_array)

        query_builder = QueryBuilder(
            core,
            similar_email_query
        )

        result = query_builder.send()
        parsed_result = parse_solr_result(result)
        emails = parse_email_list(parsed_result['response']['docs'])

        for email in emails:
            email['similarity_score'] = similar_mails_score_dict[email['id']]

        return sorted(emails, key=lambda doc: doc['similarity_score'], reverse=True)

    @staticmethod
    def get_email_from_solr(core, doc_id, more_like_this=False):
        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            core,
            query,
            more_like_this=more_like_this
        )
        return query_builder.send()

    @staticmethod
    def generate_multi_search(search_field, search_terms):
        search_terms_array = list(map(lambda term: search_field + ':' + term, search_terms))
        return '(' + reduce(lambda prev, curr: prev + ' OR ' + curr, search_terms_array) + ')'

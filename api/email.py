"""The email controller forwards frontend requests to Solr for searching email information by doc_id."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_default_core


class Email:
    """Takes search request from the frontend containing a doc_id, uses QueryBuilder to search the mail data in Solr.

    Afterwards, it processes the Solr response by unflattening the entities. The Flask response is built by
    json_response_decorator.

    Example request: /api/email?doc_id=5395acea-e6d1-4c40-ab9a-44be454ed0dd
    """

    @json_response_decorator
    def get_mail_by_doc_id():
        core = request.args.get('core', default=get_default_core(), type=str)
        doc_id = request.args.get('doc_id')
        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            core,
            query
        )
        result = query_builder.send()
        parsed_result = parse_solr_result(result)
        if parsed_result['response']['docs'][0]:
            return {
                'email': parse_email_list(parsed_result['response']['docs'])[0],
                'numFound': parsed_result['response']['numFound'],
                'searchTerm': doc_id
            }
        else:
            return {
                'numFound': parsed_result['response']['numFound'],
                'searchTerm': doc_id
            }

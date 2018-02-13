"""The email controller forwards frontend requests to Solr for searching email information by doc_id."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result


class Email:
    """Takes search request from the frontend containing a doc_id, uses QueryBuilder to search the mail data in Solr.

    Afterwards, it processes the Solr response by unflattening the entities. The Flask response is built by
    json_response_decorator.

    Example request: /api/email?doc_id=0000000_0001_001544349
    """

    @json_response_decorator
    def search_mail_by_doc_id():
        core = request.args.get('core', default='allthemails', type=str)

        doc_id = request.args.get('doc_id', type=str)
        search_field = "doc_id"

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")
        query_builder = QueryBuilder(
            core,
            doc_id,
            search_field
        )
        result = query_builder.send()
        result_with_correct_entities = parse_solr_result(result)
        if result_with_correct_entities['response']['docs'][0]:
            return {
                'email': result_with_correct_entities['response']['docs'][0],
                'numFound': result_with_correct_entities['response']['numFound'],
                'searchTerm': doc_id
            }
        else:
            return {
                'numFound': result_with_correct_entities['response']['numFound'],
                'searchTerm': doc_id
            }

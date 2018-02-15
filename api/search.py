"""The search controller forwards frontend requests to Solr for keyword searches."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result


class Search:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?search_term=and&limit=2&offset=3
    """

    @json_response_decorator
    def search_request():
        core = request.args.get('core', default='enron_calo', type=str)
        print('the request', request)

        search_term = request.args.get('search_term', type=str)
        show_fields = request.args.get('show_fields', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        highlighting = request.args.get('highlighting', type=bool)
        highlighting_field = request.args.get('highlighting_field', type=str)

        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")
        query_builder = QueryBuilder(
            core,
            search_term,
            show_fields,
            limit,
            offset,
            highlighting,
            highlighting_field
        )
        result = query_builder.send()

        result_with_correct_entities = parse_solr_result(result)

        return {
            'results': result_with_correct_entities['response']['docs'],
            'numFound': result_with_correct_entities['response']['numFound'],
            'searchTerm': search_term
        }

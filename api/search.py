"""The search controller forwards frontend requests to Solr for keyword searches."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_default_core


class Search:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?search_term=and&limit=2&offset=3
    """

    @json_response_decorator
    def search_request():
        core = request.args.get('core', default=get_default_core(), type=str)
        search_term = request.args.get('search_term', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        highlighting = request.args.get('highlighting', type=bool)
        highlighting_field = request.args.get('highlighting_field', type=str)

        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")

        query = 'body:*{0}* OR header.subject:*{0}*'.format(search_term)

        query_builder = QueryBuilder(
            core,
            query,
            limit,
            offset,
            highlighting,
            highlighting_field
        )
        result = query_builder.send()

        parsed_result = parse_solr_result(result)

        return {
            'results': parse_email_list(parsed_result['response']['docs']),
            'numFound': parsed_result['response']['numFound'],
            'searchTerm': search_term
        }

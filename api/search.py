"""The search controller forwards frontend requests to Solr for keyword searches."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, escape_solr_arg, get_config


class Search:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?search_term=and&limit=2&offset=3&dataset=enron
    """

    @json_response_decorator
    def search_request():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['SOLR_CONNECTION']['Host']
        port = config['SOLR_CONNECTION']['Port']
        core = config['SOLR_CONNECTION']['Core']
        search_term = request.args.get('search_term', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        highlighting = request.args.get('highlighting', type=bool)
        highlighting_field = request.args.get('highlighting_field', type=str)

        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")

        escaped_search_term = escape_solr_arg(search_term)

        query = 'body:*{0}* OR header.subject:*{0}*'.format(escaped_search_term)

        query_builder = QueryBuilder(
            host=host,
            port=port,
            core=core,
            query=query,
            limit=limit,
            offset=offset,
            highlighting=highlighting,
            highlighting_field=highlighting_field
        )
        result = query_builder.send()

        parsed_result = parse_solr_result(result)

        return {
            'results': parse_email_list(parsed_result['response']['docs']),
            'numFound': parsed_result['response']['numFound'],
            'searchTerm': search_term
        }

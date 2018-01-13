"""The search controller forwards frontend requests to Solr for keyword searches."""
import json
from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result


class Search:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator. This class also contains a method which mocks Solr and returns hardcoded results.

    Example request: /api/search?search_term=and&limit=2&offset=3
    """

    @json_response_decorator
    def mock_results():
        count = request.args.get('count', default=1, type=int)
        response = {"results": [{
            "docId": '0000000_0001_000000404',
            "snippets": [
                {
                    "text": '... snippet 1 ...',
                    "position": 214,
                },
                {
                    "text": '... snippet 2 ...',
                    "position": 215,
                },
            ],
        }] * count}
        return response

    @json_response_decorator
    def search_request():
        core = request.args.get('core', default='allthemails', type=str)
        print('the request', request)

        search_term = request.args.get('search_term', type=str)
        search_field = request.args.get('search_field', type=str)
        show_fields = request.args.get('show_fields', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        snippets = request.args.get('snippets', type=bool)
        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")
        query_builder = QueryBuilder(
            core,
            search_term,
            search_field,
            show_fields,
            limit,
            offset,
            snippets
        )
        result = query_builder.send()

        result_with_correct_entities = parse_solr_result(result)

        return {
            'results': result_with_correct_entities['response']['docs'],
            'numFound': result_with_correct_entities['response']['numFound']
        }

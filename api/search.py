from flask import jsonify, request

from common.query_builder import QueryBuilder
from common.util import json_response_decorator

class Search:
    def mock_results(count):
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
        core = 'emails'
        print('the request', request)

        search_term = request.args.get('search_term', type=str)
        show_fields = request.args.get('show_fields', default='*', type=str)
        limit = request.args.get('limit', default=10, type=int)
        snippets = request.args.get('snippets', default=False, type=bool)
        if not search_term:
            return 'Please provide a search term'
        else:
            query_builder = QueryBuilder(
                core,
                search_term,
                show_fields,
                limit,
                snippets
            )
            result = query_builder.send()
            return result['response']['docs']

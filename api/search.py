"""Module for Functionality of search api route"""

import json
from flask import jsonify, request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator


class Search:
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
        core = 'emails_test'
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
        # return result['response']['docs']

        # parse json from solr correctly (string to json)
        def unflatten(dictionary):
            resultDict = dict()
            for key, value in dictionary.items():
                parts = key.split(".")
                d = resultDict
                for part in parts[:-1]:
                    if part not in d:
                        d[part] = dict()
                    d = d[part]
                d[parts[-1]] = value
            return resultDict

        for idx, doc in enumerate(result['response']['docs']):
            result['response']['docs'][idx] = unflatten(doc)
            if ('entities' in result['response']['docs'][idx]):
                for entity_type, entities in result['response']['docs'][idx]['entities'].items():
                    entities_jsonified = []
                    for entity in entities:
                        entities_jsonified.append(json.loads(entity))
                    result['response']['docs'][idx]['entities'][entity_type] = entities_jsonified

        return {
            'results': result['response']['docs'],
            'numFound': result['response']['numFound']
        }

from flask import jsonify

from common.query_builder import QueryBuilder

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

    def search_request():
        host = 'localhost'
        port = '8983'
        core = 'emails'
        search_term = 'Settlement'
        query_builder = QueryBuilder(
            host,
            port,
            core,
            search_term
        )
        result = query_builder.send()
        return result

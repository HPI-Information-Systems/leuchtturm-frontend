"""The search controller forwards frontend requests to Solr for keyword searches."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result
import configparser
import os.path


"""Get uri from config file."""
configpath = os.path.join(os.path.dirname(os.path.abspath(os.path.join(os.path.abspath(__file__), os.pardir))),
                          'common/config.ini')
config = configparser.ConfigParser()
config.read(configpath)
default_core = config['SOLR_CONNECTION']['Core']


class Communication:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator. This class also contains a method which mocks Solr and returns hardcoded results.

    Example request: /api/search?search_term=and&limit=2&offset=3
    """


    @json_response_decorator
    def get_communication():
        core = request.args.get('core', default=default_core, type=str)
        print('the request', request)

        sender = request.args.get('sender', type=str)
        receiver = request.args.get('receiver', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)

        if not sender or not receiver:
            raise SyntaxError("Please provide a sender and a receiver")

        query = "header.sender.email:" + sender + " AND header.recipients:*" + receiver + "*"

        query_builder = QueryBuilder(
            core=core,
            query=query,
            limit=limit,
            offset=offset,
        )
        result = query_builder.send()

        result_with_correct_entities = parse_solr_result(result)

        return {
            'results': result_with_correct_entities['response']['docs'],
            'numFound': result_with_correct_entities['response']['numFound'],
            'query': query
        }

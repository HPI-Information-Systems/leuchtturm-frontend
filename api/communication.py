"""The search controller forwards frontend requests to Solr for keyword searches."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result
import configparser
import os.path

class Communication:
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator. This class also contains a method which mocks Solr and returns hardcoded results.

    Example request: /api/search?search_term=and&limit=2&offset=3
    """

    def __init__(self):
        """Get uri from config file."""
        configpath = os.path.join(os.path.dirname(os.path.abspath(os.path.join(os.path.abspath(__file__), os.pardir))),
                                  'common/config.ini')
        self.config = configparser.ConfigParser()
        self.config.read(configpath)
        self.core = self.config['SOLR_CONNECTION']['Core']


    @json_response_decorator
    def get_communication(self):
        core = request.args.get('core', default=self.core, type=str)
        print('the request', request)

        sender = request.args.get('sender', type=str)
        receiver = request.args.get('receiver', type=str)
        show_fields = request.args.get('show_fields', type=str)
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        snippets = request.args.get('snippets', type=bool)
        highlighting = request.args.get('highlighting', type=bool)
        highlighting_field = request.args.get('highlighting_field', type=str)

        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")

        query = "header.sender.email:" + sender + " AND header.recipients:*" + receiver + "*"

        query_builder = QueryBuilder(
            core,
            query,
            show_fields,
            limit,
            offset,
            snippets,
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

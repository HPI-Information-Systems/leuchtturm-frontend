"""The terms api route can be used to get terms for a mail address from solr."""
import itertools
from flask import request
from common.util import json_response_decorator, parse_solr_result
from common.query_builder import QueryBuilder

DEFAULT_LIMIT = 10

class TermsMock:
    """Makes the get_correspondents method accessible.

    Example request: /api/terms?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_terms():
        return [{'entity': "Code", 'type': "ORG", 'count': 10}, 
                {'entity': "Life", 'type': "ORG", 'count': 9}, 
                {'entity': "Money", 'type': "ORG", 'count': 8}, 
                {'entity': "Enron", 'type': "ORG", 'count': 7}, 
                {'entity': "Andrew", 'type': "PERS", 'count': 6}, 
                {'entity': "Energy", 'type': "ORG", 'count': 5}, 
                {'entity': "Family", 'type': "PERS", 'count': 4}, 
                {'entity': "Plant", 'type': "ORG", 'count': 3}, 
                {'entity': "Emily", 'type': "PERS", 'count': 2}, 
                {'entity': "HPI", 'type': "ORG", 'count': 1}]

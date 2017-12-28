"""Module containing the Functionality of the Graph api route."""

from flask import request
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester

class Graph:
    """Class getting a graph for you. And a flower if you are kind."""
    @json_response_decorator
    def get_graph():
        search_term = request.args.get('search_term', type=str)
        neo4j_requester = Neo4jRequester()
        if '@' in search_term:
            response = neo4j_requester.search_by_mail(search_term)
        else:
            response = neo4j_requester.search_by_name(search_term)
        return response

    @json_response_decorator
    def get_flower():
        return "https://static.pexels.com/photos/36753/flower-purple-lical-blosso.jpg"

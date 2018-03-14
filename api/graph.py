"""The graph api route can be used to get graph data from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester


class Graph(Controller):
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com&email_address=technology.enron@enron.com&dataset=enron
    """

    @json_response_decorator
    def get_graph():
        dataset = Controller.get_arg('dataset')
        email_addresses = Controller.get_arg('email_address')

        neo4j_requester = Neo4jRequester(dataset)
        response = neo4j_requester.get_graph_for_email_addresses(email_addresses)
        return response

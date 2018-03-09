"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com
    """

    @json_response_decorator
    def get_graph():
        email_address = request.args.getlist('email_address')
        if not email_address:
            raise SyntaxError("Please provide argument 'email_address' to be requested.")

        response = Neo4jRequester().get_graph_for_email_address(email_address)
        return response

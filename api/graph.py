"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?mail=jaina@coned.com
    """

    @json_response_decorator
    def get_graph():
        mail = request.args.get('mail')
        if not mail:
            raise SyntaxError("Please provide argument 'mail' to be requested.")

        response = Neo4jRequester().get_graph_for_email_address(mail)
        return response

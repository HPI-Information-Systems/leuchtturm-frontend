"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?mail_address=jaina@coned.com

    scott.neal@enron.com
    """

    @json_response_decorator
    def get_graph():
        if request.args.get('mail_address', type=str):
            mail_address = request.args.get('mail_address', type=str)
        else:
            raise SyntaxError("Please provide argument 'query' to be requested.")

        neo4j_requester = Neo4jRequester()
        response = neo4j_requester.get_graph_for_email_address(mail_address)
        return response

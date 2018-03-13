"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator, get_config
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph_gor_correspondent method accessible.

    Example request:
    /api/correspondent/graph?email_address=jaina@coned.com
    """

    @json_response_decorator
    def get_graph_for_correspondent():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['NEO4J_CONNECTION']['Host']
        port = config['NEO4J_CONNECTION']['Bolt-Port']
        email_address = request.args.get('email_address')
        if not email_address:
            raise SyntaxError("Please provide argument 'email_address' to be requested.")

        neo4j_requester = Neo4jRequester(host, port)
        response = neo4j_requester.get_graph_for_email_address(email_address)
        return response

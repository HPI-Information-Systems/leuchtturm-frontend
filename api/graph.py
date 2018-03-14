"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator, get_config
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com&email_address=technology.enron@enron.com&neighbors=True&dataset=enron
    """

    @json_response_decorator
    def get_graph():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['NEO4J_CONNECTION']['Host']
        port = config['NEO4J_CONNECTION']['Bolt-Port']
        email_addresses = request.args.getlist('email_address')
        neighbors = request.args.get('neighbors')
        if not email_addresses:
            raise SyntaxError("Please provide argument 'email_address' to be requested.")

        neo4j_requester = Neo4jRequester(host, port)
        print(neighbors)
        if neighbors:
            response = neo4j_requester.get_graph_for_email_addresses(email_addresses)
        else:
            response = neo4j_requester.get_graph_for_email_addresses_only(email_addresses)
        
        return response

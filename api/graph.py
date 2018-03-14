"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator, get_config, build_edge, build_node
from common.neo4j_requester import Neo4jRequester
from flask import request


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com&email_address=technology.enron@enron.com&neighbours=true&dataset=enron
    """

    @json_response_decorator
    def get_graph():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['NEO4J_CONNECTION']['Host']
        port = config['NEO4J_CONNECTION']['Bolt-Port']
        neighbours = request.args.get('neighbours')
        email_addresses = request.args.getlist('email_address')
        # remove spaces added to last list element by getlist
        email_addresses[-1] = email_addresses[-1].strip()
        if not email_addresses:
            raise SyntaxError("Please provide argument 'email_address' to be requested.")
        neo4j_requester = Neo4jRequester(host, port)

        graph = {
            "nodes": [],
            "links": []
        }
        visited_nodes = []

        for node in neo4j_requester.get_nodes_for_email_addresses(email_addresses):
            if not node["id"] in visited_nodes:
                visited_nodes.append(node["id"])
                graph["nodes"].append(
                    build_node(node["id"], node["email_address"])
                )

            if neighbours == 'true':
                for neighbour in neo4j_requester.get_neighbours_for_node(node["id"]):
                    if not neighbour["id"] in visited_nodes:
                        visited_nodes.append(neighbour["id"])
                        graph["nodes"].append(
                            build_node(neighbour["id"], neighbour["email_address"])
                        )

            for relation in neo4j_requester.get_relations_for_nodes(visited_nodes):
                graph["links"].append(
                    build_edge(relation["relation_id"], relation["source_id"], relation["target_id"])
                )

        return graph

"""The graph api route can be used to get graph data from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator, build_edge, build_node
from common.neo4j_requester import Neo4jRequester


class Graph(Controller):
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com&email_address=technology.enron@enron.com&neighbours=true&dataset=enron
    """

    @json_response_decorator
    def get_graph():
        dataset = Controller.get_arg('dataset')
        neighbours = Controller.get_arg('neighbours', required=False)
        email_addresses = Controller.get_arg_list('email_address')
        neo4j_requester = Neo4jRequester(dataset)

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

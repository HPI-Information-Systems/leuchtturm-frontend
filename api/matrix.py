"""The matrix api route can be used to get the data for our adjacency matrix from neo4j."""

from api.controller import Controller
import json
from common.util import json_response_decorator, build_edge, build_node
from common.neo4j_requester import Neo4jRequester


class Matrix(Controller):
    """Makes the get_matrix method accessible.

    Example request:
    /api/matrix?dataset=enron
    """

    @json_response_decorator
    def get_matrix():
        dataset = Controller.get_arg('dataset')
        neo4j_requester = Neo4jRequester(dataset)

        matrix = {
            "nodes": [],
            "links": []
        }
        i = 0
        seen_nodes = []

        for node in neo4j_requester.get_nodes():
            matrix["nodes"].append(
                {
                    "index": i, # set index for use in matrix
                    "count": 0, # set count to zero
                    "id": node["id"],
                    "address": node["email_address"]
                }
            )
            i = i + 1
            seen_nodes.append(node["id"])

        for relation in neo4j_requester.get_relations():
            if relation["source_id"] in seen_nodes and relation["target_id"] in seen_nodes:
                matrix["links"].append(
                    {
                        "source": seen_nodes.index(relation["source_id"]),
                        "target": seen_nodes.index(relation["target_id"])
                    }
                )

        return json.dumps(matrix)

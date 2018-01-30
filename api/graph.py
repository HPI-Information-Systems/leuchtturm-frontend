"""The graph api route can be used to get graph data from neo4j."""
from common.util import json_response_decorator
from flask import request
from common.neo4j_requester import Neo4jRequester


class Graph:
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?query=MATCH(sender:Person{email:$sender_mail})-[w:WRITESTO]-(correspondent)RETURN+correspondent.email

    scott.neal@enron.com
    """

    @json_response_decorator
    def get_graph():
        if request.args.get('query', type=str):
            query = request.args.get('query', type=str)
        else:
            raise SyntaxError("Please provide argument 'query' to be requested.")

        neo4j_requester = Neo4jRequester()
        response = neo4j_requester.get_result_for_query("scott.neal@enron.com")
        return response

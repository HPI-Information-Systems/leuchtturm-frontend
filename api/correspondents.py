"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""
from common.util import json_response_decorator
from flask import request
from common.neo4j_requester import Neo4jRequester

DEFAULT_LIMIT = 100


class Correspondents:
    """Makes the get_correspondents method accessible.

    Example request: /api/correspondents?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_correspondents():
        email_address = request.args.get('email_address', type=str)
        if request.args.get('limit', type=int):
            limit = request.args.get('limit', type=int)
        else:
            limit = DEFAULT_LIMIT

        neo4j_requester = Neo4jRequester()

        if email_address:
            response = neo4j_requester.get_correspondents_for_email_address(email_address)
        else:
            raise SyntaxError("Please provide argument 'email_address' to search by.")

        sorted_correspondents = sorted(response, key=lambda correspondent: correspondent['count'], reverse=True)
        top_correspondents = sorted_correspondents[0:limit]
        return top_correspondents

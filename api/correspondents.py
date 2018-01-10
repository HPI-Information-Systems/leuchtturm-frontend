"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""
from common.util import json_response_decorator
from flask import request
from common.neo4j_requester import Neo4jRequester

class Correspondents:
    """Makes the get_correspondents method accessible.

    Example request: /api/correspondents?mail=alewis@enron.com&name=Andrew+Lewis
    """

    @json_response_decorator
    def get_correspondents():
        mail = request.args.get('mail', type=str)
        name = request.args.get('name', type=str)
        neo4j_requester = Neo4jRequester()

        if mail and name:
            response = neo4j_requester.search_by_name_and_mail(name, mail)
        elif mail:
            response = neo4j_requester.search_by_mail(mail)
        elif name:
            response = neo4j_requester.search_by_name(name)
        else:
            raise SyntaxError("Please provide either argument 'name' or argument 'mail' to search by.")

        return response

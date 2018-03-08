"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""
from common.util import json_response_decorator, get_config
from flask import request
from common.neo4j_requester import Neo4jRequester

DEFAULT_LIMIT = 100


class Correspondents:
    """Makes the get_correspondents method accessible.

    Example request: /api/correspondents?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_correspondents():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['NEO4J_CONNECTION']['Host']
        port = config['NEO4J_CONNECTION']['Bolt-Port']
        email_address = request.args.get('email_address')
        limit = request.args.get('limit', type=int, default=DEFAULT_LIMIT)
        if not email_address:
            raise SyntaxError("Please provide argument 'email_address' to search by.")

        neo4j_requester = Neo4jRequester(host, port)
        result = {}
        result['all'] = neo4j_requester.get_all_correspondents_for_email_address(email_address)[0:limit]
        result['from'] = neo4j_requester.get_sending_correspondents_for_email_address(email_address)[0:limit]
        result['to'] = neo4j_requester.get_receiving_correspondents_for_email_address(email_address)[0:limit]
        return result

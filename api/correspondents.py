"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester

DEFAULT_LIMIT = 100


class Correspondents(Controller):
    """Makes the get_correspondents method accessible.

    Example request:
    /api/correspondent/correspondents?email_address=scott.neal@enron.com&limit=5&dataset=enron
    """

    @json_response_decorator
    def get_correspondents_for_correspondent():
        dataset = Controller.get_arg('dataset')
        email_address = Controller.get_arg('email_address')
        limit = Controller.get_arg('limit', int, default=DEFAULT_LIMIT)

        neo4j_requester = Neo4jRequester(dataset)
        result = {}
        all_deduplicated = []
        all_with_duplicates = neo4j_requester.get_all_correspondents_for_email_address(email_address)

        for new_correspondent in all_with_duplicates:
            found = False
            for existing_correspondent in all_deduplicated:
                if new_correspondent['email_address'] == existing_correspondent['email_address']:
                    existing_correspondent['count'] += new_correspondent['count']
                    found = True
            if not found:
                all_deduplicated.append(new_correspondent)

        result['all'] = all_deduplicated[0:limit]
        result['from'] = neo4j_requester.get_sending_correspondents_for_email_address(email_address)[0:limit]
        result['to'] = neo4j_requester.get_receiving_correspondents_for_email_address(email_address)[0:limit]

        return result

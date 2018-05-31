"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
import time
import datetime
import json

DEFAULT_LIMIT = 100


class Correspondents(Controller):
    """Makes the get_correspondents method accessible.

    Example request:
    /api/correspondent/correspondents?identifying_name=Scott Neal&limit=5&dataset=enron
    /api/correspondent/correspondent_information?identifying_name=Scott Neal&dataset=enron-dev
    """

    @json_response_decorator
    def get_correspondents_for_correspondent():
        dataset = Controller.get_arg('dataset')
        identifying_name = Controller.get_arg('identifying_name')
        limit = Controller.get_arg('limit', int, default=DEFAULT_LIMIT)

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        start_date = filter_object.get('startDate')
        start_stamp = time.mktime(datetime.datetime.strptime(start_date, "%Y-%m-%d").timetuple()) if start_date else 0
        end_date = filter_object.get('endDate')
        end_stamp = time.mktime(datetime.datetime.strptime(end_date, "%Y-%m-%d")
                                .timetuple()) if end_date else time.time()

        neo4j_requester = Neo4jRequester(dataset)
        result = {}
        all_deduplicated = []
        all_with_duplicates = neo4j_requester.get_all_correspondents_for_identifying_name(
            identifying_name, start_time=start_stamp, end_time=end_stamp
        )

        for new_correspondent in all_with_duplicates:
            found = False
            for existing_correspondent in all_deduplicated:
                if new_correspondent['identifying_name'] == existing_correspondent['identifying_name']:
                    existing_correspondent['count'] += new_correspondent['count']
                    found = True
            if not found:
                all_deduplicated.append(new_correspondent)

        result['all'] = Correspondents.set_default_network_analysis_results(
            sorted(all_deduplicated[0:limit],
                   key=lambda correspondent: correspondent['count'],
                   reverse=True))
        result['from'] = Correspondents.set_default_network_analysis_results(
            neo4j_requester.get_sending_correspondents_for_identifying_name(
                identifying_name, start_time=start_stamp, end_time=end_stamp
            )[0:limit])
        result['to'] = Correspondents.set_default_network_analysis_results(
            neo4j_requester.get_receiving_correspondents_for_identifying_name(
                identifying_name, start_time=start_stamp, end_time=end_stamp
            )[0:limit])

        return result

    @json_response_decorator
    def get_correspondent_information():
        dataset = Controller.get_arg('dataset')
        identifying_name = Controller.get_arg('identifying_name')

        neo4j_requester = Neo4jRequester(dataset)
        results = list(neo4j_requester.get_information_for_identifying_names(identifying_name))

        if len(results) == 0:
            return {
                'numFound': 0,
                'identifying_name': identifying_name
            }
        elif len(results) > 1:
            raise Exception('More than one matching correspondent found for identifying_name ' + identifying_name)

        result = dict(results[0])
        result['numFound'] = 1
        result['identifying_name'] = identifying_name
        return result

    @staticmethod
    def set_default_network_analysis_results(correspondent_list):
        for idx, correspondent in enumerate(correspondent_list):
            hierarchy = correspondent['hierarchy']
            community = correspondent['community']
            role = correspondent['role']
            correspondent_list[idx]['hierarchy'] = hierarchy if hierarchy is not None else 'UNK'
            correspondent_list[idx]['community'] = community if community is not None else 'UNK'
            correspondent_list[idx]['role'] = role if role is not None else 'UNK'
        return correspondent_list

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
    /api/correspondent/correspondents?identifying_name=scott.neal@enron.com&limit=5&dataset=enron
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
        all_with_duplicates = neo4j_requester.get_all_correspondents_for_identifying_name(identifying_name,
                                                                                       start_time=start_stamp,
                                                                                       end_time=end_stamp)

        for new_correspondent in all_with_duplicates:
            found = False
            for existing_correspondent in all_deduplicated:
                if new_correspondent['identifying_name'] == existing_correspondent['identifying_name']:
                    existing_correspondent['count'] += new_correspondent['count']
                    found = True
            if not found:
                all_deduplicated.append(new_correspondent)

        result['all'] = sorted(all_deduplicated[0:limit],
                               key=lambda correspondent: correspondent['count'],
                               reverse=True)
        result['from'] = neo4j_requester.get_sending_correspondents_for_identifying_name(identifying_name,
                                                                                      start_time=start_stamp,
                                                                                      end_time=end_stamp)[0:limit]
        result['to'] = neo4j_requester.get_receiving_correspondents_for_identifying_name(identifying_name,
                                                                                      start_time=start_stamp,
                                                                                      end_time=end_stamp)[0:limit]

        return result

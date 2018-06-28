"""The correspondents api route can be used to get correspondents for a mail address from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator, get_config, default_network_analysis
from common.neo4j_requester import Neo4jRequester
from common.query_builder import QueryBuilder, build_filter_query, build_fuzzy_solr_query
import time
import datetime
import json
import re

DEFAULT_LIMIT = 100

HIERARCHY_SCORE_LABEL = 'Hierarchy Score'


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
        sort = Controller.get_arg('sort', arg_type=str, required=False)

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
        all_with_duplicates = default_network_analysis(
            neo4j_requester.get_all_correspondents_for_identifying_name(
                identifying_name, start_time=start_stamp, end_time=end_stamp
            )
        )

        for new_correspondent in all_with_duplicates:
            found = False
            for existing_correspondent in all_deduplicated:
                if new_correspondent['identifying_name'] == existing_correspondent['identifying_name']:
                    existing_correspondent['count'] += new_correspondent['count']
                    found = True
            if not found:
                all_deduplicated.append(new_correspondent)

        sort_key = 'hierarchy' if sort == HIERARCHY_SCORE_LABEL else 'count'

        result['all'] = sorted(
            all_deduplicated, key=lambda correspondent: correspondent[sort_key], reverse=True)[0:limit]

        result['from'] = default_network_analysis(
            neo4j_requester.get_sending_correspondents_for_identifying_name(
                identifying_name, start_time=start_stamp, end_time=end_stamp
            )
        )
        result['from'] = sorted(
            result['from'], key=lambda correspondent: correspondent[sort_key], reverse=True)[0:limit]

        result['to'] = default_network_analysis(
            neo4j_requester.get_receiving_correspondents_for_identifying_name(
                identifying_name, start_time=start_stamp, end_time=end_stamp
            )
        )
        result['to'] = sorted(result['to'], key=lambda correspondent: correspondent[sort_key], reverse=True)[0:limit]

        return result

    @json_response_decorator
    def get_correspondent_information():
        dataset = Controller.get_arg('dataset')
        identifying_name = Controller.get_arg('identifying_name')

        neo4j_requester = Neo4jRequester(dataset)
        results = default_network_analysis(neo4j_requester.get_information_for_identifying_name(identifying_name))

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

    @json_response_decorator
    def get_classes_for_correspondent():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        identifying_name = re.escape(Controller.get_arg('identifying_name'))

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, False, core_type=core_topics_name)

        query = (
            'header.sender.identifying_name:' + identifying_name +
            ' AND ' + build_fuzzy_solr_query(filter_object.get('searchTerm', '')) +
            '&group=true' +
            '&group.field=category.top_subcategory'
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            fl='groupValue'
        )
        solr_result = query_builder.send()

        grouped_result = solr_result['grouped']['category.top_subcategory']
        groups = grouped_result['groups']
        num = grouped_result['matches']

        if num == 0:
            return []

        return [{
            'key': group['groupValue'],
            'num': group['doclist']['numFound'],
            'share': round(group['doclist']['numFound'] / num, 4)
        } for group in groups]

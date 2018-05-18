"""The terms api route can be used to get terms for a mail address from solr."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query, get_config
import json
import re

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 10
SOLR_MAX_INT = 2147483647
SECONDS_PER_DAY = 86400


class Terms(Controller):
    """Makes the get_terms_for_correspondent, get_correspondent_for_term and get_dates_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?identifying_name=Scott Neal
    &limit=5&dataset=enron&start_date=2001-05-20&end_date=2001-05-30

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-21

    Example request for get_dates_for_term:
    /api/term/dates?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-20
    """

    @json_response_decorator
    def get_terms_for_correspondent():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        identifying_name = re.escape(Terms.get_arg('identifying_name'))

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, False, core_type=core_topics_name)

        query = (
            "header.sender.identifying_name:" + identifying_name +
            "&facet=true" +
            "&facet.limit=" + str(TOP_ENTITIES_LIMIT) +
            "&facet.field=entities.person" +
            "&facet.field=entities.organization" +
            "&facet.field=entities.miscellaneous" +
            "&facet.field=entities.location"
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0  # as we are not interested in the matching docs themselves but only in the facet output
        )
        solr_result = query_builder.send()

        top_terms = solr_result['facet_counts']['facet_fields']
        top_terms_formatted = []

        if solr_result['response']['numFound'] == 0:
            return []

        for entity_type, entities_with_count in top_terms.items():
            entity_type_formatted = entity_type.split('entities.')[1].capitalize()
            for i in range(0, len(entities_with_count), 2):
                top_terms_formatted.append({
                    "entity": entities_with_count[i],
                    "type": entity_type_formatted,
                    "count": entities_with_count[i + 1]
                })

        return top_terms_formatted

    @json_response_decorator
    def get_correspondents_for_term():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        group_by = 'header.sender.identifying_name'
        query = (
            build_fuzzy_solr_query(term) +
            '&group=true&group.field=' + group_by
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=SOLR_MAX_INT,
            fl=group_by
        )
        solr_result = query_builder.send()

        return Terms.build_correspondents_for_term_result(solr_result, group_by, dataset)

    @json_response_decorator
    def get_dates_for_term():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '*')
        start_range = Terms.get_date_range_border(dataset, 'start')
        end_range = Terms.get_date_range_border(dataset, 'end')
        start_date_filter = filter_object.get('startDate')
        start_date = (start_date_filter + "T00:00:00Z") if start_date_filter else start_range
        end_date_filter = filter_object.get('endDate')
        end_date = (end_date_filter + "T23:59:59Z") if end_date_filter else end_range

        query = (
            build_fuzzy_solr_query(term) +
            "&facet=true" +
            "&facet.range=header.date"
            "&facet.range.start=" + start_date +
            "&facet.range.end=" + end_date +
            "&facet.range.gap=%2B1MONTH"
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=0,
            fq=filter_query
        )
        solr_result = query_builder.send()

        return Terms.build_dates_for_term_result(solr_result)

    @staticmethod
    def get_date_range_border(dataset, border):
        email_sort = "Newest first" if border == "end" else "Oldest first"

        query_builder = QueryBuilder(
            dataset=dataset,
            query="header.date:[* TO *]",     # filter documents where header.date does not exist
            limit=1,
            sort=email_sort,
            fl="header.date"
        )
        solr_result = query_builder.send()

        return solr_result['response']['docs'][0]['header.date']

    @staticmethod
    def parse_groups(result, field):
        return result['grouped'][field]['groups']

    @staticmethod
    def parse_matches(result, field):
        return result['grouped'][field]['matches']

    @staticmethod
    def build_correspondents_for_term_result(solr_result, group_by, dataset):
        groups = Terms.parse_groups(solr_result, group_by)
        total_matches = Terms.parse_matches(solr_result, group_by)

        groups_sorted = sorted(groups, key=lambda doc: doc['doclist']['numFound'], reverse=True)
        top_senders = groups_sorted[:TOP_CORRESPONDENTS_LIMIT]

        identifying_names = []
        for sender in top_senders:
            identifying_names.append(sender['groupValue'])

        neo4j_requester = Neo4jRequester(dataset)
        hierarchy_results = list(neo4j_requester.get_hierarchy_for_identifying_names(identifying_names))

        for sender in top_senders:
            for result in hierarchy_results:
                if sender['groupValue'] == result['identifying_name']:
                    sender['hierarchy'] = result['hierarchy']

        result = {
            'correspondents': [],
            'numFound': total_matches
        }
        for sender in top_senders:
            result['correspondents'].append({
                'identifying_name': sender['groupValue'],
                'count': sender['doclist']['numFound'],
                'hierarchy': sender.get('hierarchy', 0)
            })

        return result

    @staticmethod
    def build_dates_for_term_result(solr_result):
        result = []
        counts = solr_result['facet_counts']['facet_ranges']['header.date']['counts']
        for date, count in zip(counts[0::2], counts[1::2]):
            result.append({
                'date': Terms.format_date_for_axis(date),
                'count': count
            })
        return result

    @staticmethod
    def format_date_for_axis(date_string):
        parts = date_string.split('-')
        return parts[1] + '/' + parts[0]

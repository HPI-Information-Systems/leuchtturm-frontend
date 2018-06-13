"""The terms api route can be used to get terms for a mail address from solr."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query, get_config
import json
import re

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 20


class Terms(Controller):
    """Makes the get_terms_for_correspondent, get_correspondent_for_term and get_dates_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?identifying_name=Scott Neal
    &limit=5&dataset=enron&start_date=2001-05-20&end_date=2001-05-30

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-21
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
            'header.sender.identifying_name:' + identifying_name +
            '&facet=true' +
            '&facet.limit=' + str(TOP_ENTITIES_LIMIT) +
            '&facet.field=entities.person' +
            '&facet.field=entities.organization' +
            '&facet.field=entities.miscellaneous' +
            '&facet.field=entities.location'
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
                    'entity': entities_with_count[i],
                    'type': entity_type_formatted,
                    'count': entities_with_count[i + 1]
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
            '&facet=true&facet.field=' + group_by
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0
        )
        solr_result = query_builder.send()

        return Terms.build_correspondents_for_term_result(solr_result, dataset)

    @staticmethod
    def build_correspondents_for_term_result(solr_result, dataset):
        # the following variable contains data like this: (note the coma separation, this is not a dict!)
        # ['Scott Nelson', 1234, 'Richard Smith', 293, ...]
        identifying_names_with_counts = solr_result['facet_counts']['facet_fields']['header.sender.identifying_name']

        result = {
            'correspondents': [],
            'numFound': solr_result['response']['numFound']
        }

        identifying_names = []
        for i in range(0, TOP_CORRESPONDENTS_LIMIT * 2, 2):
            identifying_names.append(identifying_names_with_counts[i])

        neo4j_requester = Neo4jRequester(dataset)
        network_analysis_results = list(neo4j_requester.get_network_analysis_for_correspondents(identifying_names))

        for i in range(0, TOP_CORRESPONDENTS_LIMIT * 2, 2):
            hierarchy_value = 'UNK'
            community_label = 'UNK'
            role_label = 'UNK'
            for na_result in network_analysis_results:
                if identifying_names_with_counts[i] == na_result['identifying_name']:
                    hierarchy_value = na_result['hierarchy'] if na_result['hierarchy'] is not None else 'UNK'
                    community_label = na_result['community'] if na_result['community'] is not None else 'UNK'
                    role_label = na_result['role'] if na_result['role'] is not None else 'UNK'

            if identifying_names_with_counts[i + 1]:
                result['correspondents'].append(
                    {
                        'identifying_name': identifying_names_with_counts[i],
                        'count': identifying_names_with_counts[i + 1],
                        'hierarchy': hierarchy_value,
                        'community': community_label,
                        'role': role_label
                    }
                )

        return result

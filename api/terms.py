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
            ' AND ' + build_fuzzy_solr_query(filter_object.get('searchTerm', '')) +
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

        return sorted(top_terms_formatted, key=lambda term_object: term_object['count'], reverse=True)

    @json_response_decorator
    def get_correspondents_for_term():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        sort = Controller.get_arg('sort', arg_type=str, required=False)

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

        return Terms.build_correspondents_for_term_result(solr_result, dataset, sort)

    @staticmethod
    def build_correspondents_for_term_result(solr_result, dataset, sort):
        # the following variable contains data like this: (note the coma separation, this is not a dict!)
        # ['Scott Nelson', 1234, 'Richard Smith', 293, ...]
        identifying_names_with_counts = solr_result['facet_counts']['facet_fields']['header.sender.identifying_name']
        correspondents = []
        for i in range(0, len(identifying_names_with_counts), 2):
            if identifying_names_with_counts[i+1] > 0:
                correspondents.append({
                    'identifying_name': identifying_names_with_counts[i],
                    'count': identifying_names_with_counts[i+1]
                })

        neo4j_requester = Neo4jRequester(dataset)
        hierarchy_results = list(
            neo4j_requester.get_hierarchy_for_identifying_names([elem['identifying_name'] for elem in correspondents])
        )

        for correspondent in correspondents:
            for hierarchy_result in hierarchy_results:
                if correspondent['identifying_name'] == hierarchy_result['identifying_name']:
                    correspondent['hierarchy'] = hierarchy_result['hierarchy'] if hierarchy_result['hierarchy'] else 0
                    break

        sort_key = 'hierarchy' if sort == 'Hierarchy Score' else 'count'
        correspondents = sorted(correspondents, key=lambda correspondent: correspondent[sort_key], reverse=True)

        return {
            'correspondents': correspondents[:TOP_CORRESPONDENTS_LIMIT],
            'numFound': solr_result['response']['numFound']
        }

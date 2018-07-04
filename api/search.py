"""The search controller forwards frontend requests to Solr for keyword searches."""

from api.controller import Controller
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.util import (json_response_decorator, parse_solr_result, parse_email_list, get_config,
                         default_network_analysis)
import json
from common.neo4j_requester import Neo4jRequester
from functools import reduce
from .topics import Topics


SOLR_MAX_INT = 2147483647
FACET_LIMIT = 10000
TOP_CORRESPONDENTS_LIMIT = 20
HIERARCHY_SCORE_LABEL = 'Hierarchy Score'


class Search(Controller):
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?term=andy&limit=2&offset=3&dataset=enron&start_date=1800-05-20&end_date=2004-07-30
    Example request for correspondent search:
    /api/search_correspondents?dataset=enron-dev&search_phrase=Alex&search_field=identifying_name&search_field=aliases
    &match_exact=true&limit=500
    """

    @json_response_decorator
    def search():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        limit = Controller.get_arg('limit', arg_type=int, required=False)
        offset = Controller.get_arg('offset', arg_type=int, required=False)
        sort = Controller.get_arg('sort', arg_type=str, required=False)

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        query = build_fuzzy_solr_query(term)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=limit,
            offset=offset,
            fq=filter_query,
            sort=sort
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)
        results = parse_email_list(parsed_solr_result['response']['docs'])

        if len(results) == 0:
            return {
                'results': results,
                'searchTopics': {
                    'main': {
                        'topics': []
                    },
                    'singles': [],
                },
                'numFound': parsed_solr_result['response']['numFound'],
                'searchTerm': term
            }

        conditions = map(lambda result_element: 'doc_id:' + result_element['doc_id'], results)
        doc_id_filter_query = reduce(lambda condition_1, condition_2: condition_1 + ' OR ' + condition_2, conditions)

        facet_query = {
            'facet_topic_id': {
                'type': 'terms',
                'field': 'topic_id',
                'facet': {
                    'sum_of_confs_for_topic': 'sum(topic_conf)',
                    'facet_terms': {
                        'type': 'terms',
                        'field': 'terms',
                        'limit': 1
                    }
                },
                'sort': 'index asc',
                'limit': FACET_LIMIT,
                'refine': True
            }
        }

        query = doc_id_filter_query + '&group=true&group.field=doc_id&group.limit=100' \
            + '&json.facet=' + json.dumps(facet_query)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            core_type='Core-Topics'
        )
        solr_topic_result = query_builder.send()
        topic_dists_for_emails = solr_topic_result['grouped']['doc_id']['groups']
        topic_dists_for_emails_parsed = Search.parse_grouped_topic_distributions(topic_dists_for_emails)

        aggregated_topic_dist_parsed = list(map(
            Topics.parse_topic_closure_wrapper(len(topic_dists_for_emails)),
            solr_topic_result['facets']['facet_topic_id']['buckets']
        ))

        all_topics = Topics.get_all_topics(dataset)

        for distribution in topic_dists_for_emails_parsed:
            topics = Topics.complete_distribution_and_add_ranks(distribution['topics'], all_topics)
            topics = Topics.remove_words(topics)
            distribution['topics'] = topics

        aggregated_topic_dist_parsed = Topics.complete_distribution_and_add_ranks(
            aggregated_topic_dist_parsed, all_topics)

        return {
            'results': results,
            'searchTopics': {
                'main': {
                    'topics': aggregated_topic_dist_parsed
                },
                'singles': topic_dists_for_emails_parsed,
            },
            'numFound': parsed_solr_result['response']['numFound'],
            'searchTerm': term
        }

    @staticmethod
    def parse_grouped_topic_distributions(grouped_dists):
        parsed = []
        for dist in grouped_dists:
            parsed.append(Search.parse_single_topic_dist(dist))

        return parsed

    @staticmethod
    def parse_single_topic_dist(dist):
        distribution = list(map(
            lambda topic: {
                'topic_id': topic['topic_id'],
                'confidence': topic['topic_conf'],
                'topic_rank': topic['topic_rank'],
                'words': []
            },
            dist['doclist']['docs']
        ))

        return {
            'topics': distribution,
            'highlightId': dist['groupValue']
        }

    @json_response_decorator
    def search_correspondents():
        dataset = Controller.get_arg('dataset')

        search_phrase = Controller.get_arg('search_phrase')
        match_exact = Controller.get_arg('match_exact', arg_type=bool, default=False, required=False)
        offset = Controller.get_arg('offset', arg_type=int, default=0, required=False)
        limit = Controller.get_arg('limit', arg_type=int, default=10, required=False)
        search_fields = Controller.get_arg_list(
            'search_field', default=['identifying_name'], required=False
        )

        allowed_search_field_values = {'identifying_name', 'email_addresses', 'aliases'}
        if not set(search_fields).issubset(allowed_search_field_values):
            raise Exception('Allowed values for arg search_fields are ' + str(allowed_search_field_values))

        neo4j_requester = Neo4jRequester(dataset)
        results, numFound = neo4j_requester.get_correspondents_for_search_phrase(
            search_phrase, match_exact, search_fields, offset, limit
        )
        return {
            'results': [dict(result) for result in default_network_analysis(results)],
            'numFound': numFound
        }

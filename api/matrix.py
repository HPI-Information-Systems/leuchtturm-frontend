"""The matrix api route can be used to get the data for our adjacency matrix from neo4j."""

import json
from ast import literal_eval
from api.controller import Controller
from common.util import json_response_decorator, get_config
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.neo4j_requester import Neo4jRequester

SOLR_MAX_INT = 2147483647
FACET_LIMIT = 1000


class Matrix(Controller):
    """Makes the get_matrix method accessible.

    Example requests:
    /api/matrix/full?dataset=enron

    /api/matrix/highlighting?term=hello&dataset=enron
    """

    @staticmethod
    def search_correspondences_for_term(dataset, filter_string):
        filter_object = json.loads(filter_string)
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        facet_query = {
            'senders': {
                'type': 'terms',
                'field': 'header.sender.identifying_name',
                'facet': {
                    'recipients': {
                        'type': 'terms',
                        'field': 'header.recipients',
                        'limit': FACET_LIMIT,
                        'refine': True
                    }
                },
                'limit': SOLR_MAX_INT,
                'refine': True
            }
        }

        query_builder = QueryBuilder(
            dataset=dataset,
            query={
                'q':build_fuzzy_solr_query(term),
                'json.facet': json.dumps(facet_query)
            },
            limit=0,
            fq=filter_query
        )
        solr_result = query_builder.send()

        correspondences = []
        if solr_result['facets']['count'] == 0:
            return correspondences
        for sender_bucket in solr_result['facets']['senders']['buckets']:
            correspondences_for_source = {
                'source': sender_bucket.get('val', '')
            }
            targets = set()
            for recipient in sender_bucket['recipients']['buckets']:
                target = literal_eval(recipient.get('val', '')).get('identifying_name', '')
                targets.add(target)
            correspondences_for_source['targets'] = list(targets)
            correspondences.append(correspondences_for_source)

        return correspondences

    @json_response_decorator
    def get_matrix_highlighting():
        dataset = Controller.get_arg('dataset')
        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        correspondences = Matrix.search_correspondences_for_term(dataset, filter_string)

        return correspondences

    @json_response_decorator
    def get_matrix():
        identifying_names = Controller.get_arg_list('identifying_name')
        dataset = Controller.get_arg('dataset')

        neo4j_requester = Neo4jRequester(dataset)
        relations = neo4j_requester.get_matrix_for_identifying_names(identifying_names)
        community_count = neo4j_requester.get_feature_count('community')
        role_count = neo4j_requester.get_feature_count('role')

        matrix = Matrix.build_matrix(relations, community_count, role_count)

        return matrix

    @staticmethod
    def build_matrix(relations, community_count=None, role_count=None):
        matrix = {
            'nodes': [],
            'links': [],
            'community_count': 0,
            'role_count': 0
        }

        if community_count:
            matrix['community_count'] = community_count
        if role_count:
            matrix['role_count'] = role_count

        i = 0
        seen_nodes = []

        for relation in relations:
            if relation['source_id'] not in seen_nodes:
                matrix['nodes'].append(
                    {
                        'index': i,  # set index for use in matrix
                        'count': 0,  # set count to zero
                        'id': relation['source_id'],
                        'identifying_name': relation['source_identifying_name'],
                        'community': relation['source_community'],
                        'role': relation['source_role']
                    }
                )
                seen_nodes.append(relation['source_id'])
                i += 1

            if relation['target_id'] not in seen_nodes:
                matrix['nodes'].append(
                    {
                        'index': i,  # set index for use in matrix
                        'count': 0,  # set count to zero
                        'id': relation['target_id'],
                        'identifying_name': relation['target_identifying_name'],
                        'community': relation['target_community'],
                        'role': relation['target_role']
                    }
                )
                seen_nodes.append(relation['target_id'])
                i += 1

            matrix['links'].append(
                {
                    'source': seen_nodes.index(relation['source_id']),
                    'target': seen_nodes.index(relation['target_id']),
                    'community': relation['source_community'],
                    'role': relation['source_role'],
                    'source_identifying_name': relation['source_identifying_name'],
                    'target_identifying_name': relation['target_identifying_name'],
                }
            )

        return matrix

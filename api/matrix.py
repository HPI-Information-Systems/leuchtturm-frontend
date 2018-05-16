"""The matrix api route can be used to get the data for our adjacency matrix from neo4j."""

import json
from api.controller import Controller
from common.util import json_response_decorator
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.neo4j_requester import Neo4jRequester

SOLR_MAX_INT = 2147483647


class Matrix(Controller):
    """Makes the get_matrix method accessible.

    Example requests:
    /api/matrix/full?dataset=enron

    /api/matrix/highlighting?term=hello&dataset=enron
    """

    @staticmethod
    def search_correspondences_for_term(dataset, filter_string):
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object)
        term = filter_object.get('searchTerm', '')
        query = build_fuzzy_solr_query(term)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            fq=filter_query,
            fl='header.sender.identifying_name, header.recipients'
        )
        solr_result = query_builder.send()

        correspondences = []

        for doc in solr_result['response']['docs']:
            source = doc.get('header.sender.identifying_name', '')
            if 'header.recipients' in doc:
                for recipient in doc['header.recipients']:
                    try:
                        recipient_dict = json.loads(recipient.replace("'", '"'))
                        target = recipient_dict.get('identifying_name', '')
                    except Exception:
                        target = ''
                    if source or target:
                        correspondence = {
                            'source': source,
                            'target': target
                        }
                        if correspondence not in correspondences:
                            correspondences.append(correspondence)
            elif source:
                correspondence = {
                    'source': source,
                    'target': ''
                }
                if correspondence not in correspondences:
                    correspondences.append(correspondence)

        return correspondences

    @json_response_decorator
    def get_matrix_highlighting():
        dataset = Controller.get_arg('dataset')
        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        correspondences = Matrix.search_correspondences_for_term(dataset, filter_string)

        neo4j_requester = Neo4jRequester(dataset)
        relations = neo4j_requester.get_relations_for_correspondences(correspondences)

        links_to_highlight = []
        for relation in relations:
            links_to_highlight.append(relation['relation_id'])

        return links_to_highlight

    @json_response_decorator
    def get_matrix():
        dataset = Controller.get_arg('dataset')

        neo4j_requester = Neo4jRequester(dataset)
        relations = neo4j_requester.get_relations_for_connected_nodes()
        community_count = neo4j_requester.get_community_count()

        matrix = Matrix.build_matrix(relations, community_count)

        return matrix

    @staticmethod
    def build_matrix(relations, community_count=None):
        matrix = {
            'nodes': [],
            'links': [],
            'communityCount': 1
        }

        if community_count:
            matrix['communityCount'] = community_count

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
                i = i + 1

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
                i = i + 1

            matrix['links'].append(
                {
                    'id': relation['relation_id'],
                    'source': seen_nodes.index(relation['source_id']),
                    'target': seen_nodes.index(relation['target_id']),
                    'community': relation['source_community'],
                    'role': relation['source_role']
                }
            )

        return matrix

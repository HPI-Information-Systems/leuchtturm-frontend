"""The matrix api route can be used to get the data for our adjacency matrix from neo4j."""

from api.controller import Controller
import time
import datetime
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester


class Matrix(Controller):
    """Makes the get_matrix method accessible.

    Example requests:
    /api/matrix/full?dataset=enron

    /api/matrix/highlighting?dataset=enron&doc_id=1234&doc_id=1234
    """

    @json_response_decorator
    def get_matrix_highlighting():
        dataset = Controller.get_arg('dataset')
        doc_ids = Controller.get_arg_list('doc_id')

        start_date = Controller.get_arg('start_date', required=False)
        start_stamp = time.mktime(datetime.datetime.strptime(start_date, '%Y-%m-%d')
                                  .timetuple()) if start_date else 0
        end_date = Controller.get_arg('end_date', required=False)
        end_stamp = time.mktime(datetime.datetime.strptime(end_date, '%Y-%m-%d')
                                .timetuple()) if end_date else time.time()

        neo4j_requester = Neo4jRequester(dataset)
        relations = neo4j_requester.get_relations_for_doc_ids(doc_ids)

        links_to_highlight = []
        for relation in relations:
            links_to_highlight.append(
                {
                    'source': seen_nodes.index(relation['source_id']),
                    'target': seen_nodes.index(relation['target_id']),
                    'id': relation['relation_id']
                }
            )

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
            'links': []
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
                        'address': relation['source_email_address'],
                        'community': relation['source_community']
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
                        'address': relation['target_email_address'],
                        'community': relation['target_community']
                    }
                )
                seen_nodes.append(relation['target_id'])
                i = i + 1

            matrix['links'].append(
                {
                    'source': seen_nodes.index(relation['source_id']),
                    'target': seen_nodes.index(relation['target_id']),
                    'community': relation['source_community']
                }
            )

        return matrix

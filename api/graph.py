"""The graph api route can be used to get graph data from neo4j."""

from api.controller import Controller
from common.util import json_response_decorator, build_edge, build_node
from common.neo4j_requester import Neo4jRequester
import time
import datetime


class Graph(Controller):
    """Makes the get_graph method accessible.

    Example request:
    /api/graph?email_address=jaina@coned.com&email_address=technology.enron@enron.com&is_correspondent_view=true&dataset=enron&start_date=2001-05-20&end_date=2001-05-30
    """

    @json_response_decorator
    def get_graph():
        dataset = Controller.get_arg('dataset')
        is_correspondent_view = Controller.get_arg('is_correspondent_view', required=False)
        email_addresses = Controller.get_arg_list('email_address')
        neo4j_requester = Neo4jRequester(dataset)
        start_date = Controller.get_arg('start_date', required=False)
        start_stamp = time.mktime(datetime.datetime.strptime(start_date, '%Y-%m-%d')
                                  .timetuple()) if start_date else 0
        end_date = Controller.get_arg('end_date', required=False)
        end_stamp = time.mktime(datetime.datetime.strptime(end_date, '%Y-%m-%d')
                                .timetuple()) if end_date else time.time()

        graph = {
            'nodes': [],
            'links': []
        }
        visited_nodes = []

        for node in neo4j_requester.get_nodes_for_email_addresses(email_addresses):
            if not node['id'] in visited_nodes:
                visited_nodes.append(node['id'])
                graph['nodes'].append(
                    build_node(node['id'], node['email_address'])
                )

            if is_correspondent_view == 'true':
                for neighbour in neo4j_requester.get_neighbours_for_node(node['id'], start_stamp, end_stamp):
                    if not neighbour['id'] in visited_nodes:
                        visited_nodes.append(neighbour['id'])
                        graph['nodes'].append(
                            build_node(neighbour['id'], neighbour['email_address'])
                        )

            for relation in neo4j_requester.get_relations_for_nodes(visited_nodes, start_stamp, end_stamp):
                graph['links'].append(
                    build_edge(relation['relation_id'], relation['source_id'], relation['target_id'])
                )

        # add hops to connect lonely nodes with other nodes in graph
        if is_correspondent_view == 'false':  # we aren't in correspondent view, where no nodes without links should appear
            nodes = list(graph['nodes'])
            links = list(graph['links'])
            for node in nodes:
                has_links = False
                for link in links:
                    if (node['id'] == link['source']) or (node['id'] == link['target']):
                        if link['source'] != link['target']:
                            has_links = True

                if has_links:
                    continue
                other_nodes = list(visited_nodes)
                other_nodes.remove(node['id'])
                for hop in neo4j_requester.get_path_between_nodes(node['id'], other_nodes):
                    if not hop['hop_id'] in visited_nodes:
                        visited_nodes.append(hop['hop_id'])
                        graph['nodes'].append(
                            build_node(hop['hop_id'], hop['hop_email_address'])
                        )
                        graph['links'].append(
                            build_edge(hop['r1_id'], hop['source_id'], hop['hop_id'])
                        )
                        graph['links'].append(
                            build_edge(hop['r2_id'], hop['hop_id'], hop['target_id'])
                        )

        return graph

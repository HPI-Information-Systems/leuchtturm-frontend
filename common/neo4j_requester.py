"""Module for sending requests to neo4j."""

from neo4j.v1 import GraphDatabase
from common.util import get_config


class Neo4jRequester:
    """This class sends requests to a neo4j database and returns the results."""

    def __init__(self, dataset):
        """Build uri from config file."""
        config = get_config(dataset)
        host = config['NEO4J_CONNECTION']['Host']
        port = config['NEO4J_CONNECTION']['Bolt-Port']

        self.uri = ''.join(['bolt://',
                            host,
                            ':',
                            port])
        self.driver = GraphDatabase.driver(self.uri)

    def get_all_correspondents_for_email_address(self, email_address, start_time, end_time):
        """Get correspondents that send or received emails to or from a given email_address."""
        return self.get_correspondents_for_email_address(email_address, start_time, end_time, 'both')

    def get_sending_correspondents_for_email_address(self, email_address, start_time, end_time):
        """Get correspondents that send emails to a given email_address."""
        return self.get_correspondents_for_email_address(email_address, start_time, end_time, 'from')

    def get_receiving_correspondents_for_email_address(self, email_address, start_time, end_time):
        """Get correspondents that send emails to a given email_address."""
        return self.get_correspondents_for_email_address(email_address, start_time, end_time, 'to')

    def get_correspondents_for_email_address(self, email_address, start_time, end_time, direction='both'):
        """Fetch correspondents from neo4j for given email_address and communication direction."""
        neo4j_direction = '-[w:WRITESTO]-'
        if direction == 'from':
            neo4j_direction = '<-[w:WRITESTO]-'
        elif direction == 'to':
            neo4j_direction = '-[w:WRITESTO]->'

        results = []

        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run('MATCH (:Person {email: $email_address})' +
                                     neo4j_direction +
                                     '(correspondent:Person) '
                                     'WHERE filter(time in w.time_list WHERE time > $start_time and time < $end_time)'
                                     'RETURN correspondent.email, size(w.mail_list) '
                                     'ORDER BY size(w.mail_list) DESC',
                                     email_address=email_address,
                                     start_time=start_time,
                                     end_time=end_time):
                    correspondent = dict(email_address=record['correspondent.email'],
                                         count=record['size(w.mail_list)'])
                    results.append(correspondent)
        return results

    # GRAPH RELATED

    def get_nodes_for_email_addresses(self, email_addresses):
        """Return nodes for a list of email addresses."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                nodes = tx.run('MATCH(node:Person) '
                               'WHERE node.email IN $email_addresses '
                               'RETURN id(node) AS id, node.email AS email_address',
                               email_addresses=email_addresses)
        return nodes

    def get_neighbours_for_node(self, node_id, start_time, end_time):
        """Return neigbours for a node."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                neighbours = tx.run('MATCH(identified:Person)-[w:WRITESTO]-(neighbour:Person) '
                                    'WHERE id(identified) = $node_id '
                                    'AND filter(time in w.time_list WHERE time > $start_time and time < $end_time)'
                                    'RETURN id(neighbour) AS id, neighbour.email AS email_address '
                                    'ORDER BY size(w.mail_list) DESC LIMIT 10',
                                    node_id=node_id,
                                    start_time=start_time,
                                    end_time=end_time)
        return neighbours

    def get_relations_for_nodes(self, node_ids, start_time, end_time):
        """Return relations for nodes."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                relations = tx.run('MATCH(source:Person)-[w:WRITESTO]->(target:Person) '
                                   'WHERE id(source) IN $node_ids AND id(target) IN $node_ids '
                                   'AND filter(time in w.time_list WHERE time > $start_time and time < $end_time)'
                                   'RETURN id(w) AS relation_id, id(source) AS source_id, id(target) AS target_id',
                                   node_ids=node_ids,
                                   start_time=start_time,
                                   end_time=end_time)
        return relations

    def get_path_between_nodes(self, node_id, other_nodes):
        """Return nodes and links connecting one node with the others over max 1 hop."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                relations = tx.run("MATCH(source:Person)-[r1:WRITESTO]-(b)-[r2:WRITESTO]-(target:Person) "
                                   "WHERE id(source) = $node_id AND id(target) IN $other_nodes "
                                   "RETURN id(r1) AS r1_id, id(source) AS source_id, id(target) AS target_id, "
                                   "id(r2) AS r2_id, id(b) AS hop_id, b.email AS hop_email_address LIMIT 1",
                                   node_id=node_id, other_nodes=other_nodes)
        return relations

    # MATRIX RELATED

    def get_relations_for_connected_nodes(self):
        """Return all Nodes."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                nodes = tx.run('MATCH (s:Person)-[r]->(t) WHERE ()<--(s)<--() AND ()<--(t)<--() '
                               'RETURN id(r) as relation_id, '
                               'id(s) AS source_id, s.email AS source_email_address, '
                               's.community AS source_community, s.role AS source_role, '
                               'id(t) AS target_id, t.email AS target_email_address, '
                               't.community AS target_community, t.role AS target_role LIMIT 600')
        return nodes

    def get_relations_for_correspondences(self, correspondences):
        """Return all Relations for a given list of correspondences (source - target dicts)."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                relations = tx.run('UNWIND $correspondences AS cor '
                                   'MATCH (source:Person)-[w:WRITESTO]->(target:Person) '
                                   'WHERE source.email = cor.source AND target.email = cor.target '
                                   'RETURN DISTINCT id(w) AS relation_id',
                                   correspondences=correspondences)
        return relations

    def get_community_count(self):
        """Return number of communities in network."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                community_count = tx.run('MATCH (n) WHERE EXISTS(n.community) '
                                         'RETURN n.community ORDER BY n.community DESC LIMIT 1')

        for c in community_count:
            count = c['n.community'] + 1

        return count

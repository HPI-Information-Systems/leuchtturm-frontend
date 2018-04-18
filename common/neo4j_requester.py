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

        self.uri = ''.join(["bolt://",
                            host,
                            ":",
                            port])
        self.driver = GraphDatabase.driver(self.uri)

    def get_all_correspondents_for_email_address(self, email_address):
        """Get correspondents that send or received emails to or from a given email_address."""
        return self.get_correspondents_for_email_address(email_address, "both")

    def get_sending_correspondents_for_email_address(self, email_address):
        """Get correspondents that send emails to a given email_address."""
        return self.get_correspondents_for_email_address(email_address, "from")

    def get_receiving_correspondents_for_email_address(self, email_address):
        """Get correspondents that send emails to a given email_address."""
        return self.get_correspondents_for_email_address(email_address, "to")

    def get_correspondents_for_email_address(self, email_address, direction="both"):
        """Fetch correspondents from neo4j for given email_address and communication direction."""
        neo4j_direction = "-[w:WRITESTO]-"
        if direction == "from":
            neo4j_direction = "<-[w:WRITESTO]-"
        elif direction == "to":
            neo4j_direction = "-[w:WRITESTO]->"

        results = []

        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run("MATCH (:Person {email: $email_address})" +
                                     neo4j_direction +
                                     "(correspondent:Person) "
                                     "RETURN correspondent.email, size(w.mail_list) "
                                     "ORDER BY size(w.mail_list) DESC",
                                     email_address=email_address):
                    correspondent = dict(email_address=record["correspondent.email"],
                                         count=record["size(w.mail_list)"])
                    results.append(correspondent)
        return results

    # GRAPH RELATED

    def get_nodes_for_email_addresses(self, email_addresses):
        """Return nodes for a list of email addresses."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                nodes = tx.run("MATCH(node:Person) "
                               "WHERE node.email IN $email_addresses "
                               "RETURN id(node) AS id, node.email AS email_address",
                               email_addresses=email_addresses)
        return nodes

    def get_neighbours_for_node(self, node_id):
        """Return neigbours for a node."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                neighbours = tx.run("MATCH(identified:Person)-[w:WRITESTO]-(neighbour:Person) "
                                    "WHERE id(identified) = $node_id "
                                    "RETURN id(neighbour) AS id, neighbour.email AS email_address "
                                    "ORDER BY size(w.mail_list) DESC LIMIT 10",
                                    node_id=node_id)
        return neighbours

    def get_relations_for_nodes(self, node_ids):
        """Return neigbours for a node."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                relations = tx.run("MATCH(source:Person)-[w:WRITESTO]->(target:Person) "
                                   "WHERE id(source) IN $node_ids AND id(target) IN $node_ids "
                                   "RETURN id(w) AS relation_id, id(source) AS source_id, id(target) AS target_id",
                                   node_ids=node_ids)
        return relations

    def get_nodes(self):
        """Return all Nodes."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                nodes = tx.run("MATCH(node:Person) "
                               "RETURN id(node) AS id, node.email AS email_address LIMIT 70")
        return nodes
    
    def get_relations(self):
        """Return all Relations."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                relations = tx.run("MATCH(source:Person)-[w:WRITESTO]->(target:Person) "
                                   "RETURN id(w) AS relation_id, id(source) AS source_id, id(target) AS target_id LIMIT 100000")
        return relations
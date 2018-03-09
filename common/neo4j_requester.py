"""Module for sending requests to neo4j."""

import configparser
from os import path
from neo4j.v1 import GraphDatabase


class Neo4jRequester:
    """This class sends requests to a neo4j database and returns the results."""

    def __init__(self):
        """Get uri from config file."""
        configpath = path.join(path.dirname(path.abspath(__file__)), 'config.ini')
        self.config = configparser.ConfigParser()
        self.config.read(configpath)
        self.uri = ''.join(["bolt://",
                            self.config['NEO4J_CONNECTION']['Host'],
                            ":",
                            self.config['NEO4J_CONNECTION']['Bolt-Port']])
        self.driver = GraphDatabase.driver(self.uri)
        self.results = []

    def get_correspondents_for_email_address(self, mail):
        """Search correspondents by mail-address of sender."""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run("MATCH (:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent:Person) "
                                     "RETURN correspondent.email, size(w.mail_list)",
                                     sender_mail=mail):
                    correspondent = dict(email_address=record["correspondent.email"],
                                         count=record["size(w.mail_list)"])
                    self.results.append(correspondent)
        return self.results

    def build_node(self, id, name):
        return {
            "id": id,
            "type": 'person',
            "icon": '\uf2be',
            "props": {
                "name": name,
                "__radius": 16,
                "__color": '#000000'
            }
        }

    def build_edge(self, id, source_id, target_id):
        return {
            "id": id,
            "type": '',
            "props": {},
            "source": source_id,
            "sourceId": source_id,
            "target": target_id,
            "targetId": target_id,
        }

    def get_graph_for_email_address(self, source_email_addresses):
        """Return graph for a given email address."""
        graph = {
            "nodes": [],
            "links": []
        }
        visited_nodes = []

        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for sender in tx.run("MATCH(sender:Person) "
                                     "WHERE sender.email IN $source_email_addresses "
                                     "RETURN id(sender), sender.email",
                                     source_email_addresses=source_email_addresses):
                    if not sender["id(sender)"] in visited_nodes:
                        visited_nodes.append(sender["id(sender)"])
                        graph["nodes"].append(self.build_node(sender["id(sender)"], sender["sender.email"]))

                    for relation in tx.run("MATCH(source:Person)-[w:WRITESTO]->(target:Person) "
                                           "WHERE id(source) = $sender_id OR id(target) = $sender_id "
                                           "RETURN  id(w), id(source), source.email, id(target), target.email "
                                           "ORDER BY size(w.mail_list) DESC LIMIT 10",
                                           sender_id=sender["id(sender)"]):
                        graph["links"].append(
                            self.build_edge(relation["id(w)"], relation["id(source)"], relation["id(target)"])
                        )

                        if not relation["id(source)"] in visited_nodes:
                            visited_nodes.append(relation["id(source)"])
                            graph["nodes"].append(self.build_node(relation["id(source)"], relation["source.email"]))
                        if not relation["id(target)"] in visited_nodes:
                            visited_nodes.append(relation["id(target)"])
                            graph["nodes"].append(self.build_node(relation["id(target)"], relation["target.email"]))
        return graph

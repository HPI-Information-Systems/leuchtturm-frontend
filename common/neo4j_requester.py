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

    def get_graph_for_email_address(self, mail):
        """Return graph for a given email address."""
        graph = {"nodes": [], "links": []}
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for sender in tx.run("MATCH(sender:Person{email: $sender_mail}) RETURN toInteger(id(sender)) AS id",
                                     sender_mail=mail):
                    graph["nodes"].append({
                        "id": sender["id"],
                        "type": 'person',
                        "props": {
                            "name": mail,
                            "__radius": 15,
                            "__color": '#000000'
                        }
                    })
                    for relation in tx.run("MATCH(:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent:Person) "
                                           "RETURN id(correspondent), correspondent.email, id(w), w.mail_list",
                                           sender_mail=mail):
                        graph["nodes"].append({
                            "id": relation["id(correspondent)"],
                            "type": 'person',
                            "props": {
                                "name": relation["correspondent.email"],
                                "__radius": 15,
                                "__color": '#000000'
                            }
                        })
                        graph["links"].append({
                            "id": relation["id(w)"],
                            "type": '',
                            "props": {},
                            "source": sender["id"],
                            "target": relation["id(correspondent)"],
                            "sourceId": sender["id"],
                            "targetId": relation["id(correspondent)"],
                            "mailList": relation["w.mail_list"]
                        })
        return graph

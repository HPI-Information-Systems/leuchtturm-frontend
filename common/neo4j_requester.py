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
        addresses = [mail]
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for sender in tx.run("MATCH(sender:Person{email: $sender_mail}) RETURN id(sender) AS id",
                                     sender_mail=mail):
                    graph["nodes"].append({
                        "id": sender["id"],
                        "type": 'person',
                        "icon": '\uf2be',
                        "props": {
                            "name": mail,
                            "__radius": 16,
                            "__color": '#000000'
                        }
                    })
                    for node in tx.run("MATCH(:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent:Person) "
                                            "RETURN id(correspondent), correspondent.email, w.mail_list "
                                            "ORDER BY size(w.mail_list) DESC LIMIT 10",
                                            sender_mail=mail):
                        if not node["correspondent.email"] in addresses:
                            addresses.append(node["correspondent.email"])
                            graph["nodes"].append({
                                "id": node["id(correspondent)"],
                                "type": 'person',
                                "icon": '\uf2be',
                                "props": {
                                    "name": node["correspondent.email"],
                                    "__radius": 16,
                                    "__color": '#000000'
                                }
                            })

                    for relation in tx.run("MATCH(personA:Person)-[w:WRITESTO]->(personB:Person) "
                                            "WHERE personA.email IN $addresses AND personB.email IN $addresses "
                                            "RETURN id(personA), id(personB), id(w)",
                                            addresses=addresses):
                        graph["links"].append({
                            "id": relation["id(w)"],
                            "type": '',
                            "props": {},
                            "source": relation["id(personA)"],
                            "target": relation["id(personB)"],
                            "sourceId": relation["id(personA)"],
                            "targetId": relation["id(personB)"]
                        })
        return graph

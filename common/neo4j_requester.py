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
                for record in tx.run("MATCH (sender:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent) "
                                     "RETURN correspondent.email, size(w.mail_list)",
                                     sender_mail=mail):
                    correspondent = dict(email_address=record["correspondent.email"],
                                         count=record["size(w.mail_list)"])
                    self.results.append(correspondent)
        return self.results

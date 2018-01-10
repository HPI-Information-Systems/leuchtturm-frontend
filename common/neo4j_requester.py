"""Module for sending requests to neo4j. No flowers here."""

import configparser
from os import path
from neo4j.v1 import GraphDatabase

class Neo4jRequester:
    """This class sends requests to a neo4j database and returns the results."""

    def __init__(self):
        """get uri from config file"""
        configpath = path.join(path.dirname(path.abspath(__file__)), 'config.ini')
        self.config = configparser.ConfigParser()
        self.config.read(configpath)
        self.uri = self.config['NEO4J_CONNECTION']['uri']
        self.driver = GraphDatabase.driver(self.uri)
        self.results = []

    def search_by_name(self, name):
        """Search correspondents by name of sender"""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run("MATCH (sender:Person)-[w:WRITESTO]-(correspondent) "
                                        "WHERE $sender_name IN sender.name "
                                        "RETURN correspondent.name, correspondent.email", sender_name=name):
                    correspondent = dict(name=record["correspondent.name"], mail="correspondent.email")
                    self.results.append(correspondent)
        return self.results

    def search_by_mail(self, mail):
        """Search correspondents by mail-address of sender"""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run("MATCH (sender:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent) "
                                        "RETURN correspondent.name, correspondent.email", sender_mail=mail):
                    correspondent = dict(name=record["correspondent.name"], mail="correspondent.email")
                    self.results.append(correspondent)
                    print("correspondent:   ", correspondent)
        return self.results

    def search_by_name_and_mail(self, name, mail):
        """Search correspondents by name and mail-address of sender"""
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for record in tx.run("MATCH (sender:Person {email: $sender_mail})-[w:WRITESTO]-(correspondent) "
                                        "WHERE $sender_name IN sender.name "
                                        "RETURN correspondent.name, correspondent.email",
                                        sender_name=name, sender_mail=mail):
                    correspondent = dict(name=record["correspondent.name"], mail="correspondent.email")
                    self.results.append(correspondent)
        return self.results

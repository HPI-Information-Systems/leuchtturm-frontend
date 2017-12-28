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
        self.driver = GraphDatabase.driver(uri)

    def search_by_name_cypher(self, tx, name)
        recipients = tx.run("MATCH (sender:Person) -[w:WRITESTO]->(recipients) "
                "WHERE $sender_name IN sender.name "
                "RETURN recipients", sender_name=name)
        return recipients

    def search_by_name(self, name):
        """Search recipients by name of sender"""
        with self.driver.session() as session:
            recipients = session.read_transaction(self.search_by_name_cypher, name)
            return recipients

    def search_by_mail_cypher(self, tx, mail)
        recipients = tx.run("MATCH (sender:Person {email: $sender_mail}) -[w:WRITESTO]->(recipients) "
                            "RETURN recipients", sender_mail=mail)
        return recipients

    def search_by_mail(self, mail):
        """Search recipients by mail-address of sender"""
        with self.driver.session() as session:
            recipients = session.read_transaction(self.search_by_mail_cypher, mail)
            return recipients

    

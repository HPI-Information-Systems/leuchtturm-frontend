"""Module for sending requests to neo4j."""

from neo4j.v1 import GraphDatabase


class Neo4jRequester:
    """This class sends requests to a neo4j database and returns the results."""

    def __init__(self, host, port):
        """Get uri from config file."""
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

    def get_graph_for_email_addresses(self, source_email_addresses):
        """Return graph for a given list of email addresses, graph containing also their neighbour nodes."""
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

                    for node in tx.run("MATCH(identified:Person)-[w:WRITESTO]-(correspondent:Person) "
                                       "WHERE id(identified) = $sender_id "
                                       "RETURN id(correspondent), correspondent.email "
                                       "ORDER BY size(w.mail_list) DESC LIMIT 10",
                                       sender_id=sender["id(sender)"]):
                        if not node["id(correspondent)"] in visited_nodes:
                            visited_nodes.append(node["id(correspondent)"])
                            graph["nodes"].append(
                                self.build_node(node["id(correspondent)"], node["correspondent.email"])
                            )

                    for relation in tx.run("MATCH(source:Person)-[w:WRITESTO]->(target:Person) "
                                           "WHERE id(source) IN $node_ids AND id(target) IN $node_ids "
                                           "RETURN id(w), id(source), id(target)",
                                           node_ids=visited_nodes):
                        graph["links"].append(
                            self.build_edge(relation["id(w)"], relation["id(source)"], relation["id(target)"])
                        )

        return graph

    def get_graph_for_email_addresses_only(self, email_addresses):
        """Return graph for a given list of email addresses, graph containing only their nodes."""
        graph = {
            "nodes": [],
            "links": []
        }
        visited_nodes = []
        print('GOT EMAIL_ADDRESSES')
        print(email_addresses)
        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                for relation in tx.run("MATCH(source:Person)-[w:WRITESTO]->(target:Person) "
                                        "WHERE source.email IN $email_addresses AND target.email IN $email_addresses "
                                        "RETURN id(w), id(source), id(target), source.email, target.email",
                                        email_addresses=email_addresses):
                    if not relation["id(source)"] in visited_nodes:
                        visited_nodes.append(relation["id(source)"])
                        graph["nodes"].append(self.build_node(relation["id(source)"], relation["source.email"]))
                    if not relation["id(target)"] in visited_nodes:
                        visited_nodes.append(relation["id(target)"])
                        graph["nodes"].append(self.build_node(relation["id(target)"], relation["target.email"]))
                    graph["links"].append(
                        self.build_edge(relation["id(w)"], relation["id(source)"], relation["id(target)"])
                    )
        print('GOT GRAPH')
        print(graph)
        return graph

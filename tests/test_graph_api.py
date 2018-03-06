"""Tests for the graph route."""
from flask import url_for


class MetaTestGraph:
    """This class lets you configure some parameters for all queries invoked in the Topics API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        # 'core': 'pytest'
    }


class TestTopics(MetaTopicsSearch):
    """Tests for the graph API."""

    def test_graph_status(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com'
        }
        res = client.get(url_for('api.topics', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_graph_error(self, client):
        res = client.get(url_for('api.graph'))
        assert res.json['response'] == 'Error'

    def test_graph_response_structure(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com'
        }
        res = client.get(url_for('api.graph', **self.params))
        assert 'nodes', 'links' in res.json['response']
        assert 'icon', 'id', 'props', 'type' in res.json['response']['nodes'][0]
        assert '__color', '__radius', 'name' in res.json['response']['nodes'][0]['props']
        assert 'id', 'props', 'source', 'sourceId', 'target', 'targetId', 'type' in res.json['response']['links'][0]

    def test_graph_no_correspondents_found(self, client):
        self.params = {
            **self.params,
            'email_address': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.graph', **self.params))
        assert res.json['response'] == {'links': [], 'nodes': []}
        assert res.json['responseHeader']['status'] == "OK"

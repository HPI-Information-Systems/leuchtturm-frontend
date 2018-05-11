"""Tests for the graph route."""
from flask import url_for
from .meta_test import MetaTest


class TestGraph(MetaTest):
    """Tests for the graph route."""

    def test_graph_status(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com'
        }
        res = client.get(url_for('api.graph', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_graph_missing_parameter_error(self, client):
        res = client.get(url_for('api.graph'))
        assert res.json['response'] == 'Error'

    def test_graph_response_structure(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com',
            'correspondentView': 'true'
        }
        res = client.get(url_for('api.graph', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        for key in ['nodes', 'links']:
            assert key in res.json['response']
        for key in ['icon', 'id', 'props', 'type']:
            assert key in res.json['response']['nodes'][0]
        for key in ['__color', '__radius', 'name']:
            assert key in res.json['response']['nodes'][0]['props']
        for key in ['id', 'props', 'source', 'sourceId', 'target', 'targetId', 'type']:
            assert key in res.json['response']['links'][0]

    def test_graph_no_correspondents_found(self, client):
        self.params = {
            **self.params,
            'email_address': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.graph', **self.params))
        assert res.json['response'] == {'links': [], 'nodes': []}
        assert res.json['responseHeader']['status'] == "Ok"

"""Tests for the matrix route."""
from flask import url_for
from .meta_test import MetaTest


class TestMatrix(MetaTest):
    """Tests for the matrix route."""

    def test_matrix_status(self, client):
        res = client.get(url_for('api.matrix', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_matrix_missing_parameter_error(self, client):
        res = client.get(url_for('api.matrix'))
        assert res.json['response'] == 'Error'

    def test_matrix_response_structure(self, client):
        res = client.get(url_for('api.matrix', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        for key in ['nodes', 'links', 'community_count']:
            assert key in res.json['response']
        for key in ['index', 'count', 'id', 'identifying_name', 'community', 'role']:
            assert key in res.json['response']['nodes'][0]
        for key in ['source', 'target', 'community', 'source_identifying_name', 'target_identifying_name']:
            assert key in res.json['response']['links'][0]

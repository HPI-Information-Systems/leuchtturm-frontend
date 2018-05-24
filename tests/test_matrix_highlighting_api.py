"""Tests for the matrix_highlighting route."""
import json
from flask import url_for
from .meta_test import MetaTest


class TestMatrixHighlighting(MetaTest):
    """Tests for the matrix_highlighting route."""

    def test_matrix_highlighting_status(self, client):
        filter_query = json.dumps({'searchTerm': 'hello'})
        self.params = {
            **self.params,
            'filters': filter_query
        }
        res = client.get(url_for('api.matrix_highlighting', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_matrix_highlighting_missing_parameter_error(self, client):
        res = client.get(url_for('api.matrix_highlighting'))
        assert res.json['response'] == 'Error'

    def test_matrix_highlighting_response_structure(self, client):
        filter_query = json.dumps({'searchTerm': 'hello'})
        self.params = {
            **self.params,
            'filters': filter_query
        }
        res = client.get(url_for('api.matrix_highlighting', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        assert isinstance(res.json['response'], list)
        for key in ['source', 'target']:
            assert key in res.json['response'][0]

    def test_matrix_highlighting_no_result(self, client):
            filter_query = json.dumps({'searchTerm': 'basdlföasdföasföouweuwaf02338fwnfasj'})
            self.params = {
                **self.params,
                'filters': filter_query
            }
            res = client.get(url_for('api.matrix_highlighting', **self.params))
            assert len(res.json['response']) == 0

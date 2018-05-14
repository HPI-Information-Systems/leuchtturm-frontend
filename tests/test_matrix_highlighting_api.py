"""Tests for the matrix_highlighting route."""
from flask import url_for
from .meta_test import MetaTest


class TestMatrixHighlighting(MetaTest):
    """Tests for the matrix_highlighting route."""

    def test_matrix_highlighting_status(self, client):
        self.params = {
            **self.params,
            'dataset': 'dnc-sopedu',
            'term': 'and'
        }
        res = client.get(url_for('api.matrix_highlighting', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_matrix_highlighting_missing_parameter_error(self, client):
        res = client.get(url_for('api.matrix_highlighting'))
        assert res.json['response'] == 'Error'

    def test_matrix_highlighting_response_structure(self, client):
        self.params = {
            **self.params,
            'dataset': 'dnc-sopedu',
            'term': 'hello'
        }
        res = client.get(url_for('api.matrix_highlighting', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        assert isinstance(res.json['response'], list)
        for link in res.json['response']:
            assert isinstance(link, int)

    def test_matrix_highlighting_no_result(self, client):
            self.params = {
                **self.params,
                'dataset': 'dnc-sopedu',
                'term': 'basdlföasdföasföouweuwaf02338fwnfasj'
            }
            res = client.get(url_for('api.matrix_highlighting', **self.params))
            assert len(res.json['response']) == 0

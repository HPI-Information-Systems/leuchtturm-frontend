"""Tests for the graph route."""
from flask import url_for
from .meta_test import MetaTest


class TestDatasets(MetaTest):
    """Tests for the datasets route."""

    def test_datasets_status(self, client):
        res = client.get(url_for('api.datasets', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_dataset_response_structure(self, client):
        res = client.get(url_for('api.datasets', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        for item in res.json['response']:
            assert type(item) is str

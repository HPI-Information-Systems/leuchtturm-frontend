"""Tests for email route."""
from flask import url_for
from .meta_test import MetaTest


class TestSimilarEmail(MetaTest):
    """Tests for email route."""

    def test_similar_mails_status(self, client):
        self.params = {
            **self.params,
            'doc_id': '*'
        }
        res = client.get(url_for('api.similar_mails', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_similar_mails_missing_parameter_error(self, client):
        res = client.get(url_for('api.similar_mails'))
        assert res.json['response'] == 'Error'

    def test_similar_mails_result(self, client):
        self.params = {
            **self.params,
            'doc_id': '*'
        }
        res = client.get(url_for('api.similar_mails', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['body', 'doc_id', 'entities', 'header', 'id', 'lang', 'raw', 'topics']:
            assert key in res.json['response'][0]

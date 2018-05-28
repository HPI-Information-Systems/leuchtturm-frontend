"""Tests for email route."""
from flask import url_for
from .meta_test import MetaTest


class TestEmail(MetaTest):
    """Tests for email route."""

    def test_email_status(self, client):
        self.params = {
            **self.params,
            'doc_id': '*'
        }
        res = client.get(url_for('api.email', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_email_missing_parameter_error(self, client):
        res = client.get(url_for('api.email'))
        assert res.json['response'] == 'Error'

    def test_email_result(self, client):
        self.params = {
            **self.params,
            'doc_id': '*'
        }
        res = client.get(url_for('api.email', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['email', 'numFound', 'searchTerm']:
            assert key in res.json['response']
        for key in ['body', 'doc_id', 'entities', 'header', 'id', 'lang', 'raw']:
            assert key in res.json['response']['email']

    def test_email_no_result(self, client):
        self.params = {
            **self.params,
            'doc_id': 'doesnt-exist'
        }
        res = client.get(url_for('api.email', **self.params))
        assert res.json['response']['response']['numFound'] == 0

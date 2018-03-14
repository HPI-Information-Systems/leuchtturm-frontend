"""Tests for the terms for correspondent route."""
from flask import url_for
from .meta_test import MetaTest


class TestTermsForCorrespondent(MetaTest):
    """Tests for the terms for correspondent route."""

    def test_terms_for_correspondent_status(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com',
            'limit': 10
        }
        res = client.get(url_for('api.terms_for_correspondent', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_terms_for_correspondent_missing_parameter_error(self, client):
        res = client.get(url_for('api.terms_for_correspondent'))
        assert res.json['response'] == 'Error'

    def test_terms_for_correspondent_result(self, client):
        self.params = {
            **self.params,
            'email_address': 'scott.neal@enron.com',
            'limit': 10
        }
        res = client.get(url_for('api.terms_for_correspondent', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['count', 'entity', 'type']:
            assert key in res.json['response'][0]

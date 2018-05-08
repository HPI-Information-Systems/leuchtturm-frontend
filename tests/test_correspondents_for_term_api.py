"""Tests for the correspondents for term route."""
from flask import url_for
from .meta_test import MetaTest


class TestCorrespondentsForTerm(MetaTest):
    """Tests for the correspondents for term route."""

    def test_correspondents_for_term_status(self, client):
        self.params = {
            **self.params,
            'filters': '{"searchTerm":"Hello"}'
        }
        res = client.get(url_for('api.correspondents_for_term', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_correspondents_for_term_missing_parameter_error(self, client):
        res = client.get(url_for('api.correspondents_for_term'))
        assert res.json['response'] == 'Error'

    def test_correspondents_for_term_result(self, client):
        self.params = {
            **self.params,
            'filters': '{"searchTerm":"Hello"}'
        }
        res = client.get(url_for('api.correspondents_for_term', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        assert 'correspondents' in res.json['response']
        for key in ['count', 'email_address']:
            assert key in res.json['response']['correspondents'][0]

    def test_correspondents_for_term_empty_result(self, client):
        self.params = {
            **self.params,
            'filters': '{"searchTerm":"123456789asdfghjkl123456789sdfghjkl1qasz2wedfv45tyhjm9ijhgbvcxsertyuj"}'
        }
        res = client.get(url_for('api.correspondents_for_term', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        assert 'correspondents' in res.json['response']
        assert len(res.json['response']['correspondents']) == 0

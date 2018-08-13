"""Tests for the correspondents for term route."""
from flask import url_for
from .meta_test import MetaTest
import json


class TestCorrespondentsForTerm(MetaTest):
    """Tests for the correspondents for term route."""

    def test_correspondents_for_search_status(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.correspondents_for_search', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_correspondents_for_search_missing_parameter_error(self, client):
        res = client.get(url_for('api.correspondents_for_search'))
        assert res.json['response'] == 'Error'

    def test_correspondents_for_search_result(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.correspondents_for_search', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        assert 'correspondents' in res.json['response']
        for key in ['count', 'identifying_name', 'hierarchy', 'community', 'role']:
            assert key in res.json['response']['correspondents'][0]

    def test_correspondents_for_search_empty_result(self, client):
        term = '123456789asdfghjkl123456789sdfghjkl1qasz2wedfv45tyhjm9ijhgbvcxsertyuj'
        filter_term = json.dumps({'searchTerm': term})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.correspondents_for_search', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        assert 'correspondents' in res.json['response']
        assert len(res.json['response']['correspondents']) == 0

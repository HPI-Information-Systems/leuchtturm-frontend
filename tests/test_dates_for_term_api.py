"""Tests for the dates for term route."""
from flask import url_for
from .meta_test import MetaTest


class TestDatesForTerm(MetaTest):
    """Tests for the dates for term route."""

    def test_dates_for_term_status(self, client):
        self.params = {
            **self.params,
            'term': 'Hello'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_dates_for_term_missing_parameter_error(self, client):
        res = client.get(url_for('api.dates_for_term'))
        assert res.json['response'] == 'Error'

    def test_dates_for_term_result(self, client):
        self.params = {
            **self.params,
            'term': 'Hello'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['count', 'date']:
            assert key in res.json['response'][0]

    def test_dates_for_term_empty_result(self, client):
        self.params = {
            **self.params,
            'term': '83283283289328932893289932892389308310138138138013803108318013'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        assert len(res.json['response']) == 0

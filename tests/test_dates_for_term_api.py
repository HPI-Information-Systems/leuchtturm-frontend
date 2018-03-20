"""Tests for the dates for term route."""
from flask import url_for
from .meta_test import MetaTest


class TestDatesForTerm(MetaTest):
    """Tests for the dates for term route."""

    def test_dates_for_term_status(self, client):
        self.params = {
            **self.params,
            'term': 'Potsdam',
            'range_start': '1980-01-01T00:00:00.000Z',
            'range_end': '1989-01-02T00:00:00.000Z'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_dates_for_term_missing_parameter_error(self, client):
        res = client.get(url_for('api.dates_for_term'))
        assert res.json['response'] == 'Error'

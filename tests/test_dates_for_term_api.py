"""Tests for the dates for term route."""
from flask import url_for
from .meta_test import MetaTest


class TestDatesForTerm(MetaTest):
    """Tests for the dates for term route."""

    def test_dates_for_term_status(self, client):
        self.params = {
            **self.params,
            'term': 'Potsdam'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_dates_for_term_range_parameters(self, client):
        self.params = {
            **self.params,
            'term': 'hello',
            'start_date': '2000-05-05',
            'end_date': '2001-02-02'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        if res.json['response'][0]:
            assert int(res.json['response'][0]['date'].split("/")[0]) >= 5
            assert int(res.json['response'][0]['date'].split("/")[1]) >= 2000
        if res.json['response'][0]:
            assert int(res.json['response'][-1]['date'].split("/")[0]) <= 1
            assert int(res.json['response'][-1]['date'].split("/")[1]) <= 2001

    def test_dates_for_term_missing_parameter_error(self, client):
        res = client.get(url_for('api.dates_for_term'))
        assert res.json['response'] == 'Error'

    def test_dates_for_term_response_structure(self, client):
        self.params = {
            **self.params,
            'term': 'Potsdam'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        assert type(res.json['response']) is list
        for key in ['count', 'date']:
            assert key in res.json['response'][0]
        assert type(res.json['response'][0]['count']) is int
        assert type(res.json['response'][0]['date']) is str

    def test_dates_for_term_no_dates_found(self, client):
        self.params = {
            **self.params,
            'term': 'hasso.plattner@hpi.uni-potsdam.de',
            'start_date': '1980-01-01',
            'end_date': '1983-01-02'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        for entry in res.json['response']:
            assert entry['count'] == 0
        assert res.json['responseHeader']['status'] == "Ok"

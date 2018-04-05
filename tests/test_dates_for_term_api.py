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
            'range_start': '2000-05-05T00:00:00.000Z',
            'range_end': '2001-01-02T00:00:00.000Z'
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
            'range_start': '1980-01-01T00:00:00.000Z',
            'range_end': '1989-01-02T00:00:00.000Z'
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert res.json['response'] == []
        assert res.json['responseHeader']['status'] == "Ok"
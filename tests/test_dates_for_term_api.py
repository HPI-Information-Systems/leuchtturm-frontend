"""Tests for the dates for term route."""
from flask import url_for
from .meta_test import MetaTest
import json


class TestDatesForTerm(MetaTest):
    """Tests for the dates for term route."""

    def test_dates_for_term_status(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_dates_for_term_range_parameters(self, client):
        term = 'and'
        start_date = '2000-01-01'
        end_date = '2001-12-30'
        filter_term = json.dumps({'searchTerm': term, 'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        if res.json['response']['months'][0]:
            assert int(res.json['response']['months'][0]['date'].split("/")[1]) >= 2000
        if res.json['response']['months'][0]:
            assert int(res.json['response']['months'][-1]['date'].split("/")[1]) <= 2001

        start_date = '2000-05-05'
        end_date = '2000-08-08'
        filter_term = json.dumps({'searchTerm': term, 'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        if res.json['response']['months'][0]:
            assert int(res.json['response']['months'][0]['date'].split("/")[0]) >= 5
        if res.json['response']['months'][0]:
            assert int(res.json['response']['months'][-1]['date'].split("/")[0]) <= 8

    def test_dates_for_term_missing_parameter_error(self, client):
        res = client.get(url_for('api.dates_for_term'))
        assert res.json['response'] == 'Error'

    def test_dates_for_term_response_structure(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        for key in ['months', 'weeks', 'days']:
            assert key in res.json['response']
            for entry in ['count', 'date']:
                assert entry in res.json['response'][key][0]
            assert type(res.json['response'][key][0]['count']) is int
            assert type(res.json['response'][key][0]['date']) is str

    def test_dates_for_term_no_dates_found(self, client):
        term = '123456789asdfghjkl123456789sdfghjkl1qasz2wedfv45tyhjm9ijhgbvcxstyuj'
        start_date = '2000-01-01'
        end_date = '2001-12-30'
        filter_term = json.dumps({'searchTerm': term, 'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.dates_for_term', **self.params))
        for key in ['months', 'weeks', 'days']:
            assert key in res.json['response']
            for entry in res.json['response'][key]:
                assert entry['count'] == 0
        assert res.json['responseHeader']['status'] == "Ok"

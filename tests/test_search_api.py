"""Tests with configuration for the Flask Search API."""
from flask import url_for
from tests.meta_test import MetaTest


class TestSearch(MetaTest):
    """Tests for the Flask Search API."""

    def test_search_status(self, client):
        self.params = {
            **self.params,
            'term': 'and'
        }
        res = client.get(url_for('api.search', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_search_missing_parameter_error(self, client):
        res = client.get(url_for('api.search'))
        assert res.json['response'] == 'Error'

    def test_search(self, client):
        self.params = {
            **self.params,
            'term': 'and'
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['responseHeader']['message'] == 'All Good'

        # check structure of returned JSON
        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['message', 'responseTime', 'status']:
            assert key in res.json['responseHeader']
        for key in ['numFound', 'results']:
            assert key in res.json['response']
        for key in ['body', 'doc_id', 'entities', 'header', 'lang', 'raw']:
            assert key in res.json['response']['results'][0]
        for key in ['date', 'subject']:
            assert key in res.json['response']['results'][0]['header']
        entities = res.json['response']['results'][0]['entities']
        assert entities['organization']

    def test_search_pagination(self, client):
        self.params = {
            **self.params,
            'term': 'and',
            'offset': 1,
            'limit': 2
        }
        res_paginated = client.get(url_for('api.search', **self.params))
        assert res_paginated.json['responseHeader']['status'] == 'Ok'
        assert len(res_paginated.json['response']['results']) == self.params['limit']

        del self.params['offset']
        del self.params['limit']
        res_unpaginated = client.get(url_for('api.search', **self.params))
        assert res_paginated.json['response']['results'][0]['doc_id'] \
            == res_unpaginated.json['response']['results'][1]['doc_id']
        assert res_paginated.json['response']['results'][1]['doc_id'] \
            == res_unpaginated.json['response']['results'][2]['doc_id']

    def test_search_result_contains_term(self, client):
        self.params = {
            **self.params,
            'term': 'and'
        }
        res_and = client.get(url_for('api.search', **self.params))
        assert self.params['term'] in res_and.json['response']['results'][0]['body'] \
            or self.params['term'] in res_and.json['response']['results'][0]['header']['subject']
        self.params['term'] = 'or'
        res_or = client.get(url_for('api.search', **self.params))
        assert self.params['term'] in res_or.json['response']['results'][0]['body'] \
            or self.params['term'] in res_and.json['response']['results'][0]['header']['subject']

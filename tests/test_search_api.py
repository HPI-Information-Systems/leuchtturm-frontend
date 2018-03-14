"""Tests with configuration for the Flask Search API."""
from flask import url_for


class MetaTestSearch:
    """This class lets you configure some parameters for all queries invoked in the Search API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        'dataset': 'enron'
    }


class TestSearch(MetaTestSearch):
    """Tests for the Flask Search API."""

    def test_search(self, client):
        self.params = {
            **self.params,
            'search_term': 'and'
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

    def test_search_no_search_term(self, client):
        res = client.get(url_for('api.search', **self.params))
        assert res.json['responseHeader']['status'] == 'SyntaxError'
        assert 'stackTrace' in res.json['responseHeader']

    def test_search_pagination(self, client):
        self.params = {
            **self.params,
            'search_term': 'and',
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

    def test_search_result_contains_searchterm(self, client):
        self.params = {
            **self.params,
            'search_term': 'and'
        }
        res_and = client.get(url_for('api.search', **self.params))
        assert self.params['search_term'] in res_and.json['response']['results'][0]['body'] \
            or self.params['search_term'] in res_and.json['response']['results'][0]['header']['subject']
        self.params['search_term'] = 'or'
        res_or = client.get(url_for('api.search', **self.params))
        assert self.params['search_term'] in res_or.json['response']['results'][0]['body'] \
            or self.params['search_term'] in res_and.json['response']['results'][0]['header']['subject']

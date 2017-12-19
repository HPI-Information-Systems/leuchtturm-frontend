from flask import url_for

class MetaTestSearch:
    # make all tests use pytest core by default
    params = {'core': 'pytest'}

class TestSearch(MetaTestSearch):
    def test_search(self, client):
        self.params = {
            **self.params,
            'search_term': 'and'
        }
        res = client.get(url_for('api.search', **self.params))
        assert res.json['responseHeader']['message'] == 'All Good'

    def test_search_no_search_term(self, client):
        res = client.get(url_for('api.search', **self.params))
        assert res.json['responseHeader']['status'] == 'SyntaxError'
        assert 'stackTrace' in res.json['responseHeader']

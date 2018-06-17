"""Tests for email route."""
from flask import url_for
from .meta_test import MetaTest
import json


class TestSimilarEmail(MetaTest):
    """Tests for email route."""

    def test_similar_mails_status(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})
        params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **params))

        params = {
            **self.params,
            'doc_id': res.json['response']['results'][0]['doc_id']
        }
        res = client.get(url_for('api.similar_mails', **params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_similar_mails_missing_parameter_error(self, client):
        res = client.get(url_for('api.similar_mails'))
        assert res.json['response'] == 'Error'

    def test_similar_mails_result(self, client):
        term = 'and'
        filter_term = json.dumps({'searchTerm': term})
        params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **params))

        params = {
            **self.params,
            'doc_id': res.json['response']['results'][0]['doc_id']
        }
        res = client.get(url_for('api.similar_mails', **params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key ['docs', 'dates']:
            assert key in res.json['response']
        for key in ['date', 'count']:
            assert key in res.json['response']['dates'][0]
        for key in ['body', 'doc_id', 'entities', 'header', 'id', 'lang', 'raw', 'category']:
            assert key in res.json['response']['docs'][0]

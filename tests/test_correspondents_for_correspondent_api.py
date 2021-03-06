"""Tests for the correspondents for correspondent route."""
from flask import url_for
from .meta_test import MetaTest


class TestCorrespondentsForCorrespondent(MetaTest):
    """Tests for the correspondents for correspondent route."""

    def test_correspondents_for_correspondent_status(self, client):
        self.params = {
            **self.params,
            'identifying_name': MetaTest.get_identifying_name_for(self.params['dataset']),
            'limit': 10
        }
        res = client.get(url_for('api.correspondents_for_correspondent', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_correspondents_for_correspondent_missing_parameter_error(self, client):
        res = client.get(url_for('api.correspondents_for_correspondent'))
        assert res.json['response'] == 'Error'

    def test_correspondents_for_correspondent_result(self, client):
        self.params = {
            **self.params,
            'identifying_name': MetaTest.get_identifying_name_for(self.params['dataset']),
            'limit': 10
        }
        res = client.get(url_for('api.correspondents_for_correspondent', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        for key in ['all', 'from', 'to']:
            assert key in res.json['response']
        for key in ['count', 'identifying_name']:
            assert key in res.json['response']['all'][0]

    def test_correspondents_for_correspondent_empty_result(self, client):
        self.params = {
            **self.params,
            'identifying_name': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.correspondents_for_correspondent', **self.params))
        for key in ['all', 'from', 'to']:
            assert len(res.json['response'][key]) == 0

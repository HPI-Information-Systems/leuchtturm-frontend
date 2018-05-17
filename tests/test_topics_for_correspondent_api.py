"""Tests for the topics for correspondent route."""
from flask import url_for
from .meta_test import MetaTest


class TestTopicsForCorrespondent(MetaTest):
    """Tests for the topics for correspondent route."""

    def test_topics_for_correspondent_status(self, client):
        self.params = {
            **self.params,
            'email_address': '*a*'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_topics_for_correspondent_missing_parameter_error(self, client):
        res = client.get(url_for('api.topics_for_correspondent'))
        assert res.json['response'] == 'Error'

    def test_topics_for_correspondent_response_structure(self, client):
        self.params = {
            **self.params,
            'email_address': '*a*'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert 'confidence', 'words' in res.json['response'][0]
        assert 'confidence', 'word' in res.json['response'][0]['words'][0]

    def test_topics_for_correspondent_no_topics_found(self, client):
        self.params = {
            **self.params,
            'dataset': 'dnc',
            'email_address': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert len(res.json['response']['aggregated']['topics']) == 0

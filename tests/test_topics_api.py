"""Tests for the topics route."""
from flask import url_for


class MetaTestTopics:
    """This class lets you configure some parameters for all queries invoked in the Topics API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        'dataset': 'enron'
    }


class TestTopics(MetaTestTopics):
    """Tests for the topics API."""

    def test_topics_status(self, client):
        self.params = {
            **self.params,
            'email_address': '*a*'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_topics_error(self, client):
        res = client.get(url_for('api.topics_for_correspondent'))
        assert res.json['response'] == 'Error'

    def test_topics_response_structure(self, client):
        self.params = {
            **self.params,
            'email_address': '*a*'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert 'confidence', 'words' in res.json['response'][0]
        assert 'confidence', 'word' in res.json['response'][0]['words'][0]

    def test_topics_confidence(self, client):
        self.params = {
            **self.params,
            'email_address': '*a*'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        confidence_sum = 0
        for topic in res.json['response']:
            confidence_sum += topic['confidence']
        assert abs(confidence_sum - 1.0) < 0.01

    def test_topics_no_topics_found(self, client):
        self.params = {
            **self.params,
            'email_address': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.topics_for_correspondent', **self.params))
        assert len(res.json['response']) == 0

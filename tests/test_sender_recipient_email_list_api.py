"""Tests for the sender recipient email list route."""
from flask import url_for
from .meta_test import MetaTest


class TestSenderRecipientEmailList(MetaTest):
    """Tests for the sender recipient email list route."""

    def test_email_list_status(self, client):
        self.params = {
            **self.params,
            'sender': '*a*',
            'limit': 10
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_email_list_missing_parameter_error(self, client):
        res = client.get(url_for('api.sender_recipient_email_list'))
        assert res.json['response'] == 'Error'

    def test_email_list_only_sender(self, client):
        self.params = {
            **self.params,
            'sender': '*a*',
            'limit': 10
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        for result in res.json['response']['results']:
            assert 'a' in result['header']['sender']['identifying_name']

    def test_email_list_empty_result(self, client):
        self.params = {
            **self.params,
            'sender_or_recipient': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        assert len(res.json['response']['results']) == 0

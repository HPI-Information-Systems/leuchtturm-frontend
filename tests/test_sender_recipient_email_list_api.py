"""Tests for the sender recipient email list route."""
from flask import url_for


class MetaTestSenderRecipientEmailList:
    """This class lets you configure some parameters for all queries invoked in the SenderRecipientEmail API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        'dataset': 'enron'
    }


class TestSenderRecipientEmailList(MetaTestSenderRecipientEmailList):
    """Tests for the sender recipient email list API."""

    def test_email_list_status(self, client):
        self.params = {
            **self.params,
            'sender': '*a*',
            'limit': 10
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_email_list_error(self, client):
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
            assert 'a' in result['header']['sender']['emailAddress']

    def test_email_list_empty_result(self, client):
        self.params = {
            **self.params,
            'sender_or_recipient': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        assert len(res.json['response']['results']) == 0

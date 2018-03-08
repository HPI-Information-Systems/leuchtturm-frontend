"""Tests for the topics route."""
from flask import url_for


class MetaTestSenderRecipientEmailList:
    """This class lets you configure some parameters for all queries invoked in the SenderRecipientEmail API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        # 'core': 'pytest'
    }


class TestSenderRecipientEmailList(MetaTestSenderRecipientEmailList):
    """Tests for the topics API."""

    def test_email_list_status(self, client):
        self.params = {
            **self.params,
            'sender': '*a*'
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
            'sender': '*a*'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        for result in res['response'][:10]:
            assert 'a' in result['header']['sender']['email']

    def test_email_list_sender_and_recipient(self, client):
        self.params = {
            **self.params,
            'sender': '*a*',
            'recipient': '*b*'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        for result in res['response'][:10]:
            assert 'a' in result['header']['sender']['email'] and \
                   'b' in [person['email'] for person in result['header']['recipients']].join()

    def test_email_list_sender_or_recipient(self, client):
        self.params = {
            **self.params,
            'sender_or_recipient': '*a*'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        for result in res['response'][:10]:
            assert 'a' in result['header']['sender']['email'] or \
                   'a' in [person['email'] for person in result['header']['recipients']].join()

    def test_email_list_empty_result(self, client):
        self.params = {
            **self.params,
            'sender_or_recipient': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.sender_recipient_email_list', **self.params))
        assert len(res.json['response']) == 0

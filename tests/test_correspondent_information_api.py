"""Tests for the correspondents information route."""
from flask import url_for
from .meta_test import MetaTest


class TestCorrespondentInformation(MetaTest):
    """Tests for the correspondents information route."""

    def test_correspondents_information_status(self, client):
        self.params = {
            **self.params,
            'identifying_name': MetaTest.get_identifying_name_for(self.params['dataset']),
        }
        res = client.get(url_for('api.correspondent_information', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_correspondents_information_missing_parameter_error(self, client):
        res = client.get(url_for('api.correspondent_information'))
        assert res.json['response'] == 'Error'

    def test_correspondents_information_result(self, client):
        self.params = {
            **self.params,
            'identifying_name': MetaTest.get_identifying_name_for(self.params['dataset'])
        }
        res = client.get(url_for('api.correspondent_information', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        response = res.json['response']

        assert response['numFound'] == 1
        assert response['identifying_name'] == self.params['identifying_name']
        for key in [
            'aliases', 'aliases_from_signature', 'community', 'email_addresses', 'email_addresses_from_signature',
            'hierarchy', 'phone_numbers_cell', 'phone_numbers_fax', 'phone_numbers_home', 'phone_numbers_office',
            'role', 'signatures'
        ]:
            assert key in res.json['response']

    def test_correspondents_information_empty_result(self, client):
        self.params = {
            **self.params,
            'identifying_name': 'hasso.plattner@hpi.uni-potsdam.de'
        }
        res = client.get(url_for('api.correspondent_information', **self.params))

        assert 'response' in res.json
        assert 'responseHeader' in res.json
        response = res.json['response']

        assert response['numFound'] == 0
        assert response['identifying_name'] == self.params['identifying_name']
        assert len(response.keys()) == 2

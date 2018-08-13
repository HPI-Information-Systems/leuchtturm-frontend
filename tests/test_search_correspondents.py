"""Tests for the correspondents for term route."""
from flask import url_for
from .meta_test import MetaTest

JAVA_MAX_INT = 2147483647


class TestSearchCorrespondents(MetaTest):
    """Tests for the correspondents for term route."""

    def test_search_correspondents_status(self, client):
        self.params = {
            **self.params,
            'search_phrase': 'e'
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        assert res.status_code == 200
        assert len(res.json['response']) > 0

    def test_search_correspondents_pagination(self, client):
        self.params = {
            **self.params,
            'search_phrase': 'e',
            'offset': 0,
            'limit': 10
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_1 = res.json['response']['results']

        self.params = {
            **self.params,
            'search_phrase': 'e',
            'offset': 9,
            'limit': 10
        }

        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_2 = res.json['response']['results']

        assert len(correspondents_1) == 10 and len(correspondents_2) == 10
        for key in correspondents_1[-1].keys():
            assert correspondents_1[-1][key] == correspondents_2[0][key]

    def test_search_correspondents_match_exact(self, client):
        self.params = {
            **self.params,
            'search_phrase': 'Alex'
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_1 = res.json['response']['results']

        self.params = {
            **self.params,
            'search_phrase': 'Alex',
            'match_exact': True
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_2 = res.json['response']['results']

        assert len(correspondents_1) > len(correspondents_2)

    def test_search_correspondents_additional_search_fields(self, client):
        self.params = {
            **self.params,
            'search_phrase': 'Alex',
            'limit': JAVA_MAX_INT
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_1 = res.json['response']['results']

        self.params = {
            **self.params,
            'search_phrase': 'Alex',
            'limit': JAVA_MAX_INT,
            'search_field': ['identifying_name', 'aliases']
        }
        res = client.get(url_for('api.search_correspondents', **self.params))
        correspondents_2 = res.json['response']['results']

        assert len(correspondents_1) < len(correspondents_2)

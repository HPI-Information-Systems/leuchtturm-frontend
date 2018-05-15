"""Tests for the search route."""
from flask import url_for
from .meta_test import MetaTest
from ast import literal_eval
import json


class Helper(MetaTest):
    @staticmethod
    def get_number_of_all_documents(client):
        all_res = client.get(url_for('api.search', **MetaTest.params))
        return all_res.json['response']['numFound']

    @staticmethod
    def get_topics_for_filter(client):
        topics_res = client.get(url_for('api.filter_topics', **MetaTest.params))
        return topics_res.json['response']


class TestFilters(MetaTest):
    """Tests for the search route with filters."""

    def test_from_to_date_filter_year(self, client):
        start_date = '2000-01-01'
        end_date = '2001-12-30'
        filter_term = json.dumps({'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))
        if res.json['response']['results'][0]:
            assert int(res.json['response']['results'][0]['header']['date'].split("-")[0]) \
                >= int(start_date.split("-")[0])
        if res.json['response']['results'][0]:
            assert int(res.json['response']['results'][-1]['header']['date'].split("-")[0]) \
                <= int(end_date.split("-")[0])

    def test_from_to_date_filter_month(self, client):
        start_date = '2000-05-05'
        end_date = '2000-08-08'
        filter_term = json.dumps({'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))
        if res.json['response']['results'][0]:
            assert int(res.json['response']['results'][0]['header']['date'].split("-")[1]) \
                >= int(start_date.split("-")[1])
        if res.json['response']['results'][0]:
            assert int(res.json['response']['results'][-1]['header']['date'].split("-")[1]) \
                <= int(end_date.split("-")[1])

    def test_from_to_date_filter_no_result(self, client):
        start_date = '2000-01-01'
        end_date = '1000-01-01'
        filter_term = json.dumps({'startDate': start_date, 'endDate': end_date})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['numFound'] == 0
        assert len(res.json['response']['results']) == 0

    def test_sender_filter(self, client):
        sender = 'pete.davis@enron.com'
        filter_term = json.dumps({'sender': sender})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))
        if res.json['response']['results'][0]:
            assert res.json['response']['results'][0]['header']['sender']['emailAddress'] == sender

    def test_recipient_filter(self, client):
        recipient = 'jeff.dasovich@enron.com'
        filter_term = json.dumps({'recipient': recipient})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))
        if res.json['response']['results'][0]:
            recipients = res.json['response']['results'][0]['header']['recipients']
            recipient_email_addresses = [literal_eval(recipient)['email'] for recipient in recipients]
            assert recipient in recipient_email_addresses

    def test_correspondent_filter_no_result(self, client):
        sender = 'asasd12sdfer1243'
        recipient = 'dsgfbcvsdqwdq2133wdsdfasf'
        filter_term = json.dumps({'sender': sender, 'recipient': recipient})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['numFound'] == 0
        assert len(res.json['response']['results']) == 0

    def test_topic_filter(self, client):
        topics = Helper.get_topics_for_filter(client)
        topic_id = topics[0]['topic_id']
        topic_threshold = 0.01
        filter_term = json.dumps({'selectedTopics': [topic_id], 'topicThreshold': topic_threshold})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        filtered_res = client.get(url_for('api.search', **self.params))

        assert filtered_res.json['response']['numFound'] < Helper.get_number_of_all_documents(client)

    def test_topic_filter_no_threshold(self, client):
        topics = Helper.get_topics_for_filter(client)
        topic_id = topics[0]['topic_id']
        filter_term = json.dumps({'selectedTopics': [topic_id]})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        filtered_res = client.get(url_for('api.search', **self.params))

        assert filtered_res.json['response']['numFound'] < Helper.get_number_of_all_documents(client)

    def test_topic_filter_threshold_too_high(self, client):
        topics = Helper.get_topics_for_filter(client)
        topic_id = topics[0]['topic_id']
        topic_threshold = 1.1
        filter_term = json.dumps({'selectedTopics': [topic_id], 'topicThreshold': topic_threshold})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['numFound'] == 0
        assert len(res.json['response']['results']) == 0

    def test_topic_filter_wrong_topic_id(self, client):
        topic_id = '999999'
        filter_term = json.dumps({'selectedTopics': [topic_id]})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['numFound'] == 0
        assert len(res.json['response']['results']) == 0

    def test_email_classes_filter_single(self, client):
        email_class = ['personal']
        filter_term = json.dumps({'selectedEmailClasses': email_class})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['results'][0]['category'] in email_class
        assert res.json['response']['numFound'] < Helper.get_number_of_all_documents(client)

    def test_email_classes_filter_all(self, client):
        email_classes = ['business', 'personal', 'spam']
        filter_term = json.dumps({'selectedEmailClasses': email_classes})

        self.params = {
            **self.params,
            'filters': filter_term
        }
        res = client.get(url_for('api.search', **self.params))

        assert res.json['response']['numFound'] == Helper.get_number_of_all_documents(client)

"""A module for utility functions to be used by the Flask app."""

import traceback
from datetime import datetime
from flask import jsonify, current_app
from pathlib import PurePath
import configparser
from ast import literal_eval
import json


def unflatten(dictionary):
    """Parse json from solr correctly (string to json)."""
    result_dict = dict()
    for key, value in dictionary.items():
        parts = key.split(".")
        d = result_dict
        for part in parts[:-1]:
            if part not in d:
                d[part] = dict()
            d = d[part]
        d[parts[-1]] = value
    return result_dict


def get_config(dataset):
    config_file = 'config-' + dataset + '.ini'
    configpath = PurePath('.').parent / 'config' / config_file
    config = configparser.ConfigParser()
    config.read(str(configpath))
    return config


def remove_empty_docs(result):
    """Filter out empty documents from the response."""
    docs = []
    for idx, doc in enumerate(result['response']['docs']):
        if doc:
            docs.append(doc)

    result['response']['docs'] = docs
    return result


def parse_solr_result(raw_result):
    """Unflatten result from solr to get right field structure."""
    result = remove_empty_docs(raw_result)
    for idx, doc in enumerate(result['response']['docs']):
        result['response']['docs'][idx] = unflatten(doc)
    return result


def parse_email_list(email_list):
    """Parse the email list of a result to get emails into the right structure."""
    for idx, email in enumerate(email_list):
        parsed_email = {
            'id': email['id'],
            'doc_id': email.setdefault('doc_id', 'NO DOC_ID FOUND'),
            'predecessor': email.setdefault('predecessor', 'NO THREAD DATA FOUND'),
            'successor': email.setdefault('successor', ['NO THREAD DATA FOUND']),
            'raw': email.setdefault('raw', 'NO RAW FOUND'),
            'body': email.setdefault('body', 'NO BODY FOUND'),
            'lang': email.setdefault('lang', 'NO LANG FOUND'),
            'header': {
                'date': email.setdefault('header', {}).setdefault('date', 'NO DATE FOUND'),
                'subject': email['header'].setdefault('subject', 'NO SUBJECT FOUND'),
                'sender': {
                    'name': email['header'].setdefault('sender', {}).setdefault('name', 'NO SENDER NAME FOUND'),
                    'identifying_name':
                        email['header']['sender'].setdefault('identifying_name', 'NO SENDER IDENTIFYING NAME FOUND'),
                },
                'recipients': email['header'].setdefault('recipients', ['NO RECIPIENTS FOUND']),
            },
            'cluster': {
                'number': email.setdefault('cluster', {}).setdefault('number', 'NO CLUSTER FOUND'),
                'top_body_words': email['cluster'].setdefault('top_body_words', []),
                'top_subject_words': email['cluster'].setdefault('top_subject_words', [])
            },
            'entities': email.setdefault('entities', {'UNKNOWN': ['NO ENTITIES FOUND']}),
            'category': email.setdefault('category', {}).setdefault('top_category', 'NO CATEGORY FOUND'),
            'keyphrases': email.setdefault('keyphrases', ['NO KEYPHRASES FOUND'])
        }
        email_list[idx] = parsed_email
    return email_list


def json_response_decorator(query_function):
    """Provide a template for responses of our Flask API.

    It adds a header with status, timestamp and message as well as a stack trace in case of errors
    to the response.

    See search.py for usage example.
    """
    def make_json_api_response():
        request_time = datetime.now()

        response_template = {
            'responseHeader': {
                'status': 'Ok',
                'message': 'All Good',
            }
        }

        status_code = 200

        try:
            response = query_function()
            response_template['response'] = response
        except Exception as exception:
            status_code = 500
            response_template['response'] = 'Error'
            response_template['responseHeader'] = {
                'status': type(exception).__name__,
                'message': exception.args[0],
                'stackTrace': traceback.format_exc()
            }
            current_app.logger.debug(traceback.format_exc())

        timedelta = datetime.now() - request_time
        timedelta_milliseconds = timedelta.seconds * 1000 + timedelta.microseconds / 1000
        response_template['responseHeader']['responseTime'] = timedelta_milliseconds

        return jsonify(response_template), status_code
    return make_json_api_response


def route_unknown():
    return jsonify({
        'response': 'Error',
        'responseHeader': {
            'status': 'Route not found',
            'message': 'The route you are trying to access is not defined.',
            'stackTrace': ''
        },
    }), 404


def build_node(id, name):
    return {
        "id": id,
        "type": 'person',
        "icon": '\uf2be',
        "props": {
            "name": name,
            "__radius": 16,
            "__color": '#000000'
        }
    }


def build_edge(id, source_id, target_id):
    return {
        "id": id,
        "type": '',
        "props": {},
        "source": source_id,
        "sourceId": source_id,
        "target": target_id,
        "targetId": target_id,
    }


def parse_all_topics(all_topics):
    def parse_topic(topic):
        parsed_topic = dict()
        parsed_topic['topic_id'] = topic['topic_id']
        # check is necessary as long as not all collection contain the new topic format including ranks
        parsed_topic['topic_rank'] = topic.get('topic_rank', -1)
        parsed_topic['confidence'] = 0
        word_confidence_tuples_serialized = topic['terms'] \
            .replace('[(', '["(').replace(')]', ')"]').replace(', (', ', \"(').replace('), ', ')\", ')
        word_confidence_tuples = [literal_eval(tuple) for tuple in json.loads(word_confidence_tuples_serialized)]
        parsed_topic['words'] = [
            {'word': tuple[0], 'confidence': tuple[1]}
            for tuple in word_confidence_tuples
        ]
        return parsed_topic

    parsed_topics = [parse_topic(topic) for topic in all_topics]

    return parsed_topics


def default_network_analysis(result):
    result_list = [dict(record) for record in result]
    for element in result_list:
        if 'hierarchy' in element:
            element['hierarchy'] = element['hierarchy'] \
                if type(element['hierarchy']) == int else -1
        if 'community' in element:
            element['community'] = element['community'] \
                if type(element['community']) == int else -1
        if 'role' in element:
            element['role'] = element['role'] \
                if type(element['role']) == int else -1
    return result_list

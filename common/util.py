"""A module for utility functions to be used by the Flask app."""

import traceback
from datetime import datetime
from flask import jsonify
import configparser
import os.path


def get_default_core():
    """Get uri from config file."""
    configpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.ini')
    config = configparser.ConfigParser()
    config.read(configpath)
    return config['SOLR_CONNECTION']['Core']


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
            'doc_id': email.setdefault('doc_id', 'NO DOC_ID FOUND'),
            'raw': email.setdefault('raw', 'NO RAW FOUND'),
            'body': email.setdefault('body', 'NO BODY FOUND'),
            'lang': email.setdefault('lang', 'NO LANG FOUND'),
            'header': {
                'date': email['header'].setdefault('date', 'NO DATE FOUND'),
                'subject': email['header'].setdefault('subject', 'NO SUBJECT FOUND'),
                'sender': {
                    'name': email['header']['sender'].setdefault('name', 'NO SENDER NAME FOUND'),
                    'emailAddress': email['header']['sender'].setdefault('email', 'NO SENDER EMAIL ADDRESS FOUND'),
                },
                'recipients': email['header']['recipients'],
            },
            'entities': email['entities'],
            'topics': email['topics']
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

        try:
            response = query_function()
            response_template['response'] = response
        except Exception as exception:
            response_template['response'] = 'Error'
            response_template['responseHeader'] = {
                'status': type(exception).__name__,
                'message': exception.args[0],
                'stackTrace': traceback.format_exc()
            }

        timedelta = datetime.now() - request_time
        timedelta_milliseconds = timedelta.seconds * 1000 + timedelta.microseconds / 1000
        response_template['responseHeader']['responseTime'] = timedelta_milliseconds

        return jsonify(response_template)
    return make_json_api_response


@json_response_decorator
def route_unknown():
    raise TypeError('The route you are trying to access is not defined.')

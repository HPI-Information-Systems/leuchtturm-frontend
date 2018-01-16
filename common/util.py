"""A module for utility functions to be used by the Flask app."""
import json
from flask import jsonify
from datetime import datetime
import traceback

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
    docs = []
    for idx, doc in enumerate(result['response']['docs']):
        if doc:
            docs.append(doc)

    result['response']['docs'] = docs
    return result

def parse_solr_result(raw_result):
    """Parse entities from solr to get right field structure."""
    result = remove_empty_docs(raw_result)
    for idx, doc in enumerate(result['response']['docs']):
        result['response']['docs'][idx] = unflatten(doc)
        if ('entities' in result['response']['docs'][idx]):
            for entity_type, entities in result['response']['docs'][idx]['entities'].items():
                entities_jsonified = []
                for entity in entities:
                    entities_jsonified.append(json.loads(entity))
                result['response']['docs'][idx]['entities'][entity_type] = entities_jsonified
    return result


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

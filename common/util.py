"""A module for utility functions to be used by the Flask app."""
from flask import jsonify
from datetime import datetime
import traceback


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

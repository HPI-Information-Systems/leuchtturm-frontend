from flask import jsonify
from datetime import datetime

def json_response_decorator(query_function):
    def make_json_api_response():
        request_time = datetime.now()

        response = {
            'responseHeader': {
                'status': 'ok',
                'message': 'a message',
                'responseTime': -1,
            },
            'response': query_function()
        }

        timedelta = datetime.now() - request_time
        timedelta_milliseconds = timedelta.seconds * 1000 + timedelta.microseconds / 1000
        response['responseHeader']['responseTime'] = timedelta_milliseconds

        return jsonify(response)
    return make_json_api_response





def make_json_api_response(status, message, request_time, response=None):
    timedelta = datetime.now() - request_time
    timedelta_milliseconds = timedelta.seconds * 1000 + timedelta.microseconds / 1000

    response = {
        'responseHeader': {
            'status': status,
            'message': message,
            'responseTime': timedelta_milliseconds,
        },
        'response': response
    }

    return jsonify(response)
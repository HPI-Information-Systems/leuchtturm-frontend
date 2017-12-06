from flask import jsonify
from datetime import datetime


def make_json_api_response(response, status, message, request_time):
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
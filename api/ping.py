from common.util import json_response_decorator
from flask import request

class Ping:
    @json_response_decorator
    def ping():
        count = request.args.get('count', default=1, type=int)
        if count == 1:
            response = "pong"
        else:
            response = ["pong"] * count
        return response

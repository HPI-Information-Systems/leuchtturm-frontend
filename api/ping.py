"""The ping action can be used to check whether Flask is up and running."""
from common.util import json_response_decorator
from flask import request


class Ping:
    """Makes the ping method accessible.

    Example request: /api/ping?count=3
    """

    @json_response_decorator
    def ping():
        count = request.args.get('count', default=1, type=int)
        if count == 1:
            response = "pong"
        else:
            response = ["pong"] * count
        return response

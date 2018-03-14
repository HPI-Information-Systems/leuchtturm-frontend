"""The datasets route can be used to get a list of datasets for which configurations are existant."""
from common.util import json_response_decorator
from flask import request


class Datasets:
    """Makes the get_datasets method accessible, no parameters.

    Example request: /api/datasets
    """

    @json_response_decorator
    def ping():
        count = request.args.get('count', default=1, type=int)
        if count == 1:
            response = "pong"
        else:
            response = ["pong"] * count
        return response

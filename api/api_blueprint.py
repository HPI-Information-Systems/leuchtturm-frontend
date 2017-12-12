from flask import Blueprint, request
from .ping import Ping
from .search import Search
from common.util import make_json_api_response
from datetime import datetime

api = Blueprint('api', __name__)


@api.route('/')
def hello():
    return "Welcome to API endpoint"


@api.route('/ping', methods=['GET'])
def ping():
    request_time = datetime.now()
    count = request.args.get('count', default=1, type=int)
    return make_json_api_response(
        'OK',
        'this is a message',
        request_time,
        Ping.ping(count)
    )


@api.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api.route('/search/mock', methods=['GET'])
def search_mock():
    request_time = datetime.now()
    count = request.args.get('count', default=1, type=int)
    return make_json_api_response(
        'OK',
        'this is a mock of the search results',
        request_time,
        Search.mock_results(count)
    )

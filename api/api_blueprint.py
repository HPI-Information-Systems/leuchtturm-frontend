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
    return Ping.ping()


@api.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api.route('/search/mock', methods=['GET'])
def search_mock():
    return Search.mock_results()

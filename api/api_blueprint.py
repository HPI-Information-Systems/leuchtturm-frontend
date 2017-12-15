from flask import Blueprint, request
from .ping import Ping
from .search import Search
from datetime import datetime
from common.util import route_unknown

api = Blueprint('api', __name__)


@api.route('/ping', methods=['GET'])
def ping():
    return Ping.ping()


@api.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api.route('/search/mock', methods=['GET'])
def search_mock():
    return Search.mock_results()

@api.route('/<path:path>')
def catch_all(path):
    return route_unknown()
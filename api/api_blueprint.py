"""Routing for the /api blueprint is defined here."""

from flask import Blueprint
from .ping import Ping
from .search import Search
from .correspondents import Correspondents
from datetime import datetime
from common.util import route_unknown

api = Blueprint('api', __name__)


@api.route('/ping', methods=['GET'])
def ping():
    return Ping.ping()


@api.route('/search', methods=['GET'])
def search():
    return Search.search_request()

@api.route('/correspondents', methods=['GET'])
def network():
    return Correspondents.get_correspondents()

@api.route('/search/mock', methods=['GET'])
def search_mock():
    return Search.mock_results()


@api.route('/<path:path>')
def catch_all(path):
    return route_unknown()

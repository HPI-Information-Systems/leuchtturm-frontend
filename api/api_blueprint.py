"""Routing for the /api blueprint is defined here."""

from flask import Blueprint
from common.util import route_unknown
from .ping import Ping
from .search import Search
from .correspondents import Correspondents
from .terms import Terms
from .graph import Graph
from .communication import Communication

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/ping', methods=['GET'])
def ping():
    return Ping.ping()


@api_blueprint.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api_blueprint.route('/correspondents', methods=['GET'])
def correspondents():
    return Correspondents.get_correspondents()


@api_blueprint.route('/terms', methods=['GET'])
def terms():
    return Terms.get_terms()


@api_blueprint.route('/graph', methods=['GET'])
def graph():
    return Graph.get_graph()


@api_blueprint.route('/communication', methods=['GET'])
def communication():
    return Communication.get_communication()


@api_blueprint.route('/<path:path>')
def catch_all(path):
    return route_unknown()

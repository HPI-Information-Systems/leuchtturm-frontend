"""Routing for the /api blueprint is defined here."""

from flask import Blueprint
from common.util import route_unknown
from .ping import Ping
from .search import Search
from .correspondents import Correspondents
from .terms import Terms
from .topics import Topics
from .graph import Graph
from .email import Email
from .sender_receiver_email_list import SenderReceiverEmailList

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


@api_blueprint.route('/terms_for', methods=['GET'])
def terms_for():
    return Terms.get_terms_for()


@api_blueprint.route('/graph', methods=['GET'])
def graph():
    return Graph.get_graph()


@api_blueprint.route('/email', methods=['GET'])
def email():
    return Email.get_mail_by_doc_id()


@api_blueprint.route('/similar_mails', methods=['GET'])
def similar_mails():
    return Email.get_similar_mails_by_doc_id()


@api_blueprint.route('/sender_receiver_email_list', methods=['GET'])
def sender_receiver_email_list():
    return SenderReceiverEmailList.get_sender_receiver_email_list()


@api_blueprint.route('/topics', methods=['GET'])
def topics():
    return Topics.get_topics()


@api_blueprint.route('/<path:path>')
def catch_all(path):
    return route_unknown()

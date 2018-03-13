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
from .sender_recipient_email_list import SenderRecipientEmailList

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/ping', methods=['GET'])
def ping():
    return Ping.ping()


@api_blueprint.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api_blueprint.route('/correspondent/correspondents', methods=['GET'])
def correspondents_for_correspondent():
    return Correspondents.get_correspondents_for_correspondent()


@api_blueprint.route('/correspondent/terms', methods=['GET'])
def terms_for_correspondent():
    return Terms.get_terms_for_correspondent()


@api_blueprint.route('/correspondent/graph', methods=['GET'])
def graph_for_correspondent():
    return Graph.get_graph_for_correspondent()


@api_blueprint.route('/correspondent/topics', methods=['GET'])
def topics_for_correspondent():
    return Topics.get_topics_for_correspondent()


@api_blueprint.route('/term/correspondents', methods=['GET'])
def correspondents_for_term():
    return Terms.get_correspondents_for_term()


@api_blueprint.route('/term/dates', methods=['GET'])
def dates_for_term():
    return Terms.get_dates_for_term()


@api_blueprint.route('/email', methods=['GET'])
def email():
    return Email.get_email_by_doc_id()


@api_blueprint.route('/email/similar', methods=['GET'])
def similar_mails():
    return Email.get_similar_emails_by_doc_id()


@api_blueprint.route('/sender_recipient_email_list', methods=['GET'])
def sender_recipient_email_list():
    return SenderRecipientEmailList.get_sender_recipient_email_list()


@api_blueprint.route('/<path:path>')
def catch_all(path):
    return route_unknown()

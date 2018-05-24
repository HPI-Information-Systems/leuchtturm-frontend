"""Routing for the /api blueprint is defined here."""

from flask import Blueprint
from common.util import route_unknown
from .ping import Ping
from .search import Search
from .correspondents import Correspondents
from .terms import Terms
from .topics import Topics
from .graph import Graph
from .emails import Emails
from .sender_recipient_email_list import SenderRecipientEmailList
from .datasets import Datasets
from .matrix import Matrix
from .filters import Filters

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/ping', methods=['GET'])
def ping():
    return Ping.ping()


@api_blueprint.route('/version', methods=['GET'])
def git_version():
    return Ping.gitlog()


@api_blueprint.route('/search', methods=['GET'])
def search():
    return Search.search_request()


@api_blueprint.route('/correspondent/correspondents', methods=['GET'])
def correspondents_for_correspondent():
    return Correspondents.get_correspondents_for_correspondent()


@api_blueprint.route('/correspondent/terms', methods=['GET'])
def terms_for_correspondent():
    return Terms.get_terms_for_correspondent()


@api_blueprint.route('/correspondent/topics', methods=['GET'])
def topics_for_correspondent():
    return Topics.get_topics_for_correspondent()


@api_blueprint.route('/correspondent/correspondent_information', methods=['GET'])
def correspondent_information():
    return Correspondents.get_correspondent_information()


@api_blueprint.route('/term/correspondents', methods=['GET'])
def correspondents_for_term():
    return Terms.get_correspondents_for_term()


@api_blueprint.route('/term/dates', methods=['GET'])
def dates_for_term():
    return Terms.get_dates_for_term()


@api_blueprint.route('/email', methods=['GET'])
def email():
    return Emails.get_email_by_doc_id()


@api_blueprint.route('/email/similar', methods=['GET'])
def similar_mails():
    return Emails.get_similar_emails_by_doc_id()


@api_blueprint.route('/sender_recipient_email_list', methods=['GET'])
def sender_recipient_email_list():
    return SenderRecipientEmailList.get_sender_recipient_email_list()


@api_blueprint.route('/graph', methods=['GET'])
def graph():
    return Graph.get_graph()


@api_blueprint.route('/datasets', methods=['GET'])
def datasets():
    return Datasets.get_datasets()


@api_blueprint.route('/matrix/full', methods=['GET'])
def matrix():
    return Matrix.get_matrix()


@api_blueprint.route('/matrix/highlighting', methods=['GET'])
def matrix_highlighting():
    return Matrix.get_matrix_highlighting()


@api_blueprint.route('/filters/topics', methods=['GET'])
def filter_topics():
    return Filters.get_filter_topics()


@api_blueprint.route('/filters/date_range', methods=['GET'])
def filter_date_range():
    return Filters.get_filter_date_range()


@api_blueprint.route('/<path:path>')
def catch_all(path):
    return route_unknown()

"""Routing for the /app blueprint is defined here."""

from flask import Blueprint, render_template, make_response

react_app_blueprint = Blueprint('react_app', __name__,  static_folder="client/lampenhaus/build/static", template_folder="client/lampenhaus/build")

@react_app_blueprint.route('/', defaults={'path': ''})
@react_app_blueprint.route('/<path:path>')
def catch_all(path):
    print('---------------', path)
    # return make_response('index.html')
    return render_template('index.html')

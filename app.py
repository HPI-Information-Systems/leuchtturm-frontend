"""The base for the Flask app is defined here.

This contains routing, app creation and setting basic options for running the app in debug mode.
"""
from flask import Flask, redirect

from api.api_blueprint import api_blueprint
from react_app_blueprint import react_app_blueprint
import argparse


def create_app():
    app = Flask(__name__)

    app.register_blueprint(api_blueprint, url_prefix='/api')
    app.register_blueprint(react_app_blueprint, url_prefix='/app')

    @app.route("/")
    def redirect_to_react():
        return redirect('/app', code=302)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    return app


if __name__ == '__main__':
    app = create_app()

    # SET RUN ARGUMENTS FOR DEBUGGING OF FLASK APPLICATION INSIDE PYCHARM
    parser = argparse.ArgumentParser(description='Development Server Help')
    parser.add_argument("-d", "--debug", action="store_true", dest="debug_mode",
                        help="run in debug mode (for use with PyCharm)", default=False)
    parser.add_argument("-p", "--port", dest="port",
                        help="port of server (default:%(default)s)", type=int, default=5000)

    cmd_args = parser.parse_args()
    app_options = {"port": cmd_args.port}

    if cmd_args.debug_mode:
        app_options["debug"] = True
        app_options["use_debugger"] = False
        app_options["use_reloader"] = False

    # RUN APP
    app.run(**app_options)

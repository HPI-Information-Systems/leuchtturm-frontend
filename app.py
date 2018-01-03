"""The base for the Flask app is defined here.

This contains routing, app creation and setting basic options for running the app in debug mode.
"""
from flask import Flask, render_template

from api.api_blueprint import api
import argparse


def create_app():
    app = Flask(__name__, static_folder="client/lampenhaus/build/static", template_folder="client/lampenhaus/build")

    app.register_blueprint(api, url_prefix='/api')

    @app.route("/")
    def hello():
        return "Hello World!"

    @app.route("/app", methods=['GET'])
    def react_app():
        return render_template('index.html')

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

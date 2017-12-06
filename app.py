from flask import Flask, render_template, request, jsonify
from api.ping import Ping


def create_app():
    app = Flask(__name__, static_folder="client/lampenhaus/build/static", template_folder="client/lampenhaus/build")

    @app.route("/")
    def hello():
        return "Hello World!"

    @app.route("/api/ping", methods=['GET'])
    def ping():
        count = request.args.get('count', default=1, type=int)
        return Ping.ping(count)

    @app.route("/app", methods=['GET'])
    def react_app():
        return render_template('index.html')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
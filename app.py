from flask import Flask, render_template

from api.api_blueprint import api

def create_app():
    app = Flask(__name__, static_folder="client/lampenhaus/build/static", template_folder="client/lampenhaus/build")

    app.register_blueprint(api, url_prefix='/api')

    @app.route("/")
    def hello():
        return "Hello World!"

    @app.route("/app", methods=['GET'])
    def react_app():
        return render_template('index.html')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
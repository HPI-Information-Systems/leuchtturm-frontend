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

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    return app



if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
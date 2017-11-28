from flask import Flask, render_template
app = Flask(__name__, static_folder="client/lampenhaus/build/static", template_folder="client/lampenhaus/build")

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/app", methods=['GET'])
def react_app():
    return render_template('index.html')
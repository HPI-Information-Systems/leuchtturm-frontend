from flask import Blueprint, request
from .ping import Ping

api = Blueprint('api', __name__)

@api.route('/')
def hello():
    return "Welcome to API endpoint"

@api.route('/ping', methods=['GET'])
def ping():
    count = request.args.get('count', default=1, type=int)
    return Ping.ping(count)

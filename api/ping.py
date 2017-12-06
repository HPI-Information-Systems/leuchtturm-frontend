from flask import jsonify

class Ping:
    def ping(count):
        if count == 1:
            response = 'pong'
        else:
            response = ['pong'] * count
        return jsonify({'ping': response})
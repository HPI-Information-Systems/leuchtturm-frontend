#!/bin/sh

pip install -r requirements-dev.txt
export LEUCHTTURMMODE="DEVELOP"
export FLASK_APP=autoapp.py
export FLASK_DEBUG=1
# host flag makes sure that flask app is accessible from the network
flask run --host=0.0.0.0

#!/bin/sh

pip install -r requirements-dev.txt
export LEUCHTTURMMODE="DEVELOP"
export FLASK_APP=autoapp.py
export FLASK_DEBUG=1
flask run
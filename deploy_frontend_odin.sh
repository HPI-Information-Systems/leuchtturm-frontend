#!/bin/sh

cd client/lampenhaus
echo "RUNNING NPM INSTALL..."
npm i
echo "BUILDING REACT APPLICATION..."
npm run build
cd ../..

echo "INSTALLING PYTHON REQUIREMENTS..."
pip install -r requirements-dev.txt
export LEUCHTTURMMODE="PRODUCTION"
export FLASK_APP=autoapp.py
export FLASK_DEBUG=1
echo "RUNNING FLASK..."
# host flag set to 0.0.0.0 makes sure that flask app is accessible from the network
flask run --host=0.0.0.0

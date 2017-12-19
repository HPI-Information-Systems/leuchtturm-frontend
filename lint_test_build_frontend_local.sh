#!/bin/sh

# abort script execution if any command fails
set -e

while true; do
    read -p "Do you have a virtualenv set up and activated for this directory? (y/n) " yn
    case $yn in
        [Yy]* ) echo "Ok, continuing..."; break;;
        [Nn]* ) echo "It's recommended to set up and activate a virtualenv for this directory first" && exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

# ======================================================

echo "ENTERING THE LINTING & TESTING PHASE..."

echo "INSTALLING PYTHON REQUIREMENTS..."
pip install -r requirements-dev.txt
echo "LINTING FLASK..."
flake8 .
echo "TESTING FLASK..."
pytest

echo "INSTALLING JS REQUIREMENTS..."
cd client/lampenhaus
npm install
echo "LINTING REACT..."
./node_modules/.bin/eslint .
echo "TESTING REACT..."
./node_modules/.bin/jest

echo "LINTING & TESTING PHASE COMPLETE."

# ======================================================

echo "ENTERING THE BUILD PHASE..."

echo "BUILDING REACT..."
npm run build

echo "BUILD PHASE COMPLETE."

# ======================================================

echo "LINTING, TESTING AND BUILDING WAS SUCCESSFUL"



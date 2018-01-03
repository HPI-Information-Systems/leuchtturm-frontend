"""Entry point for the Flask app when it's run from the command line via 'flask run'."""

from app import create_app
app = create_app()

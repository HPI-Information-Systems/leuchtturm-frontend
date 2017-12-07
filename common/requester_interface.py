"""This module provides the most basic technical functionality for communication with solr."""
import requests


class RequesterInterface():
    """A class for sending queries to solr."""

    def __init__(self, url, core, response_format):
        """
        Initialize.

        response_format has to be 'json', 'text', 'binary', or 'raw'
        """
        self.url = url
        self.core = core
        self.response_format = response_format

        self.query = None

    def set_query(self, query):
        """Build a query with HTTPS parameters."""
        params = query.http_params

        if self.url is None or self.core is None:
            raise Exception('Url or core is not specified')

        self.query = self.url + self.core + '/' + params['qt'] + '?'
        for key in params.keys():
            self.query += key + '=' + str(params[key]) + '&'

    def send_query(self):
        """Perform the query."""
        result = None
        connection = requests.get(self.query)
        if self.response_format is 'json':
            result = connection.json()
        elif self.response_format is 'text':
            result = connection.text
        elif self.response_format is 'binary':
            result = connection.content
        elif self.response_format is 'raw':
            result = connection.raw
        else:
            raise Exception('No valid response format')

        return result


"""
ri = RequesterInterface('http://localhost:8983/solr/', 'entities', 'json')
params = {'qt': 'select', 'q': 'Gooddell', 'wt': 'json'}
ri.set_query(params)
print(ri.send_query())
"""

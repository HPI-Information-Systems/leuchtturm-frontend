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

        if self.url is None or self.core is None:
            raise Exception('Url or core is not specified')

        self.query = query

    def send_query(self):
        """Perform the query."""
        print('======', self.query.http_params, '\n')
        # connection = requests.get(self.query)
        connection = requests.get(self.url + self.core + '/' + self.query.qt, params=self.query.http_params)
        print(connection.url)

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

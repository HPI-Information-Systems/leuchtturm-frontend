"""This module builds queries and passes them to the interface."""

import configparser
from os import environ as env
from requester_interface import RequesterInterface


class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 core,
                 search_term,
                 response_format='json',
                 limit=10,
                 snippets=False):
        """Initialize. Provide flag: 'dev' or 'production'."""
        self.config = configparser.ConfigParser()
        self.config.read('config.ini')
        port = str(self.config['CONNECTION']['Port'])
        if env['LEUCHTTURMMODE'] == 'DEVELOP':
            host = 'localhost'
        elif env['LEUCHTTURMMODE'] == 'PRODUCTION':
            host = str(self.config['CONNECTION']['Host'])
        else:
            raise ValueError('Environment variable "LEUCHTTURMMODE" has to be set to "DEVELOP" or "PRODUCTION".')

        self.url = 'http://' + host + ':' + port + '/solr/'
        self.core = core
        self.params = {'qt': 'select'}
        self.params['q'] = search_term
        self.params['wt'] = response_format
        self.params['rows'] = limit
        self.params['hl'] = snippets

        self.requester = RequesterInterface(self.url, self.core, response_format)
        print(self.url)

    def send(self):
        """Send a simple query."""
        print(self.params)
        query = Query(self.params)

        # send query
        self.requester.set_query(query)
        answer = self.requester.send_query()
        return answer


class Query():
    """A class for Query objects."""

    def __init__(self, params):
        """Initialize."""
        self.http_params = params


"""
Test

qb = QueryBuilder('dev', 'entities', 'json')
qb.send_standard_query('Gooddell')
"""

"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface
import configparser
from os import environ as env
from os import path


class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 core,
                 search_term,
                 filter_by_fields,
                 response_format='json',
                 limit=10,
                 snippets=False):
        """Initialize. Provide flag: 'dev' or 'production'."""
        configpath = path.join(path.dirname(path.abspath(__file__)), 'config.ini')
        self.config = configparser.ConfigParser()
        self.config.read(configpath)
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
        self.params['fl'] = filter_by_fields # coma seperated
        self.params['wt'] = response_format
        self.params['rows'] = limit
        self.params['hl'] = str(snippets).lower()

        self.requester = RequesterInterface(self.url, self.core, response_format)

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

qb = QueryBuilder('entities', ['name'],'json')
qb.send()
"""

"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface
import configparser

class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 flag,
                 core,
                 search_term,
                 filter_by_fields,
                 response_format='json',
                 limit=10,
                 snippets=False):
        """Initialize. Provide flag: 'dev' or 'production'."""
        self.config = configparser.ConfigParser()
        self.config.read('config.ini')
        port = str(self.config['CONNECTION']['Port'])
        if flag == 'dev':
            host = 'localhost'
        elif flag == 'production':
            host = str(self.config['CONNECTION']['Host'])
        else:
            raise ValueError('Flag has to be "dev" or "production".')

        self.url = 'http://' + host + ':' + port + '/solr/'
        self.core = core
        self.params = {'qt': 'select'}
        self.params['q'] = search_term
        self.params['fl'] = filter_by_fields # coma seperated
        self.params['wt'] = response_format
        self.params['rows'] = limit
        self.params['hl'] = str(snippets).lower()

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
qb.send()
"""

"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface
import configparser
from os import environ as env
from os import path

DEFAULT_SHOW_FIELDS = '*'
DEFAULT_LIMIT = 10
DEFAULT_HIGHLIGHTING = False
DEFAULT_HIGHLIGHTING_FIELD = ''
DEFAULT_OFFSET = 0
DEFAULT_RESPONSE_FORMAT = 'json'

LEUCHTTURM = 'LEUCHTTURMMODE'


class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 core,
                 query,
                 show_fields=DEFAULT_SHOW_FIELDS,
                 limit=DEFAULT_LIMIT,
                 offset=DEFAULT_OFFSET,
                 highlighting=DEFAULT_HIGHLIGHTING,
                 highlighting_field=DEFAULT_HIGHLIGHTING_FIELD,
                 response_format=DEFAULT_RESPONSE_FORMAT):
        """Initialize. Provide flag: 'dev' or 'production'."""
        if core is None or query is None:
            raise ValueError('core and query need a value')
        if show_fields is None:
            show_fields = DEFAULT_SHOW_FIELDS
        if limit is None:
            limit = DEFAULT_LIMIT
        if offset is None:
            offset = DEFAULT_OFFSET
        if highlighting is None:
            highlighting = DEFAULT_HIGHLIGHTING
        if highlighting_field is None:
            highlighting_field = DEFAULT_HIGHLIGHTING_FIELD
        if response_format is None:
            response_format = DEFAULT_RESPONSE_FORMAT

        configpath = path.join(path.dirname(path.abspath(__file__)), 'config.ini')
        self.config = configparser.ConfigParser()
        self.config.read(configpath)
        port = str(self.config['SOLR_CONNECTION']['Port'])
        if LEUCHTTURM not in env:
            raise ValueError('Environment variable "LEUCHTTURMMODE" has to be set to "DEVELOP" or "PRODUCTION".')
        elif env[LEUCHTTURM] == 'DEVELOP':
            host = 'localhost'
        elif env[LEUCHTTURM] == 'PRODUCTION':
            host = str(self.config['SOLR_CONNECTION']['Host'])

        self.url = 'http://' + host + ':' + port + '/solr/'
        self.core = core
        self.params = {'qt': 'select'}
        self.params['q'] = str(query)
        self.params['fl'] = show_fields  # comma seperated
        self.params['wt'] = response_format
        self.params['rows'] = limit
        self.params['start'] = offset
        self.params['hl'] = str(highlighting).lower()
        self.params['hl.fl'] = str(highlighting_field)

        self.requester = RequesterInterface(self.url, self.core, response_format)

    def send(self):
        """Send a simple query."""
        print("========", self.params)
        query_concatenated = Query(self.params)
        # send query
        self.requester.set_query(query_concatenated)
        answer = self.requester.send_query()
        return answer


class Query():
    """A class for Query objects."""

    def __init__(self, params):
        """Initialize."""
        self.http_params = params

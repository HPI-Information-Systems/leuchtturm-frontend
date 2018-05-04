"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface
from os import environ as env
from common.util import get_config

DEFAULT_LIMIT = 10
DEFAULT_HIGHLIGHTING = False
DEFAULT_HIGHLIGHTING_FIELD = ''
DEFAULT_OFFSET = 0
DEFAULT_RESPONSE_FORMAT = 'json'
DEFAULT_MORE_LIKE_THIS = False
DEFAULT_FILTER = ''
DEFAULT_FILTER_QUERY = ''
DEFAULT_CORE_TYPE = 'Core'
DEFAULT_SORT = 'Relevance'
SORT_FIELD_MAP = {
    'Relevance': 'score desc',
    'Newest first': 'header.date desc',
    'Oldest first': 'header.date asc'
}

DEVELOP = 'DEVELOP'


class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 dataset,
                 query,
                 limit=DEFAULT_LIMIT,
                 offset=DEFAULT_OFFSET,
                 highlighting=DEFAULT_HIGHLIGHTING,
                 highlighting_field=DEFAULT_HIGHLIGHTING_FIELD,
                 response_format=DEFAULT_RESPONSE_FORMAT,
                 more_like_this=DEFAULT_MORE_LIKE_THIS,
                 fl=DEFAULT_FILTER,
                 fq=DEFAULT_FILTER_QUERY,
                 core_type=DEFAULT_CORE_TYPE,
                 sort=DEFAULT_SORT):
        """Initialize. Provide flag: 'dev' or 'production'."""
        config = get_config(dataset)
        host = config['SOLR_CONNECTION']['Host']
        port = config['SOLR_CONNECTION']['Port']
        core = config['SOLR_CONNECTION'][core_type]
        if host is None or port is None or core is None or query is None:
            raise ValueError('host, port, core and query need a value')
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
        if sort is None or sort is '':
            sort = DEFAULT_SORT

        if DEVELOP in env and env[DEVELOP] == 'DEVELOP':
            host = 'localhost'

        self.url = 'http://' + host + ':' + port + '/solr/'
        self.core = core
        self.params = {
            'qt': 'select',
            'q': str(query),
            'wt': response_format,
            'rows': limit,
            'start': offset,
            'hl': str(highlighting).lower(),
            'hl.fl': str(highlighting_field),
            'fl': fl,
            'fq': fq,
            'sort': SORT_FIELD_MAP[str(sort)]
        }
        if more_like_this:
            self.params['mlt'] = 'true'
            self.params['mlt.fl'] = 'body'

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

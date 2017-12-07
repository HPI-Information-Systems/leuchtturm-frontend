"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface


class QueryBuilder():
    """Class for building queries on high level."""

    def __init__(self,
                 url,
                 core,
                 search_term,
                 response_format='json',
                 limit=10,
                 snippets=False):
        """Initialize."""
        self.url = url
        self.core = core
        self.params = {'qt': 'select'}
        self.params['q'] = search_term
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

qb = QueryBuilder('http://localhost:8983/solr/', 'entities', 'json')
qb.send_standard_query('Gooddell')
"""

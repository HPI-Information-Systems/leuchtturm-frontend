"""This module builds queries and passes them to the interface."""

from .requester_interface import RequesterInterface
from os import environ as env
from common.util import get_config
import re

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
        self.qt = 'select'
        self.params = query
        if type(self.params) == str:
            self.params = {'q': self.params}

        self.params['wt'] = response_format,
        self.params['rows'] = limit,
        self.params['start'] = offset,
        self.params['hl'] = str(highlighting).lower(),
        self.params['hl.fl'] = str(highlighting_field),
        self.params['fl'] = fl,
        self.params['fq'] = fq,
        self.params['sort'] = SORT_FIELD_MAP[str(sort)],

        if more_like_this:
            self.params['mlt'] = 'true'
            self.params['mlt.fl'] = 'body'

        self.requester = RequesterInterface(self.url, self.core, response_format)

    def send(self):
        """Send a simple query."""
        query_concatenated = Query(self.params, self.qt)
        # send query
        self.requester.set_query(query_concatenated)
        answer = self.requester.send_query()
        return answer


class Query():
    """A class for Query objects."""

    def __init__(self, params, qt):
        """Initialize."""
        self.qt = qt
        self.http_params = params


# These rules all independent, order of escaping doesn't matter
escape_rules = {'+': r'\+',
                '-': r'\-',
                '&': r'\&',
                '|': r'\|',
                '!': r'\!',
                '(': r'\(',
                ')': r'\)',
                '{': r'\{',
                '}': r'\}',
                '[': r'\[',
                ']': r'\]',
                '^': r'\^',
                '~': r'\~',
                '*': r'\*',
                '?': r'\?',
                ':': r'\:',
                '"': r'\"',
                ';': r'\;',
                '/': r'\/',
                ' ': r'\ '}


def escaped_seq(term):
    """Yield the next string based on the next character (either this char or escaped version)."""
    for char in term:
        if char in escape_rules.keys():
            yield escape_rules[char]
        else:
            yield char


def escape_solr_arg(term):
    """Apply escaping to the passed in query phrase escaping special characters like : , etc."""
    term = term.replace('\\', r'\\')  # escape \ first
    return "".join([next_str for next_str in escaped_seq(term)])


DOUBLE_FUZZY_LENGTH = 7


def build_fuzzy_solr_query(phrase):
    """Change the phrase to support fuzzy hits via solr."""
    if not phrase:
        phrase = ''

    escaped_search_phrase = escape_solr_arg(phrase)

    terms = escaped_search_phrase.split('\ ')

    def build_query_term(term):
        # allow fuzzier search if the term is longer, boost closer hits a decimal magnitude more
        if not term:
            return '*'
        elif len(term) >= DOUBLE_FUZZY_LENGTH:
            return 'body:{0}^100 OR body:{0}~1^10 OR body:{0}~2 ' \
                   'OR header.subject:{0}^100 OR header.subject:{0}~1^10 OR header.subject:{0}~2'.format(term)
        else:
            return 'body:{0}^10 OR body:{0}~1 OR header.subject:{0}^10 OR header.subject:{0}~1'.format(term)

    expanded_terms = list(map(build_query_term, terms))
    query = '(' + ') AND ('.join(expanded_terms) + ')'
    return query


def build_filter_query(filter_object, filter_correspondents=True, is_topic_request=False, join_string='', core_type=''):
    filter_query_list = []

    if filter_object.get('startDate') or filter_object.get('endDate'):
        filter_query_list.append('header.date:[{} TO {}]'.format(
            (filter_object['startDate'] + 'T00:00:00Z') if filter_object['startDate'] else '*',
            (filter_object['endDate'] + 'T23:59:59Z') if filter_object['endDate'] else '*'))

    if filter_object.get('sender') and filter_correspondents:
        filter_query_list.append('header.sender.identifying_name:{} OR header.sender.identifying_name:{}'.format(
            re.escape(filter_object['sender']),
            re.escape(filter_object['sender'].title())))

    if filter_object.get('recipient') and filter_correspondents:
        recipient = filter_object['recipient']
        # all non-alphanumerics must be escaped in order for Solr to match only the identifying_name field-part:
        # if we DIDN'T specify 'identifying_name' for 'recipients' here, also 'name' and 'email' would be searched
        # because all these three attributes are stored in one big 'recipients' string in Solr!

        filter_query_list.append("header.recipients:*\"'identifying_name':'{}'\"* "
                                 "OR header.recipients:*\"'identifying_name':'{}'\"*".format(
            re.escape(recipient),
            re.escape(recipient.title())))

    if filter_object.get('selectedEmailClasses'):
        filter_query_list.append('category.top_category:' +
                                 (' OR category.top_category:'.join(filter_object['selectedEmailClasses'])))

    if filter_object.get('selectedClusters'):
        filter_query_list.append('cluster.number:' +
                                 (' OR cluster.number:'.join(filter_object['selectedClusters'])))

    filter_query = [join_string + q for q in filter_query_list]

    # filter_query_pre = ('&fq=' + join_string) if is_topic_request and filter_query_list else ''
    # filter_query = filter_query_pre + ('&fq=' + join_string).join(filter_query_list)

    if filter_object.get('selectedTopics'):
        topic_filter = ''
        if not is_topic_request:
            topic_filter += '{!join from=doc_id fromIndex=' + core_type + ' to=doc_id}'

        topic_filter += '(topic_id:'
        topic_filter += ' OR topic_id:'.join(str(topic_id) for topic_id in filter_object['selectedTopics'])
        topic_filter += ')'
        topic_filter += 'AND topic_conf: [' + str(filter_object.get('topicThreshold', '0.2')) + ' TO *]'
        filter_query.append(topic_filter)

    return filter_query

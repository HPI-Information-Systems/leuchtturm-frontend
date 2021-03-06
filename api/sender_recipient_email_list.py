"""This controller forwards frontend requests to Solr listing emails of a correspondent or between two."""

from flask import current_app
from api.controller import Controller
from common.query_builder import QueryBuilder, build_filter_query, build_fuzzy_solr_query
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_config
import json
import re

DEFAULT_LIMIT = 100
DEFAULT_OFFSET = 0


class SenderRecipientEmailList(Controller):
    """Makes the get_sender_recipient_email_list method accessible.

    Example request:
    /api/sender_recipient_email_list?sender=scott.neal@enron.com&recipient=john.arnold@enron.com&dataset=enron&start_date=1800-05-20&end_date=2004-07-30
    """

    @json_response_decorator
    def get_sender_recipient_email_list():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        sender = Controller.get_arg('sender', default='*')
        recipient = Controller.get_arg('recipient', default='*')
        sender_or_recipient = Controller.get_arg('sender_or_recipient', required=False)
        current_app.logger.debug('########## %s ###### %s ###### %s ###########',
                                 sender, recipient, sender_or_recipient)
        limit = Controller.get_arg('limit', int, default=DEFAULT_LIMIT)
        offset = Controller.get_arg('offset', int, default=DEFAULT_OFFSET)

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, False, core_type=core_topics_name)

        if sender == '*' and recipient == '*' and not sender_or_recipient:
            raise SyntaxError('Please provide sender or recipient or both or sender_or_recipient.')

        original_sender = sender
        original_recipient = recipient
        if sender_or_recipient:
            sender = recipient = sender_or_recipient

        if sender != '*':
            sender = re.escape(sender)
        if recipient != '*':
            # all non-alphanumerics must be escaped in order for Solr to match only the identifying_name field-part:
            # if we DIDN'T specify 'identifying_name' for 'recipients' here, also 'name' and 'email' would be searched
            # because all these three attributes are stored in one big 'recipients' string in Solr!
            recipient = '*"\'identifying_name\': \'{}\'"*'.format(re.escape(recipient))

        operator = 'OR' if sender_or_recipient else 'AND'
        q = '(header.sender.identifying_name:{} {} header.recipients:{}) AND {}'.format(
            sender, operator, recipient, build_fuzzy_solr_query(filter_object.get('searchTerm', '')))

        query_builder = QueryBuilder(
            dataset=dataset,
            query=q,
            fq=filter_query,
            limit=limit,
            offset=offset,
            sort='Newest first'
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)

        return {
            'results': parse_email_list(parsed_solr_result['response']['docs']),
            'numFound': parsed_solr_result['response']['numFound'],
            'query': q,
            'senderEmail': original_sender,
            'recipientEmail': original_recipient
        }

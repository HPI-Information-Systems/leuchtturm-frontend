"""The sender recipient email controller forwards frontend requests to Solr listing emails between two correspondents."""
from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_default_core

DEFAULT_LIMIT = 100
DEFAULT_OFFSET = 0


class SenderRecipientEmailList:
    """Makes the get_sender_recipient_email_list method accessible.

    Example request:
    /api/sender_recipient_email_list?sender=scott.neal@enron.com&recipient=john.arnold@enron.com
    """

    @json_response_decorator
    def get_sender_recipient_email_list():
        core = request.args.get('core', type=str, default=get_default_core())
        sender = request.args.get('sender', type=str, default='*')
        recipient = request.args.get('recipient', type=str, default='*')
        sender_or_recipient = request.args.get('sender_or_recipient', type=str)
        limit = request.args.get('limit', type=int, default=DEFAULT_LIMIT)
        offset = request.args.get('offset', type=int, default=DEFAULT_OFFSET)
        if sender == '*' and recipient == '*' and not sender_or_recipient:
            raise SyntaxError('Please provide sender or recipient or both or sender_or_recipient.')

        query = ''
        if sender_or_recipient:
            query = 'header.sender.email:{0} OR header.recipients:*{0}*'.format(sender_or_recipient)
        else:
            query = 'header.sender.email:{0} AND header.recipients:*{1}*'.format(sender, recipient)

        query_builder = QueryBuilder(
            core,
            query,
            limit,
            offset,
        )
        result = query_builder.send()

        parsed_result = parse_solr_result(result)

        return {
            'results': parse_email_list(parsed_result['response']['docs']),
            'numFound': parsed_result['response']['numFound'],
            'query': query,
            'senderEmail': sender,
            'recipientEmail': recipient
        }

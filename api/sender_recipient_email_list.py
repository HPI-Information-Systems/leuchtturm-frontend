"""The sender recipient email controller forwards frontend requests to Solr listing emails between two correspondents."""
from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_default_core

DEFAULT_LIMIT = 10000
DEFAULT_OFFSET = 0


class SenderRecipientEmailList:
    """Makes the get_sender_recipient_email_list method accessible.

    Example request:
    /api/sender_recipient_email_list?sender=scott.neal@enron.com&recipient=john.arnold@enron.com
    """

    @json_response_decorator
    def get_sender_recipient_email_list():
        core = request.args.get('core', default=get_default_core(), type=str)
        sender = request.args.get('sender')
        recipient = request.args.get('recipient')
        limit = request.args.get('limit', type=int, default=DEFAULT_LIMIT)
        offset = request.args.get('offset', type=int, default=DEFAULT_OFFSET)
        if not sender or not recipient:
            raise SyntaxError('Please provide a sender and a recipient')

        query = 'header.sender.email:' + sender + ' AND header.recipients:*' + recipient + '*'

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

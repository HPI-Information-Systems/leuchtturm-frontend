"""This controller forwards frontend requests to Solr listing emails of a correspondent or between two."""
from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_config

DEFAULT_LIMIT = 100
DEFAULT_OFFSET = 0


class SenderRecipientEmailList:
    """Makes the get_sender_recipient_email_list method accessible.

    Example request:
    /api/sender_recipient_email_list?sender=scott.neal@enron.com&recipient=john.arnold@enron.com&dataset=enron
    """

    @json_response_decorator
    def get_sender_recipient_email_list():
        dataset = request.args.get('dataset')
        config = get_config(dataset)
        host = config['SOLR_CONNECTION']['Host']
        port = config['SOLR_CONNECTION']['Port']
        core = config['SOLR_CONNECTION']['Core']
        sender = request.args.get('sender', type=str, default='*')
        recipient = request.args.get('recipient', type=str, default='*')
        sender_or_recipient = request.args.get('sender_or_recipient', type=str)
        limit = request.args.get('limit', type=int, default=DEFAULT_LIMIT)
        offset = request.args.get('offset', type=int, default=DEFAULT_OFFSET)
        if sender == '*' and recipient == '*' and not sender_or_recipient:
            raise SyntaxError('Please provide sender or recipient or both or sender_or_recipient.')

        q = ''
        if sender_or_recipient:
            q = 'header.sender.email:{0} OR header.recipients:*{0}*&sort=header.date desc'.format(sender_or_recipient)
        else:
            q = 'header.sender.email:{0} AND header.recipients:*{1}*&sort=header.date desc'.format(sender, recipient)

        query_builder = QueryBuilder(
            host=host,
            port=port,
            core=core,
            query=q,
            limit=limit,
            offset=offset,
        )
        result = query_builder.send()

        parsed_result = parse_solr_result(result)

        return {
            'results': parse_email_list(parsed_result['response']['docs']),
            'numFound': parsed_result['response']['numFound'],
            'query': q,
            'senderEmail': sender,
            'recipientEmail': recipient
        }

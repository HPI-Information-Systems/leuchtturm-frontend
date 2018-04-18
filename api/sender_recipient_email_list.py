"""This controller forwards frontend requests to Solr listing emails of a correspondent or between two."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list

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
        sender = Controller.get_arg('sender', default='*')
        recipient = Controller.get_arg('recipient', default='*')
        sender_or_recipient = Controller.get_arg('sender_or_recipient', required=False)
        limit = Controller.get_arg('limit', int, default=DEFAULT_LIMIT)
        offset = Controller.get_arg('offset', int, default=DEFAULT_OFFSET)
        start_date = Controller.get_arg('start_date', required=False)
        start_date = (start_date + "T00:00:00Z") if start_date else "*"
        end_date = Controller.get_arg('end_date', required=False)
        end_date = (end_date + "T23:59:59Z") if end_date else "*"
        fq = "header.date:[" + start_date + " TO " + end_date + "]"

        if sender == '*' and recipient == '*' and not sender_or_recipient:
            raise SyntaxError('Please provide sender or recipient or both or sender_or_recipient.')

        if sender_or_recipient:
            q = 'header.sender.email:{0} OR header.recipients:*{0}*&sort=header.date desc'.format(sender_or_recipient)
        else:
            q = 'header.sender.email:{0} AND header.recipients:*{1}*&sort=header.date desc'.format(sender, recipient)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=q,
            fq=fq,
            limit=limit,
            offset=offset,
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)

        return {
            'results': parse_email_list(parsed_solr_result['response']['docs']),
            'numFound': parsed_solr_result['response']['numFound'],
            'query': q,
            'senderEmail': sender,
            'recipientEmail': recipient
        }

"""The terms api route can be used to get terms for a mail address from solr."""

from flask import request
import datetime
from common.util import json_response_decorator, escape_solr_arg
from common.query_builder import QueryBuilder

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 10
SOLR_MAX_INT = 2147483647
SECONDS_PER_DAY = 86400


class Terms:
    """Makes the get_terms_for_correspondent and get_correspondent_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?email_address=alewis@enron.com&limit=5&dataset=enron

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron
    """

    @json_response_decorator
    def get_terms_for_correspondent():
        dataset = request.args.get('dataset')

        email_address = request.args.get('email_address')
        if not email_address:
            raise SyntaxError("Please provide an argument 'email_address'")

        query = (
            "header.sender.email:" + email_address +
            "&facet=on&facet.limit=" + str(TOP_ENTITIES_LIMIT) +
            "&facet.field=entities.person&facet.field=entities.organization" +
            "&facet.field=entities.miscellaneous&facet.field=entities.location"
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=0  # as we are not interested in the matching docs themselves but only in the facet output
        )
        solr_result = query_builder.send()

        top_terms = solr_result['facet_counts']['facet_fields']
        top_terms_formatted = []

        for entity_type, entities_with_count in top_terms.items():
            entity_type_formatted = entity_type.split('entities.')[1].capitalize()
            for i in range(0, len(entities_with_count), 2):
                top_terms_formatted.append({
                    "entity": entities_with_count[i],
                    "type": entity_type_formatted,
                    "count": entities_with_count[i + 1]
                })

        return top_terms_formatted

    @json_response_decorator
    def get_correspondents_for_term():
        dataset = request.args.get('dataset')

        term = request.args.get('term')

        if not term:
            raise SyntaxError("Please provide an argument 'term'")

        escaped_term = escape_solr_arg(term)

        query = 'body:*{0}* OR header.subject:*{0}*'.format(escaped_term) + \
                '&group=true&group.field=header.sender.email'

        fl = 'header.sender.email'

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            fl=fl
        )
        solr_result = query_builder.send()
        groups = solr_result['grouped']['header.sender.email']['groups']
        total_matches = solr_result['grouped']['header.sender.email']['matches']

        groups_sorted = sorted(groups, key=lambda doc: doc['doclist']['numFound'], reverse=True)
        top_senders = groups_sorted[:TOP_CORRESPONDENTS_LIMIT]

        result = {
            'correspondents': [],
            'numFound': total_matches
        }
        for sender in top_senders:
            result['correspondents'].append({
                'email_address': sender['groupValue'],
                'count': sender['doclist']['numFound']
            })

        return result

    @json_response_decorator
    def get_dates_for_term():
        dataset = request.args.get('dataset')
        term = request.args.get('term')

        if not term:
            raise SyntaxError("Please provide an argument 'term'")

        escaped_term = escape_solr_arg(term)

        query = 'body:*{0}* OR header.subject:*{0}*'.format(escaped_term) + \
                '&group=true&group.field=header.date'

        fl = 'header.date'

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            fl=fl
        )
        solr_result = query_builder.send()
        groups = solr_result['grouped']['header.date']['groups']

        date_dict = {}
        for group in groups:
            group_day = int(group['groupValue'] / SECONDS_PER_DAY) * SECONDS_PER_DAY
            if group_day in date_dict:
                date_dict[group_day] += group['doclist']['numFound']
            else:
                date_dict[group_day] = group['doclist']['numFound']

        dates = []
        for key, value in date_dict.items():
            dates.append({
                'date': datetime.datetime.fromtimestamp(int(key)).strftime('%Y-%m-%d'),
                'count': value
            })

        return sorted(dates, key=lambda date: date['date'], reverse=False)

"""The terms api route can be used to get terms for a mail address from solr."""

from api.controller import Controller
import datetime
from common.util import json_response_decorator, escape_solr_arg
from common.query_builder import QueryBuilder

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 10
SOLR_MAX_INT = 2147483647
SECONDS_PER_DAY = 86400


class Terms(Controller):
    """Makes the get_terms_for_correspondent, get_correspondent_for_term and get_dates_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?email_address=scott.neal@enron.com&limit=5&dataset=enron

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron

    Example request for get_dates_for_term:
    /api/term/dates?term=Hello&dataset=enron
    """

    @json_response_decorator
    def get_terms_for_correspondent():
        dataset = Controller.get_arg('dataset')
        email_address = Terms.get_arg('email_address')

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
        dataset = Controller.get_arg('dataset')
        term = Controller.get_arg('term')
        escaped_term = escape_solr_arg(term)

        group_by = 'header.sender.email'
        query = Terms.get_group_query(escaped_term, group_by)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            fl=group_by
        )
        solr_result = query_builder.send()

        return Terms.build_correspondents_for_term_result(solr_result, group_by)

    @json_response_decorator
    def get_dates_for_term():
        dataset = Controller.get_arg('dataset')
        term = Controller.get_arg('term')
        escaped_term = escape_solr_arg(term)

        group_by = 'header.date'
        query = Terms.get_group_query(escaped_term, group_by)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=SOLR_MAX_INT,
            fl=group_by
        )
        solr_result = query_builder.send()

        return Terms.build_dates_for_term_result(solr_result, group_by)

    @staticmethod
    def get_group_query(term, field):
        return 'body:*{0}* OR header.subject:*{0}*'.format(term) + \
            '&group=true&group.field=' + field

    @staticmethod
    def parse_groups(result, field):
        return result['grouped'][field]['groups']

    @staticmethod
    def parse_matches(result, field):
        return result['grouped'][field]['matches']

    @staticmethod
    def build_correspondents_for_term_result(solr_result, group_by):
        groups = Terms.parse_groups(solr_result, group_by)
        total_matches = Terms.parse_matches(solr_result, group_by)

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

    @staticmethod
    def build_dates_for_term_result(solr_result, group_by):
        groups = Terms.parse_groups(solr_result, group_by)

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

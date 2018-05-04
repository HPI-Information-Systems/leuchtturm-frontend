"""The terms api route can be used to get terms for a mail address from solr."""

from api.controller import Controller
from common.util import json_response_decorator
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 10
SOLR_MAX_INT = 2147483647
SECONDS_PER_DAY = 86400


class Terms(Controller):
    """Makes the get_terms_for_correspondent, get_correspondent_for_term and get_dates_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?email_address=scott.neal@enron.com&limit=5&dataset=enron&start_date=2001-05-20&end_date=2001-05-30

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-21

    Example request for get_dates_for_term:
    /api/term/dates?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-20
    """

    @json_response_decorator
    def get_terms_for_correspondent():
        dataset = Controller.get_arg('dataset')
        email_address = Terms.get_arg('email_address')
        filter_query = build_filter_query(Controller.get_arg('start_date', required=False),
                                          Controller.get_arg('end_date', required=False),
                                          Controller.get_arg('sender', required=False),
                                          Controller.get_arg('recipient', required=False))

        query = (
            "header.sender.email:" + email_address +
            "&facet=true" +
            "&facet.limit=" + str(TOP_ENTITIES_LIMIT) +
            "&facet.field=entities.person" +
            "&facet.field=entities.organization" +
            "&facet.field=entities.miscellaneous" +
            "&facet.field=entities.location"
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0  # as we are not interested in the matching docs themselves but only in the facet output
        )
        solr_result = query_builder.send()

        top_terms = solr_result['facet_counts']['facet_fields']
        top_terms_formatted = []

        if solr_result['response']['numFound'] == 0:
            return []

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
        term = Controller.get_arg('term', arg_type=str, required=False)
        filter_query = build_filter_query(Controller.get_arg('start_date', required=False),
                                          Controller.get_arg('end_date', required=False),
                                          Controller.get_arg('sender', required=False),
                                          Controller.get_arg('recipient', required=False))

        group_by = 'header.sender.email'
        query = (
            build_fuzzy_solr_query(term) +
            '&group=true&group.field=' + group_by
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=SOLR_MAX_INT,
            fl=group_by
        )
        solr_result = query_builder.send()

        return Terms.build_correspondents_for_term_result(solr_result, group_by)

    @json_response_decorator
    def get_dates_for_term():
        dataset = Controller.get_arg('dataset')
        term = Controller.get_arg('term', arg_type=str, required=False)
        start_date = Controller.get_arg('start_date', required=False)
        start_date = (start_date + "T00:00:00Z") if start_date else Terms.get_date_range_border(dataset, "start")
        end_date = Controller.get_arg('end_date', required=False)
        end_date = (end_date + "T23:59:59Z") if end_date else Terms.get_date_range_border(dataset, "end")

        print('\n')
        print(start_date)
        print('\n')

        filter_query = build_filter_query(Controller.get_arg('start_date', required=False),
                                          Controller.get_arg('end_date', required=False),
                                          Controller.get_arg('sender', required=False),
                                          Controller.get_arg('recipient', required=False))

        query = (
            build_fuzzy_solr_query(term) +
            "&facet=true" +
            "&facet.range=header.date"
            "&facet.range.start=" + start_date +
            "&facet.range.end=" + end_date +
            "&facet.range.gap=%2B1MONTH"
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=0,
            fq=filter_query
        )
        solr_result = query_builder.send()

        return Terms.build_dates_for_term_result(solr_result)

    @staticmethod
    def get_date_range_border(dataset, border):
        order = "desc" if border == "end" else "asc"

        query_builder = QueryBuilder(
            dataset=dataset,
            query="header.date:[* TO *]",
            limit=1,
            sort="header.date " + order,    # ignore documents where header.date does not exist
            fl="header.date"
        )
        solr_result = query_builder.send()

        return solr_result['response']['docs'][0]['header.date']

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
    def build_dates_for_term_result(solr_result):
        result = []
        counts = solr_result['facet_counts']['facet_ranges']['header.date']['counts']
        for date, count in zip(counts[0::2], counts[1::2]):
            result.append({
                'date': Terms.format_date_for_axis(date),
                'count': count
            })
        return result

    @staticmethod
    def format_date_for_axis(date_string):
        parts = date_string.split('-')
        return parts[1] + '/' + parts[0]

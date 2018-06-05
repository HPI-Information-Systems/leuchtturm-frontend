"""The terms api route can be used to get terms for a mail address from solr."""

from api.controller import Controller
from common.util import json_response_decorator
from common.neo4j_requester import Neo4jRequester
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query, get_config
import json
import re
import datetime

TOP_ENTITIES_LIMIT = 10
TOP_CORRESPONDENTS_LIMIT = 20
SOLR_MAX_INT = 2147483647
SECONDS_PER_DAY = 86400


class Terms(Controller):
    """Makes the get_terms_for_correspondent, get_correspondent_for_term and get_dates_for_term method accessible.

    Example request for get_terms_for_correspondent:
    /api/correspondent/terms?identifying_name=Scott Neal
    &limit=5&dataset=enron&start_date=2001-05-20&end_date=2001-05-30

    Example request for get_correspondents_for_term:
    /api/term/correspondents?term=Hello&dataset=enron&start_date=2001-05-20&end_date=2001-05-21

    Example request for get_dates_for_term:
    /api/term/dates?dataset=enron&filters={%22searchTerm%22:%22%22,%22startDate%22:%22%22,%22endDate%22:%22%22,%22sender%22:%22%22,
    %22recipient%22:%22%22,%22selectedTopics%22:[],%22topicThreshold%22:0.2,%22selectedEmailClasses%22:[]}
    """

    @json_response_decorator
    def get_terms_for_correspondent():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        identifying_name = re.escape(Terms.get_arg('identifying_name'))

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, False, core_type=core_topics_name)

        query = (
            'header.sender.identifying_name:' + identifying_name +
            '&facet=true' +
            '&facet.limit=' + str(TOP_ENTITIES_LIMIT) +
            '&facet.field=entities.person' +
            '&facet.field=entities.organization' +
            '&facet.field=entities.miscellaneous' +
            '&facet.field=entities.location'
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
                    'entity': entities_with_count[i],
                    'type': entity_type_formatted,
                    'count': entities_with_count[i + 1]
                })

        return top_terms_formatted

    @json_response_decorator
    def get_correspondents_for_term():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        group_by = 'header.sender.identifying_name'
        query = (
            build_fuzzy_solr_query(term) +
            '&facet=true&facet.field=' + group_by
        )

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0
        )
        solr_result = query_builder.send()

        return Terms.build_correspondents_for_term_result(solr_result, dataset)

    @json_response_decorator
    def get_dates_for_term():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '*')
        start_range = Terms.get_date_range_border(dataset, 'start')
        end_range = Terms.get_date_range_border(dataset, 'end')
        start_date_filter = filter_object.get('startDate')
        start_date = (start_date_filter + "T00:00:00Z") if start_date_filter else start_range
        end_date_filter = filter_object.get('endDate')
        end_date = (end_date_filter + "T23:59:59Z") if end_date_filter else end_range

        obj = {}
        for period in ['day', 'week', 'month']:
            result = {}
            for category in ['business', 'personal', 'spam']:
                r = Terms.get_date_facet_result(dataset, filter_query, term, start_date, end_date, period, category)
                result['dates'] = [entry['date'] for entry in r]
                result[category] = [entry['count'] for entry in r]

            obj[period] = Terms.transform_category_frequencies_over_time(result)

        return obj

    @staticmethod
    def get_date_range_border(dataset, border):
        email_sort = "Newest first" if border == "end" else "Oldest first"

        query_builder = QueryBuilder(
            dataset=dataset,
            query="header.date:[* TO *]",     # filter documents where header.date does not exist
            limit=1,
            sort=email_sort,
            fl="header.date"
        )
        solr_result = query_builder.send()

        return solr_result['response']['docs'][0]['header.date']

    @staticmethod
    def build_correspondents_for_term_result(solr_result, dataset):
        # the following variable contains data like this: (note the coma separation, this is not a dict!)
        # ['Scott Nelson', 1234, 'Richard Smith', 293, ...]
        identifying_names_with_counts = solr_result['facet_counts']['facet_fields']['header.sender.identifying_name']

        result = {
            'correspondents': [],
            'numFound': solr_result['response']['numFound']
        }

        identifying_names = []
        for i in range(0, TOP_CORRESPONDENTS_LIMIT * 2, 2):
            identifying_names.append(identifying_names_with_counts[i])

        neo4j_requester = Neo4jRequester(dataset)
        hierarchy_results = list(neo4j_requester.get_hierarchy_for_identifying_names(identifying_names))

        for i in range(0, TOP_CORRESPONDENTS_LIMIT * 2, 2):
            hierarchy_value = 0
            for hierarchy_result in hierarchy_results:
                if identifying_names_with_counts[i] == hierarchy_result['identifying_name']:
                    hierarchy_value = hierarchy_result['hierarchy'] if hierarchy_result['hierarchy'] else 0

            if identifying_names_with_counts[i + 1]:
                result['correspondents'].append(
                    {
                        'identifying_name': identifying_names_with_counts[i],
                        'count': identifying_names_with_counts[i + 1],
                        'hierarchy': hierarchy_value
                    }
                )

        return result

    @staticmethod
    def get_date_facet_result(dataset, filter_query, term, start_date, end_date, bin_size, category):
        if bin_size == 'day':
            facet_gap = '%2B1DAY'
        elif bin_size == 'week':
            facet_gap = '%2B7DAYS'
        else:
            facet_gap = '%2B1MONTH'
        query = (
            build_fuzzy_solr_query(term) +
            '&facet=true' +
            '&facet.range=header.date'
            '&facet.range.start=' + start_date +
            '&facet.range.end=' + end_date +
            '&facet.range.gap=' + facet_gap +
            '&fq=category.top_category:' + category
        )
        solr_result = Terms.fetch_date_facet_result(dataset, query, filter_query)
        return Terms.build_dates_for_term_result(solr_result, bin_size)

    @staticmethod
    def fetch_date_facet_result(dataset, query, filter_query):
        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=0,
            fq=filter_query
        )
        return query_builder.send()

    @staticmethod
    def build_dates_for_term_result(solr_result, bin_size):
        result = []
        counts = solr_result['facet_counts']['facet_ranges']['header.date']['counts']
        for date, count in zip(counts[0::2], counts[1::2]):
            result.append({
                'date': Terms.format_date_for_axis(date, bin_size),
                'count': count
            })
        return result

    @staticmethod
    def transform_category_frequencies_over_time(parsed_result):
        result = []
        for date, business_count, personal_count, spam_count in zip(parsed_result['dates'], parsed_result['business'], parsed_result['personal'], parsed_result['spam']):
            result.append({
                'date': date,
                'business': business_count,
                'personal': personal_count,
                'spam': spam_count
            })

        return result

    @staticmethod
    def format_date_for_axis(date_string, bin_size):
        parts = date_string.split('-')
        day = parts[2][:2]
        month = parts[1]
        year = parts[0]
        month_year = month + '/' + year

        if bin_size == 'day':
            return day + '/' + month_year
        elif bin_size == 'week':
            return day + '/' + month_year + ' - ' + Terms.week_forward(year, month, day)
        else:
            return month_year

    @staticmethod
    def week_forward(year, month, day):
        current_day = datetime.date(int(year), int(month), int(day))
        week_end = current_day + datetime.timedelta(days=6)
        parts = str(week_end).split('-')
        return parts[2][:2] + '/' + parts[1] + '/' + parts[0]

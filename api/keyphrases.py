"""The datasets route can be used to get a list of datasets for which configurations are existant."""

from api.controller import Controller
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.util import json_response_decorator, parse_solr_result, get_config
import json
import re

SOLR_MAX_INT = 2147483647
FACET_LIMIT = 10000


class Keyphrases:
    """Makes the get_keyphrases methods accessible, no parameters.

    Example request: /api/keyphrases/correspondent?dataset=enron
    """

    @json_response_decorator
    def get_keyphrases_for_email_list():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        query = build_fuzzy_solr_query(term) + '&facet=true&facet.field=keyphrases'

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0,
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)
        results = parsed_solr_result['facet_counts']['facet_fields']['keyphrases']

        if len(results) == 0:
            return results

        aggregated_keyphrases = Keyphrases.parse_keyphrases(results)

        return aggregated_keyphrases

    @json_response_decorator
    def get_keyphrases_for_correspondent():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        identifying_name = re.escape(Controller.get_arg('identifying_name'))

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)

        query = 'header.sender.identifying_name:' + identifying_name + '&facet=true&facet.field=keyphrases'

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=filter_query,
            limit=0,
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)
        results = parsed_solr_result['facet_counts']['facet_fields']['keyphrases']

        if len(results) == 0:
            return results

        aggregated_keyphrases = Keyphrases.parse_keyphrases(results)

        return aggregated_keyphrases

    @staticmethod
    def parse_keyphrases(keyphrases):

        parsed_keyphrases = []
        keyphrases_list = []

        for i in range(0, len(keyphrases), 2):
            parsed_keyphrases.append({
                'phrase_with_confidence': keyphrases[i],
                'count': keyphrases[i + 1]
            })

        for keyphrase in parsed_keyphrases:
            print(keyphrase['phrase_with_confidence'])
            phrase_confidence_pair = json.loads(keyphrase['phrase_with_confidence'].replace('\'', '"'))
            keyphrase['phrase'] = phrase_confidence_pair[0]
            keyphrase['confidence'] = phrase_confidence_pair[1]
            keyphrase['score'] = keyphrase['count'] * keyphrase['confidence']
            del keyphrase['phrase_with_confidence']

        parsed_keyphrases.sort(key=lambda phrase: phrase['score'], reverse=True)

        for keyphrase in parsed_keyphrases:
            keyphrases_list.append(keyphrase['phrase'])

        return keyphrases_list

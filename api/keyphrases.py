"""The datasets route can be used to get a list of datasets for which configurations are existant."""

from api.controller import Controller
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.util import json_response_decorator, parse_solr_result, get_config
import json
import re


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

        query_builder = QueryBuilder(
            dataset=dataset,
            query={
                'q': build_fuzzy_solr_query(term),
                'facet': 'true',
                'facet.field': 'keyphrases',
                'facet.mincount': '1'
            },
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

        query_builder = QueryBuilder(
            dataset=dataset,
            query={
                'q': 'header.sender.identifying_name:' + identifying_name +
                     ' AND ' + build_fuzzy_solr_query(filter_object.get('searchTerm', '')),
                'facet': 'true',
                'facet.field': 'keyphrases',
                'facet.mincount': '1'
            },
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
            phrase_confidence_pair = json.loads(keyphrase['phrase_with_confidence']
                                                .replace('[\'', '["').replace('\', ', '", '))
            keyphrase['phrase'] = phrase_confidence_pair[0]
            keyphrase['confidence'] = phrase_confidence_pair[1]
            del keyphrase['phrase_with_confidence']

        parsed_keyphrases.sort(key=lambda phrase: len(phrase['phrase']), reverse=True)
        reranked_keyphrases = []

        for keyphrase in parsed_keyphrases:
            keyphrase['sub_count'] = keyphrase['count']
            for pot_subsumer in reranked_keyphrases:
                if keyphrase['phrase'] in pot_subsumer['phrase']:
                    keyphrase['sub_count'] = keyphrase['sub_count'] - pot_subsumer['sub_count']
            keyphrase['score'] = keyphrase['sub_count'] * keyphrase['confidence']
            reranked_keyphrases.append(keyphrase)

        reranked_keyphrases.sort(key=lambda phrase: phrase['score'], reverse=True)

        for keyphrase in reranked_keyphrases:
            keyphrases_list.append(keyphrase['phrase'])

        return keyphrases_list

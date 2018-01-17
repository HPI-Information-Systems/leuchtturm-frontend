"""The terms api route can be used to get terms for a mail address from solr."""

import itertools
import pandas as pd
from flask import request
from common.util import json_response_decorator, parse_solr_result
from common.query_builder import QueryBuilder

TOP_ENTITIES_LIMIT = 10
SOLR_MAX_INT = 2147483647


class Terms:
    """Makes the get_correspondents method accessible.

    Example request: /api/terms?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_terms():
        core = request.args.get('core', default='allthemails', type=str)

        search_term = request.args.get('email_address', type=str)
        search_field = 'header.sender.email'
        show_fields = 'entities.*'
        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")
        query_builder = QueryBuilder(
            core=core,
            search_term=search_term,
            search_field=search_field,
            show_fields=show_fields,
            limit=2147483647
        )
        result = query_builder.send()

        result_with_correct_entities = parse_solr_result(result)

        # list of dicts per mail from all mails
        entities_dicts = list(map(lambda entities_from_single_mail:
                                  list(entities_from_single_mail.values())[0],
                                  result_with_correct_entities['response']['docs']))

        entities_list = []
        # for every mail, we iterate over a dict with {entity_type : entity_list}
        # and add the entity_type to all entities in the list of this type
        for entities_dict_single_mail in entities_dicts:
            for entity_type_iterator, entities_list_iterator in entities_dict_single_mail.items():
                for entity in entities_list_iterator:
                    entity['type'] = entity_type_iterator
            entities_list_single_mail = list(entities_dict_single_mail.values())
            flat_entities_list_single_mail = list(itertools.chain.from_iterable(entities_list_single_mail))
            entities_list.extend(flat_entities_list_single_mail)

        aggregated_entities_dataframe = pd.DataFrame(entities_list).groupby(['entity', 'type'], as_index=False).sum()
        aggregated_entities_list = list(aggregated_entities_dataframe.T.to_dict().values())
        sorted_aggregated_entities_list = sorted(aggregated_entities_list,
                                                 key=lambda entity: entity['entity_count'],
                                                 reverse=True)

        if request.args.get('limit', type=int):
            limit = request.args.get('limit', type=int)
        else:
            limit = TOP_ENTITIES_LIMIT
        top_terms = sorted_aggregated_entities_list[0:limit]

        # seen = set()
        # aggregated_entities_list = []
        # for entity in entities_list:
        #     entity_tuple = tuple([entity['entity'],entity['type']])
        #     if entity_tuple not in seen:
        #         seen.add(entity_tuple)
        #         aggregated_entities_list.append(entity)
        #     else:
        #         i = aggregated_entities_list.index(entity)
        #         aggregated_entities_list[i]['entity_count'] += entity['entity_count'];
        return top_terms

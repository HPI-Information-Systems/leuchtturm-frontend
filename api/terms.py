"""The terms api route can be used to get terms for a mail address from solr."""
from flask import request
from common.util import json_response_decorator, parse_solr_result
from common.query_builder import QueryBuilder

DEFAULT_LIMIT = 10

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
        if request.args.get('limit', type=int):
            limit = request.args.get('limit', type=int)
        else:
            limit = DEFAULT_LIMIT
        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")
        query_builder = QueryBuilder(
            core=core,
            search_term=search_term,
            search_field=search_field,
            show_fields=show_fields,
            limit=limit
        )
        result = query_builder.send()

        result_with_correct_entities = parse_solr_result(result)

        # list of dicts per mail from all mails 
        entities_dicts = list(map(lambda entities_from_single_mail: list(entities_from_single_mail.values())[0], result_with_correct_entities['response']['docs']))

        entities_list = []
        # for every mail, we iterate over a dict with {entity_type : entity_list} and add the entity_type to all entities in the list of this type
        for entities_dict_single_mail in entities_dicts:
            for entity_type, entities_list in entities_dict_single_mail.items():
                for entity in entities_list:
                    entity['type'] = entity_type
            entities_list_single_mail = list(entities_dict_single_mail.values())
            flat_entities_list_single_mail = [entity for entity_type_sublist
                                            in entities_list_single_mail for entity
                                            in entity_type_sublist]
            entities_list.extend(flat_entities_list_single_mail)

        # aggregated_entities_list = sum(entity.entity_count for entity in entities_list)

        # for entity in entities_list:
        print(entities_list)

        return {
            'results': result_with_correct_entities['response']['docs'],
            'numFound': result_with_correct_entities['response']['numFound']
        }

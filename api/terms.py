"""The terms api route can be used to get terms for a mail address from solr."""

from flask import request
from common.util import json_response_decorator, get_default_core
from common.query_builder import QueryBuilder

TOP_ENTITIES_LIMIT = 10


class Terms:
    """Makes the get_terms method accessible.

    Example request: /api/terms?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_terms():
        core = request.args.get('core', default=get_default_core(), type=str)
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
            core=core,
            query=query,
            limit=0  # as we are not interested in the matching docs themselves but only in the facet output
        )
        result = query_builder.send()

        top_terms = result['facet_counts']['facet_fields']
        top_terms_formatted = []

        for entity_type, entities_with_count in top_terms.items():
            entity_type_formatted = entity_type.split('entities.')[1].capitalize()
            for i in range(0, len(entities_with_count), 2):
                top_terms_formatted.append({
                    "entity": entities_with_count[i],
                    "type": entity_type_formatted
                })

        return top_terms_formatted

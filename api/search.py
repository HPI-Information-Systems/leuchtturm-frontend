"""The search controller forwards frontend requests to Solr for keyword searches."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, build_fuzzy_solr_query, \
    build_time_filter


class Search(Controller):
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?term=andy&limit=2&offset=3&dataset=enron&start_date=1800-05-20&end_date=2004-07-30
    """

    @json_response_decorator
    def search_request():
        dataset = Controller.get_arg('dataset')
        term = Controller.get_arg('term')
        limit = Controller.get_arg('limit', arg_type=int, required=False)
        offset = Controller.get_arg('offset', arg_type=int, required=False)
        highlighting = Controller.get_arg('highlighting', arg_type=bool, required=False)
        highlighting_field = Controller.get_arg('highlighting_field', required=False)
        filter_query = build_time_filter(Controller.get_arg('start_date', required=False),
                                         Controller.get_arg('end_date', required=False))
        sort = Controller.get_arg('sort', arg_type=str, required=False)

        query = build_fuzzy_solr_query(term)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=limit,
            offset=offset,
            fq=filter_query,
            highlighting=highlighting,
            highlighting_field=highlighting_field,
            sort=sort
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)

        return {
            'results': parse_email_list(parsed_solr_result['response']['docs']),
            'numFound': parsed_solr_result['response']['numFound'],
            'searchTerm': term
        }

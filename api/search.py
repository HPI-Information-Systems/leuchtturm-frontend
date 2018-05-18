"""The search controller forwards frontend requests to Solr for keyword searches."""

from api.controller import Controller
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_config
import json


class Search(Controller):
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?term=andy&limit=2&offset=3&dataset=enron&start_date=1800-05-20&end_date=2004-07-30
    """

    @json_response_decorator
    def search_request():
        dataset = Controller.get_arg('dataset')
        core_topics_name = get_config(dataset)['SOLR_CONNECTION']['Core-Topics']
        limit = Controller.get_arg('limit', arg_type=int, required=False)
        offset = Controller.get_arg('offset', arg_type=int, required=False)
        sort = Controller.get_arg('sort', arg_type=str, required=False)

        filter_string = Controller.get_arg('filters', arg_type=str, default='{}', required=False)
        filter_object = json.loads(filter_string)
        filter_query = build_filter_query(filter_object, core_type=core_topics_name)
        term = filter_object.get('searchTerm', '')

        query = build_fuzzy_solr_query(term)

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=limit,
            offset=offset,
            fq=filter_query,
            sort=sort
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)

        return {
            'results': parse_email_list(parsed_solr_result['response']['docs']),
            'numFound': parsed_solr_result['response']['numFound'],
            'searchTerm': term
        }

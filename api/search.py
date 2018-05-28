"""The search controller forwards frontend requests to Solr for keyword searches."""

from api.controller import Controller
from common.query_builder import QueryBuilder, build_fuzzy_solr_query, build_filter_query
from common.util import json_response_decorator, parse_solr_result, parse_email_list, get_config
import json
from common.neo4j_requester import Neo4jRequester


class Search(Controller):
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?term=andy&limit=2&offset=3&dataset=enron&start_date=1800-05-20&end_date=2004-07-30
    """

    @json_response_decorator
    def search():
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

    @json_response_decorator
    def search_correspondents():
        dataset = Controller.get_arg('dataset')

        search_phrase = Controller.get_arg('search_phrase')
        match_exact = Controller.get_arg('match_exact', arg_type=bool, default=False, required=False)
        offset = Controller.get_arg('offset', arg_type=int, default=0, required=False)
        limit = Controller.get_arg('limit', arg_type=int, default=10, required=False)
        search_fields = Controller.get_arg_list(
            'search_field', default=['identifying_name'], required=False
        )

        allowed_search_field_values = {'identifying_name', 'email_addresses', 'aliases'}
        if not set(search_fields).issubset(allowed_search_field_values):
            raise Exception('Allowed values for arg search_fields are ' + str(allowed_search_field_values))

        neo4j_requester = Neo4jRequester(dataset)
        results = neo4j_requester.get_correspondents_for_search_phrase(
            search_phrase, match_exact, search_fields, offset, limit
        )
        return {
            'correspondents': [dict(result) for result in results]
        }

"""The search controller forwards frontend requests to Solr for keyword searches."""

from api.controller import Controller
from common.query_builder import QueryBuilder
from common.util import json_response_decorator, parse_solr_result, parse_email_list, escape_solr_arg


class Search(Controller):
    """Takes a search request from the frontend, processes its parameters and uses QueryBuilder to make a request to Solr.

    Afterwards, it processes the Solr response by unflattening the entities per document. The Flask response is built by
    json_response_decorator.

    Example request: /api/search?term=andy&limit=2&offset=3&dataset=enron
    """

    @json_response_decorator
    def search_request():
        dataset = Controller.get_arg('dataset')
        term = Controller.get_arg('term')
        limit = Controller.get_arg('limit', arg_type=int, required=False)
        offset = Controller.get_arg('offset', arg_type=int, required=False)
        highlighting = Controller.get_arg('highlighting', arg_type=bool, required=False)
        highlighting_field = Controller.get_arg('highlighting_field', required=False)
        start_date = Controller.get_arg('start_date', required=False)
        start_date = (start_date + "T00:00:00Z") if start_date else "*"
        end_date = Controller.get_arg('end_date', required=False)
        end_date = (end_date + "T23:59:59Z") if end_date else "*"

        escaped_search_term = escape_solr_arg(term)

        query = 'body:"{0}" OR header.subject:"{0}"'.format(escaped_search_term)

        fq = "header.date:[" + start_date + " TO " + end_date + "]"

        query_builder = QueryBuilder(
            dataset=dataset,
            query=query,
            limit=limit,
            offset=offset,
            fq=fq,
            highlighting=highlighting,
            highlighting_field=highlighting_field
        )
        solr_result = query_builder.send()

        parsed_solr_result = parse_solr_result(solr_result)

        return {
            'results': parse_email_list(parsed_solr_result['response']['docs']),
            'numFound': parsed_solr_result['response']['numFound'],
            'searchTerm': term
        }

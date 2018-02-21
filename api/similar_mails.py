"""The similar mails controller forwards frontend requests to
Solr for searching similar mails to a mail defined by doc_id."""

from flask import request
from common.query_builder import QueryBuilder
from common.util import json_response_decorator


class SimilarMails:
    """Takes search request from the frontend containing a doc_id, uses QueryBuilder to search the mail data in Solr.

    The result is parsed for similar mails and these mails are returned to the fronted sorted by the more like this
    Solr score.

    Example request: /api/email?doc_id=0000000_0001_001544349
    """

    @json_response_decorator
    def get_similar_mails_by_doc_id():
        core = request.args.get('core', default='enron_calo', type=str)

        doc_id = request.args.get('doc_id', type=str)
        search_field = "doc_id"

        if not doc_id:
            raise SyntaxError("Please provide an argument 'doc_id'")

        query = "doc_id:" + doc_id

        query_builder = QueryBuilder(
            core,
            query,
            more_like_this=True
        )

        email_result = query_builder.send()

        similar_mails = email_result['moreLikeThis'][1]['docs']
        similar_mails_dict = {}

        # return similar_mails
        similar_mail_id_array = []
        for doc in similar_mails:
            similar_mails_dict[doc['id']] = doc['score']
            similar_mail_id_array.append(doc['id'])

        query2 = SimilarMails.generate_multi_search("id", similar_mail_id_array)

        query_builder = QueryBuilder(
            core,
            query2
        )

        similar_mail_result = query_builder.send()

        for doc in similar_mail_result['response']['docs']:
            doc['score'] = similar_mails_dict[doc['id']]

        return sorted(similar_mail_result['response']['docs'], key=lambda doc: doc['score'], reverse=True)

    @staticmethod
    def generate_multi_search(search_field, search_terms):
        answer = '('
        for idx, term in enumerate(search_terms):
            answer = answer + search_field + ':' + term
            if idx != (len(search_terms) - 1):
                answer += ' OR '
        answer += ')'
        return answer



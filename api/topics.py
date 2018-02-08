"""The topics api route can be used to get topics for a mail address from solr."""

import itertools
import pandas as pd
from flask import request
from common.util import json_response_decorator, parse_solr_result
from common.query_builder import QueryBuilder
import json
from ast import literal_eval as make_tuple
import pprint

SOLR_MAX_INT = 2147483647
TOP_TOPICS_LIMIT = 10


class Topics:
    """Makes the get_topics method accessible.

    Example request: /api/topics?email_address=alewis@enron.com&limit=5
    """

    @json_response_decorator
    def get_topics():
        core = request.args.get('core', default='enron_calo', type=str)

        search_term = request.args.get('email_address', type=str)
        search_field = 'header.sender.email'
        show_fields = 'topics'
        if not search_term:
            raise SyntaxError("Please provide an argument 'search_term'")
        query_builder = QueryBuilder(
            core=core,
            search_term=search_term,
            search_field=search_field,
            show_fields=show_fields,
            limit=100
        )
        # TODO: query Solr as soon as topics in there, then parse
        result = query_builder.send()

        # a list of topic distributions for each mail, each topic as a string
        topic_distributions_per_mail_s = list(map(lambda topic_distribution_s: json.loads(topic_distribution_s["topics"][0]), result['response']['docs']))

        actual_t_dists_per_mail = []

        # extracts the actual topic distributions for each mail in the correct format [topic_confidence, [[word, word_confidence]...]...]
        for t_dist_s in topic_distributions_per_mail_s:
            actual_dist = list(map(lambda topic_distribution_l_of_s: make_tuple(topic_distribution_l_of_s), t_dist_s))
            actual_t_dists_per_mail.append(actual_dist)

        flattened_topics_over_all_mails = [item for sublist in  actual_t_dists_per_mail for item in sublist]


        df = pd.DataFrame(flattened_topics_over_all_mails)
        # convert string confidences to float
        df[0] = df[0].astype(float)

        # convert topic distribution list to tuple so that it can be aggregated
        df[1] = df[1].apply(tuple)   

        topics_with_avg_conf = df.groupby([1], as_index=False).mean()

        # retransform tuples to lists
        topics_with_avg_conf[1] = topics_with_avg_conf[1].apply(list)
        
        topics_with_conf_l = [tuple(x) for x in topics_with_avg_conf.values]

        return sorted(topics_with_conf_l, key=lambda tup: tup[1], reverse=True)[-TOP_TOPICS_LIMIT:]

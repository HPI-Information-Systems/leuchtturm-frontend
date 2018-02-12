"""The topics api route can be used to get topics for a mail address from solr."""

import pandas as pd
from flask import request
from common.query_builder import QueryBuilder
import json
from ast import literal_eval as make_tuple
from common.util import json_response_decorator

SOLR_MAX_INT = 2147483647


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

        result = query_builder.send()

        # a list of topic distributions for each mail, each topic as a string
        topic_distributions_per_mail_s = list(map(lambda topic_distribution_s: json.loads(topic_distribution_s["topics"][0]), result['response']['docs']))

        actual_t_dists_per_mail = []

        # extract the actual topic distributions for each mail in the correct format [topic_confidence,
        #  [[word, word_confidence]...]...]
        for t_dist_s in topic_distributions_per_mail_s:
            actual_dist = list(map(lambda topic_distribution_l_of_s: make_tuple(topic_distribution_l_of_s), t_dist_s))
            actual_t_dists_per_mail.append(actual_dist)

        # flatten the resulting list of lists
        flattened_topics_over_all_mails = [item for sublist in  actual_t_dists_per_mail for item in sublist]

        # use Pandas dataframe for the aggregation of confidence
        df = pd.DataFrame(flattened_topics_over_all_mails)

        # convert string confidences to float
        df[0] = df[0].astype(float)

        # convert topic distribution list to tuple so that it can be aggregated
        df[1] = df[1].apply(tuple)   

        # perform aggregation for average topic confidence
        topics_with_avg_conf = df.groupby([1], as_index=False).mean()

        # retransform tuples to lists
        topics_with_avg_conf[1] = topics_with_avg_conf[1].apply(list)
        
        # df to list oftuples
        topics_with_conf_l = [tuple(x) for x in topics_with_avg_conf.values]

        # parse every tuple into a more easily accessible object
        topics_as_objects = list(map(lambda topic_tuple: {"confidence": str(round(float(topic_tuple[1]), 2)),
                                     "words": topic_tuple[0]}, topics_with_conf_l))

        #  parse every word entry for each topic in the same way as above anf sort them by confidence
        for topic in topics_as_objects:
            topic["words"] = list(map(lambda word: {"word": word[0], "confidence": word[1]}, topic["words"]))
            topic["words"] = sorted(topic["words"], key=lambda word: word['confidence'], reverse=True)

        return sorted(topics_as_objects, key=lambda topic: topic['confidence'], reverse=True)

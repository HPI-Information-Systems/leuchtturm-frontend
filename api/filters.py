"""The filters api route can be used to get values for the filters."""

from api.controller import Controller
from common.query_builder import QueryBuilder
import json
from ast import literal_eval as make_tuple
from common.util import json_response_decorator

TOPICS_LIMIT = 100


class Filters(Controller):
    """Makes the get_filter_topics and get_filter_dates method accessible.

    Example request:
    /api/filters/topics?dataset=enron
    """

    @json_response_decorator
    def get_filter_topics():
        dataset = Controller.get_arg('dataset')
        collapse = '{!collapse field=topic_id}'
        query = '*'
        field_list = 'topic_id,terms'

        query_builder_topics = QueryBuilder(
            dataset=dataset,
            query=query,
            fq=collapse,
            limit=TOPICS_LIMIT,
            core_type='Core-Topics',
            fl=field_list
        )
        solr_result_topics = query_builder_topics.send()

        all_topics = solr_result_topics['response']['docs']

        parsed_topics = Filters.parse_filter_topics(all_topics)

        return parsed_topics

    @staticmethod
    def parse_filter_topics(all_topics):
        def parse_topic(topic):
            parsed_topic = dict()
            parsed_topic['topic_id'] = topic['topic_id']
            labels_serialized = topic['terms'].replace('(', '\"(').replace(')', ')\"')
            labels = [make_tuple(label) for label in json.loads(labels_serialized)]
            parsed_topic['label'] = ', '.join([label[0] for label in labels[0:3]])
            return parsed_topic

        parsed_topics = [parse_topic(topic) for topic in all_topics]

        return parsed_topics

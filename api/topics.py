"""The topics api route can be used to get topics for a mail address from solr."""

from api.controller import Controller
from common.query_builder import QueryBuilder
import json
from ast import literal_eval as make_tuple
from common.util import json_response_decorator, build_time_filter, parse_all_topics

SOLR_MAX_INT = 2147483647
LIMIT = 100
FACET_LIMIT = 1000


class Topics(Controller):
    """Makes the get_topics_for_correspondent method accessible.

    Example request:
    /api/correspondent/topics?email_address=alewis@enron.com&dataset=enron&start_date=2001-05-20&end_date=2001-05-20
    """

    @json_response_decorator
    def get_topics_for_correspondent():
        dataset = Controller.get_arg('dataset')
        email_address = Controller.get_arg('email_address')
        date_range_filter_query = build_time_filter(
            Controller.get_arg('start_date', required=False), Controller.get_arg('end_date', required=False))

        aggregated_topics_for_correspondent = Topics.get_aggregated_distribution(dataset,
                                                                                 email_address,
                                                                                 date_range_filter_query)
        aggregated_distribution = {
            'type': 'aggregated',
            'topics': aggregated_topics_for_correspondent
        }

        all_topics = Topics.get_all_topics(dataset)

        mail_topic_distributions = Topics.get_distributions_for_mails(dataset, email_address, date_range_filter_query)

        all_topic_distributions = mail_topic_distributions + [aggregated_distribution]

        for distribution in all_topic_distributions:
            distribution = Topics.complete_distribution(distribution, all_topics)

        return all_topic_distributions

    @staticmethod
    def parse_topic_closure_wrapper(total_email_count):
        def parse_topic(raw_topic):
            parsed_topic = dict()
            parsed_topic['topic_id'] = raw_topic['val']
            parsed_topic['confidence'] = raw_topic['sum_of_confs_for_topic'] / total_email_count
            word_confidence_tuples_serialized = raw_topic['facet_terms']['buckets'][0]['val'] \
                .replace('(', '\"(').replace(')', ')\"')
            word_confidence_tuples = [make_tuple(tuple) for tuple in json.loads(word_confidence_tuples_serialized)]
            parsed_topic['words'] = [
                {'word': tuple[0], 'confidence': tuple[1]}
                for tuple in word_confidence_tuples
            ]
            return parsed_topic
        return parse_topic

    def get_aggregated_distribution(dataset, email_address, date_range_filter_query):
        join_query = '{!join from=doc_id fromIndex=' + dataset + ' to=doc_id}header.sender.email:' + email_address + \
                     '&fq={!join from=doc_id fromIndex=' + dataset + ' to=doc_id}' + date_range_filter_query

        facet_query = {
            'facet_topic_id': {
                'type': 'terms',
                'field': 'topic_id',
                'facet': {
                    'sum_of_confs_for_topic': 'sum(topic_conf)',
                    'facet_terms': {
                        'type': 'terms',
                        'field': 'terms'
                    }
                },
                'sort': 'index asc',
                'limit': FACET_LIMIT,
                'refine': True
            }
        }

        correspondent_query = '*:*' + '&json.facet=' + json.dumps(facet_query)

        query_builder_topic_distribution = QueryBuilder(
            dataset=dataset,
            query=correspondent_query,
            fq=join_query,
            limit=0,
            core_type='Core-Topics'
        )

        # get all topics that the pipeline returned with confidences for the correspondent
        solr_result_topic_distribution = query_builder_topic_distribution.send()

        query_builder_doc_count_for_correspondent = QueryBuilder(
            dataset=dataset,
            query='header.sender.email:' + email_address,
            fq=date_range_filter_query,
            limit=0
        )
        solr_result_email_count = query_builder_doc_count_for_correspondent.send()
        total_email_count = solr_result_email_count['response']['numFound']

        if solr_result_topic_distribution['facets']['count'] == 0:
            return []

        correspondent_topics_parsed = list(map(
            Topics.parse_topic_closure_wrapper(total_email_count),
            solr_result_topic_distribution['facets']['facet_topic_id']['buckets']
        ))

        return correspondent_topics_parsed

    def get_all_topics(dataset):
        all_topics_query = '{!collapse field=topic_id}'

        query_builder_all_topics = QueryBuilder(
            dataset=dataset,
            query='*:*',
            fq=all_topics_query,
            limit=100,
            fl='topic_id,terms',
            core_type='Core-Topics'
        )

        # get all topics to complete the distribution of the correspondent
        solr_result_all_topics = query_builder_all_topics.send()
        all_topics_parsed = parse_all_topics(solr_result_all_topics['response']['docs'])

        return all_topics_parsed

    def get_distributions_for_mails(dataset, email_address, date_range_filter_query):
        join_query = '{!join from=doc_id fromIndex=' + dataset + ' to=doc_id}header.sender.email:' + email_address + \
                     '&fq={!join from=doc_id fromIndex=' + dataset + ' to=doc_id}' + date_range_filter_query

        facet_query = {
            'facet_doc_id': {
                'type': 'terms',
                'field': 'doc_id',
                'facet': {
                    'facet_conf': {
                        'type': 'terms',
                        'field': 'topic_conf',
                        'facet': {
                            'facet_id': {
                                'type': 'terms',
                                'field': 'topic_id'
                            }
                        }
                    },

                },
                'sort': 'index asc',
                'limit': FACET_LIMIT,
                'refine': True
            }
        }

        correspondent_query = '*:*' + '&json.facet=' + json.dumps(facet_query)

        query_builder_all_topic_distributions = QueryBuilder(
            dataset=dataset,
            query=correspondent_query,
            fq=join_query,
            limit=0,
            core_type='Core-Topics'
        )

        # get all topics that the pipeline returned with confidences for the correspondent
        solr_result_all_topic_distributions = query_builder_all_topic_distributions.send()

        if solr_result_all_topic_distributions['facets']['count'] == 0:
            return []

        topic_distributions = list(map(
            Topics.parse_per_mail_distribution,
            solr_result_all_topic_distributions['facets']['facet_doc_id']['buckets']
        ))

        return topic_distributions

    def parse_per_mail_distribution(mail):
        distribution = list(map(
            lambda topic: {
                'topic_id': topic['facet_id']['buckets'][0]['val'],
                'confidence': topic['val']
            },
            mail['facet_conf']['buckets']
        ))

        return {
            'type': 'unaggregated',
            'topics': distribution
        }

    def complete_distribution(distribution, all_topics):
        topics_ids_in_distribution = [topic['topic_id'] for topic in distribution['topics']]

        for topic in all_topics:
            if topic['topic_id'] not in topics_ids_in_distribution:
                if distribution['type'] != 'aggregated':
                    topic.pop('words', None)
                distribution['topics'].append(topic)

        return distribution

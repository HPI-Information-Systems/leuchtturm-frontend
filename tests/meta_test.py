"""Test config class."""


class MetaTest:
    """This class lets you configure some parameters for all queries invoked in the Search API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        # TODO: temporary fix, switch back to 'enron' as soon as 'enron' Solr and Neo4j know about 'identifying_name'
        'dataset': 'enron-dev'
    }

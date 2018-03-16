"""Test config class."""


class MetaTest:
    """This class lets you configure some parameters for all queries invoked in the Search API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        'dataset': 'enron'
    }

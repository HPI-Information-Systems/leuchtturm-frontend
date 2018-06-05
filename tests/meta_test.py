"""Test config class."""


class MetaTest:
    """This class lets you configure some parameters for all queries invoked in the Search API Tests.

    The params dictionary can be extended for specific queries inside their appropriate test cases.
    """

    # set a core for the Flask tests to use by default
    params = {
        'dataset': 'enron-dev',
    }

    @staticmethod
    def get_identifying_name_for(dataset):
        if dataset == 'dnc':
            return 'Mark Paustenbach'
        else:
            return 'Scott Neal'

    @staticmethod
    def get_month_start_end_dates_for(dataset):
        if dataset == 'dnc':
            return ('2015-05-05', '2015-08-08')
        else:
            return ('2000-05-05', '2000-08-08')

    @staticmethod
    def get_year_start_end_dates_for(dataset):
        if dataset == 'dnc':
            return ('2015-01-01', '2016-12-30')
        else:
            return ('2000-01-01', '2001-12-30')

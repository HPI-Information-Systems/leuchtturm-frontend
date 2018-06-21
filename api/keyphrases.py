"""The datasets route can be used to get a list of datasets for which configurations are existant."""

from common.util import json_response_decorator
from os import listdir
from os.path import isfile, join, dirname, abspath
import re


class Datasets:
    """Makes the get_keyphrases method accessible, no parameters.

    Example request: /api/keyphrases
    """

    @json_response_decorator
    def get_keyphrases():
        keyphrases = ['enron corp',
                      'debtor company',
                      'bnp paribas',
                      'enron building',
                      'resolution center',
                      'bankruptcy',
                      'estate',
                      'confidential',
                      'general reinwald',
                      'enron']

        return keyphrases

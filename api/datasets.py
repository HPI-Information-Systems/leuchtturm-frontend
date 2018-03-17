"""The datasets route can be used to get a list of datasets for which configurations are existant."""

from common.util import json_response_decorator
from os import listdir
from os.path import isfile, join, dirname, abspath
import re


class Datasets:
    """Makes the get_datasets method accessible, no parameters.

    Example request: /api/datasets
    """

    @json_response_decorator
    def get_datasets():
        datasets = []
        current_path = dirname(abspath(__file__))
        parent_path = dirname(current_path)
        config_path = join(parent_path, 'config')
        files = [f for f in listdir(config_path) if isfile(join(config_path, f))]
        for f in files:
            if re.match('config-(.*).ini', f):
                f = re.sub('config-', '', f)
                f = re.sub('.ini', '', f)
                datasets.append(f)

        return sorted(datasets, key=str.lower)

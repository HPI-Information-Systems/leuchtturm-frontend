"""The blueprint for the /api prefix and relevant methods are defined here.

Logic for e.g. search requests, retrieval of files etc. goes here.
"""

import configparser
from pathlib import Path
from os import environ as env

if 'DATASET' not in env:
    dataset = 'enron'
else:
    dataset = env['DATASET']

config_path = Path('.').parent / 'config' / 'config-' + dataset + '.ini'
config = configparser.ConfigParser()
config.read(config_path)
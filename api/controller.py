"""Defines common controller behavior."""

from flask import request


class Controller:
    """Defines common controller behavior."""

    @staticmethod
    def get_arg(arg_key, arg_type=str, default=None, required=True):
        arg = request.args.get(arg_key, type=arg_type, default=default)
        print(arg_key + str(arg))
        if required and (arg is None):
            raise SyntaxError("Please provide an argument '" + arg_key + "'")
        return arg

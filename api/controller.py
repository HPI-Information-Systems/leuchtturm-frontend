"""Defines common controller behavior."""

from flask import request


class Controller:
    """Defines common controller behavior."""

    @staticmethod
    def get_arg(arg_key, arg_type=str, default=None, required=True):
        arg = request.args.get(arg_key, type=arg_type, default=default)

        if required and (arg is None):
            raise SyntaxError("Please provide an argument '" + arg_key + "'")

        return arg

    @staticmethod
    def get_arg_list(arg_key, default=None, required=True):
        args = request.args.getlist(arg_key, type=None)
        if not args:
            args = default
        if required and (args is None):
            raise SyntaxError("Please provide an argument '" + arg_key + "'")

        # remove spaces added to last list element by getlist
        args[-1] = args[-1].strip()

        return args

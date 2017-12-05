class Ping:
    def ping(count):
        if count == 1:
            response = "pong"
        else:
            response = ["pong"] * count
        return str(response)
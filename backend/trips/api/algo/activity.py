import json

class Activity:
    def __init__(self, data):
        self.data = data

    def toJson(self):
        return json.dumps(self, default=lambda o: o.data)

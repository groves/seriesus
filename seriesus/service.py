from datetime import datetime
from django.utils import simplejson as json
from google.appengine.ext import webapp

from model import Series, Value

class HandledError(Exception):
    pass

class JsonHandler(webapp.RequestHandler):
    def require(self, param):
        val = self.request.get(param)
        if not val:
            self.fail("%s must be given" % param)
        return val

    def fail(self, reason):
        self.response.out.write(json.dumps({"success":False, "reason":reason}))
        raise HandledError

    def post(self):
        try:
            data = self.json()
            data["success"] = True
            self.response.out.write(json.dumps(data)) 
        except HandledError:
            pass # Something blew up and we already told the client about it

class AddSeries(JsonHandler):
    def extract(self, name, data):
        try:
            return data[name]
        except KeyError:
            self.fail("Expected '%s' in json posted" % name)

    def json(self):
        param = self.require("series")
        try:
            data = json.loads(param)
        except ValueError, e:
            self.fail("Malformed json: %s" % e)
        # Prefix the UUID from the client with k as it may start with a number
        series = Series(name=self.extract("name", data), key_name="k" + self.extract("id", data))
        series.put()
        for value in data.get('values', []):
            val = Value(time=datetime.fromtimestamp(self.extract("time", value)/1000.0),
                    value=self.extract("value", value), series=series, parent=series,
                    key_name="k" + self.extract("id", value))
            val.put()
        return {} # Superclass will indicate success

urls = [('/series/add', AddSeries)]


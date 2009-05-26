from datetime import datetime
from django.utils import simplejson as json
from google.appengine.ext import webapp
from google.appengine.ext.db import Key

from model import Series, Value

class HandledError(Exception):
    pass

class JsonHandler(webapp.RequestHandler):
    def require(self, param):
        val = self.request.get(param)
        if not val:
            self.fail("%s must be given" % param)
        return val

    def extract(self, name, data):
        try:
            return data[name]
        except KeyError:
            self.fail("Expected '%s' in json posted" % name)

    def fail(self, reason):
        self.response.out.write(json.dumps({"success":False, "reason":reason}))
        raise HandledError

    def handle(self):
        try:
            data = self.json()
            data["success"] = True
            self.response.out.write(json.dumps(data)) 
        except HandledError:
            pass # Something blew up and we already told the client about it

class JsonPoster(JsonHandler):
    def post(self):
        self.handle()

class JsonGetter(JsonHandler):
    def get(self):
        self.handle()

def createValue(value, series, time, id=None):
    if id:
        val = Value(time=time, value=value, series=series, parent=series, key_name='k' + id)
    else:
        val = Value(time=time, value=value, series=series, parent=series)
    val.put()
    return val

class AddSeries(JsonPoster):
    def json(self):
        # Prefix the UUID from the client with k as it may start with a number
        name = self.require("name")
        id = self.request.get("id")
        if id:
            series = Series(name=name, key_name="k" + id)
        else:
            series = Series(name=name)
        series.put()
        for value in json.loads(self.request.get('values', '[]')):
            time = datetime.fromtimestamp(self.extract("time", value)/1000.0)
            createValue(self.extract("value", value), series, time, value.get("id", None))
        return {"series": series.jsonify()}

class AddValue(JsonPoster):
    def json(self):
        series = Series.get(Key(self.require('seriesKey')))
        return {"value":
                createValue(float(self.require("value")), series, datetime.utcnow()).jsonify()}

class DeleteSeries(JsonPoster):
    def json(self):
        Series.get(Key(self.require("key"))).delete()
        return {}

class ListSeries(JsonGetter):
    def json(self):
        return {"series": [series.jsonify() for series in Series.all()]}

urls = [('/series/add', AddSeries), ('/series', ListSeries), ('/series/delete', DeleteSeries),
        ('/value/add', AddValue)]


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
            if 'id' in value:
                val = Value(time=time, value=self.extract("value", value), series=series,
                        parent=series, key_name="k" + value['id'])
            else:
                val = Value(time=time, value=self.extract("value", value), series=series,
                        parent=series)
            val.put()
        # Superclass will indicate success
        return {"series": series.jsonify()}

class ListSeries(webapp.RequestHandler):
    def get(self):
        self.response.out.write(json.dumps({"series":
            [series.jsonify() for series in Series.all()]}))


urls = [('/series/add', AddSeries), ('/series', ListSeries)]


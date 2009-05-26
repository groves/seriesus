from django.utils import simplejson as json
from google.appengine.ext.db import Key

from nose.tools import eq_
from webtest import TestApp

from seriesus import application, service
from seriesus.model import Value, Series

import os

os.environ['USER_EMAIL'] = "test@blah.com"

class TestService:
    def setUp(self):
        self.app = TestApp(application)

    def testAddSeriesNoData(self):
        response = self.app.post('/series/add')
        response.mustcontain("false", "name must be given")

    def testAddEmptySeries(self):
        response = self.app.post('/series/add', {"name":"test", "id":"1234"})
        response.mustcontain("success", "true")
        series = Series.all().filter("name = ", "test").get()
        eq_('k1234', series.key().id_or_name())

    def testAutokeySeries(self):
        response = self.app.post('/series/add', {"name":"test"})
        response.mustcontain("success", "true")
        returnedSeries = json.loads(response.body)['series']
        series = Series.get(Key(returnedSeries["key"]))
        eq_("test", series.name)

    def testAddSingleValueSeries(self):
        response = self.app.post('/series/add', {"name":"test", "id":"1234",
            "values":json.dumps([{"time":1234, "value":1.0, "id":"5678"}])})
        response.mustcontain("success", "true")
        series = Series.all().filter("name = ", "test").get()
        vals = list(series.values)
        eq_(1, len(vals))
        eq_(1.0, vals[0].value)
        eq_('k5678', vals[0].key().id_or_name())

    def testAddSeriesWithMalformedJson(self):
        response = self.app.post('/series/add', {'series': '{"name":"test"'})
        response.mustcontain('"success": false')

    def testAddSeriesWithMalformedValue(self):
        response = self.app.post('/series/add', {'series': json.dumps({"name":"test", "id":"1234",
            "values":[{"time":1234, "id":"5678"}]})})
        response.mustcontain("false")

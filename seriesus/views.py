import os
from django.utils import simplejson as json
from google.appengine.ext.webapp import template, RequestHandler

from jslibs import jslibs

from model import Series

template_dir = os.path.join(os.path.dirname(__file__), '../templates/')

class Index(RequestHandler):
    def get(self):
        if not self.request.get("debugjs"):
            libs = ["all.min.js"]
        else:
            libs = jslibs
        series = json.dumps([series.jsonify() for series in Series.all()])
        self.response.out.write(template.render("%s/index.html" % template_dir, {"jslibs":libs,
            "series":series}))

urls = [('/', Index)]

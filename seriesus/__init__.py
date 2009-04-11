import wsgiref.handlers

from google.appengine.ext import webapp
import service

application = webapp.WSGIApplication(service.urls, debug=True)

if __name__ == '__main__':
    wsgiref.handlers.CGIHandler().run(application)

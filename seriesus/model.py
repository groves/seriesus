from google.appengine.ext import db

class Series(db.Model):
    creator = db.UserProperty(required=True, auto_current_user_add=True)
    name = db.StringProperty(required=True)

    def jsonify(self):
        return {"name":self.name, "key": str(self.key())}

class Value(db.Model):
    creator = db.UserProperty(required=True, auto_current_user_add=True)
    time = db.DateTimeProperty(required=True)
    value = db.FloatProperty(required=True)
    series = db.ReferenceProperty(Series, required=True, collection_name='values')

    def __str__(self):
        return "Value(creator=%s, time=%s, value=%s)" % (self.creator, self.time, self.value)

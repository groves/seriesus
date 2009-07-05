jslibs = ["lib/jquery.js", "lib/jquery.example.js", "lib/jquery.flot.js", "lib/jquery.form.js",
        "lib/date.format.js", "lib/Math.uuid.js", "gibs.js", "jquery.cb.js", "jquery.template.js",
        "live.js", "seriesus.js"]

if __name__ == '__main__':
    for lib in jslibs:
        print 'static/js/%s' % lib,

/**
 * Functions to store keys and values in the document fragment and get them back out.  
 */
var gibs = {
        /**
         * Updates the value for key in the document hash.  If value is null, the key is
         * removed from the fragment if it's present.  If the value is identical to the
         * current one, the hash is unchanged.  Values are stored in the hash using their
         * String representation.
         *
         * If clear is given and true, the hash is cleared before processing the key and value.
         */
        update : function(key, value, clear) {
            var cur = gibs.parse();
            if (clear) {
                cur = {};
            }
            if (value == null) {
                if (!(key in cur)) {
                    return;
                }
                delete cur[key];
            } else {
                if (key in cur && cur[key] == value) {
                    return;
                }
                cur[key] = value;
            }
            var pieces = [];
            $.each(cur, function(key, val) {
                pieces.push(key + '=' + val);
            });
            document.location.hash = pieces.join(";");
        },

        /**
         * Returns an Object containing key to value mappings for the fragment in the hash.  To
         * extract the values from the strings in the hash, first Number is called on the
         * String to parse it, otherwise the String is returned directly.
         */
        parse: function() {
            if (document.location.hash.length < 2) {
                return {};
            }
            var assignments = document.location.hash.substring(1).split(';');
            var parsed = {};
            for (var i = 0; i < assignments.length; i++) {
                var pieces = assignments[i].split('=');
                if (pieces.length != 2) {
                    if (window.console) {
                        console.log("Invalid assignment", pieces);
                    }
                    return;
                }
                var elements = pieces[1].split(',');
                var value;
                if (elements.length == 1) {
                    value = gibs.parseValue(elements[0]);
                } else {
                    value = [];
                    for (i in elements) {
                        value.push(gibs.parseValue(elements[i]));
                    }
                }
                parsed[pieces[0]] = value;
            }
            return parsed;
        },

        parseValue: function(val) {
            var parsed = Number(val);
            if (!isNaN(parsed)) {
                return parsed;
            }
            return val;
        },

        /**
         * Returns the value of key in the hash fragment as inserted by update, or null if the
         * key isn't in the fragment
         */
        get: function(key) {
            var frag = gibs.parse();
            if (key in frag) {
                return frag[key];
            }
            return null;
        }
};

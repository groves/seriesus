var seriesus = function() {
    function noop() {
    }

    function logError(message) {
        return function(transaction, error) {
            console.log(message, error);
        };
    }

    function displaySeries(name, key) {
        $("#series_title").show();
        $("#series").append('<li id="' + key + '"><h4>' + name + '</h4><ul>' +
                            '<form class="add_value" action="/value/add" method="post" class="span-16 last">' +
                            '<label for="value">Value</label>' +
                            '<input type="text" name="value" />' +
                            '<input type="submit" value="Add" />' +
                            '</form></ul></li>');
    }

    var db = openDatabase("seriesus", "1.0", "Seriesus Database", 65536);

    db.transaction(function(transaction) {
        transaction.executeSql(
                "CREATE TABLE IF NOT EXISTS Series(name VARCHAR(500), creator VARCHAR(500), __synced INTEGER, " +
                "__key VARCHAR(500));", [], noop, logError("Error creating Series"));
        transaction.executeSql(
                "CREATE TABLE IF NOT EXISTS Value(time INTEGER, creator VARCHAR(500), value FLOAT, " +
                "series INTEGER CONSTRAINT fk REFERENCES Series(_ROWID_), __synced INTEGER, __key VARCHAR(500));",
                [], noop, logError("Error creating Value"));
    });
    $(function() {
        $("#series_title").hide();
        $("#add_series").submit(function() {
            var name = $("#name").attr("value");
            var key = Math.uuid();
            db.transaction(function(transaction) {
                transaction.executeSql("INSERT INTO Series values(?, ?, ?, ?);", [name, "testuser", 0, key],
                        function(transaction, results) {
                            console.log("Inserted series", results);
                        }, logError("Unable to insert series"));
            });
            displaySeries(name, key);
            return false;
        });
        db.transaction(function(transaction) {
            transaction.executeSql("SELECT * from Series;", [], function(transaction, results) {
                var rows = results.rows;
                for (var i = 0; i < rows.length; i++) {
                    displaySeries(rows.item(i).name, rows.item(i).__key);
                }
            }, logError("Unable to select series"))
        });
    });
    return {db:db};
}();
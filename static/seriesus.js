function logError(message) {
    return function(transaction, error) {
        console.log(message, error);
    };
}

function displayValue(time, value, series, key) {
    $("#" + series + " ul form").before('<li id="' + key + '">' + new Date(time) + " - " + value + "</li>");

}

function displaySeries(name, key) {
    $("#series_title").show();
    $("#series").append('<li id="' + key + '"><h4>' + name + '</h4><ul>' +
                        '<form class="add_value" action="/value/add" method="post" class="span-16 last">' +
                        '<label for="value">Value</label>' +
                        '<input type="text" name="value" />' +
                        '<input type="submit" value="Add" />' +
                        '</form></ul></li>');

    db.transaction(function(transaction) {
        transaction.executeSql("SELECT * from Value WHERE series = ? ORDER BY time;", [key],
                function(transaction, results) {
                    var rows = results.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var value = rows.item(i);
                        displayValue(value.time, value.value, value.series, value.__key);
                    }
                }, logError("Unable to select series"))
    });
    $("#series form:last").submit(function() {
        var value = new Number($(this).find("[name=value]").attr("value"));
        var time = new Date().getTime();
        displayValue(time, value, key, insert("Value", [time, "testemail", value, key]));
        return false;
    });
}

var db = openDatabase("seriesus", "1.0", "Seriesus Database", 65536);

function createTable(tableName, columns) {
    db.transaction(function(transaction) {
        var sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(" + columns + ", __synced INTEGER, " +
                  "__key VARCHAR(500));";
        transaction.executeSql(sql, [], function() {
        }, logError("Error creating " + tableName));
    });
}
function insert(tableName, values) {
    var key = Math.uuid();
    db.transaction(function(transaction) {
        values.push(0);// Never synced on insert
        values.push(key);
        var params = [];
        for (var i = 0; i < values.length; i++) {
            params.push("?");
        }
        params.join(", ")
        transaction.executeSql("INSERT INTO " + tableName + " VALUES(" + params + ")", values,
                function(transaction, results) {
                    console.log("Inserted", tableName, results);
                }, logError("Unable to insert series"));
    });
    return key;
}

createTable("Series", "name VARCHAR(500), creator VARCHAR(500)");
createTable("Value", "time INTEGER, creator VARCHAR(500), value FLOAT, " +
                     "series VARCHAR(500) CONSTRAINT fk REFERENCES Series(__key)");

$(function() {
    $("#series_title").hide();
    $("#add_series").submit(function() {
        var name = $("#name").attr("value");
        displaySeries(name, insert("Series", [name, "testuser"]));
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
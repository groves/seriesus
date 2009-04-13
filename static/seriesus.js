function logError(message) {
    return function(transaction, error) {
        console.log(message, error);
    };
}

function displayValue(time, value, series, key) {
    var timeStr = new Date(time).format("HH:MM");
    var html = '<tr id="' + key + '"><td class="value">' + value + '</td><td class="time">' + timeStr +
               '</td><td class="delete"><a class="inactive" href="#delete">x</a></td></tr>';
    $("#" + series + " table tr:last").before(html);

}

function displaySeries(name, key) {
    $("#series").append('<li id="' + key + '"><a class="inactive" href="#' + name + '"><h3>' + name +
                        ' <a class="delete inactive" href="#delete">x</a></h3></a><table>' +
                        '<tr><td><form class="add_value" action="/value/add" method="post">' +
                        '<input type="text" name="value" size="6" />' +
                        '</form></td></tr></table></li>');
    var seriesSelector = "#" + key;
    $(seriesSelector + " .delete").click(function() {
        if($(seriesSelector + "deleter").size() > 0) {
            return false;
        }
        $(seriesSelector + " table").before('<span id="' + key + 'deleter">' +
                                            '<p class="warning">Delete this series?</p>' +
                                            '<a class="ok" href="#">OK</a> ' +
                                            '<a class="cancel" href="#">Cancel</a></span>');
        $(seriesSelector + ' .ok').click(function() {
            db.transaction(function(transaction) {
                transaction.executeSql("DELETE FROM Series WHERE __key = ?", [key], function(transaction, results) {
                    transaction.executeSql("DELETE FROM Value WHERE series = ?", [key], function() {
                    }, logError("Unable to delete values for series " + key));
                    $(seriesSelector).remove();
                    $("#show_all").click();
                }, logError("Unable to delete series " + key));
            });
        });
        $(seriesSelector + " .cancel").click(function() {
            $(seriesSelector + "deleter").remove();
            return false;
        });
        return false;
    });
    $("#" + key + " a").click(function() {
        $("#add_series").hide();
        $("li:not(#" + key + ")").hide();
        $("#show_all").show();
        $(".delete").show();
        $("#show_all").click(function() {
            $("#add_series").show();
            $("li:not(#" + key + ")").show();
            $("#show_all").hide();
            $(".delete").hide();
        });
    });

    db.transaction(function(transaction) {
        transaction.executeSql("SELECT * FROM Value WHERE series = ? ORDER BY time;", [key],
                function(transaction, results) {
                    var rows = results.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var value = rows.item(i);
                        displayValue(value.time, value.value, value.series, value.__key);
                    }
                }, logError("Unable to select series"));
    });
    $("#series form:last").submit(function() {
        var value = parseFloat(($(this).find("[name=value]").attr("value")));
        if (isNaN(value)) {
            // TODO - display error
        } else {
            var time = new Date().getTime();
            displayValue(time, value, key, insert("Value", [time, "testemail", value, key]));
        }
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
        params.join(", ");
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
            if (document.location.hash) {
                $("[href=" + document.location.hash + "]").click();
            }
        }, logError("Unable to select series"));
    });
});
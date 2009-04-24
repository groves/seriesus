// Stubs of functions provided by the browser for the benefit of IntelliJ's analysis

function openDatabase(name, version, description, size) {
    return {transaction:function(callback, errorCallback, successCallback) {
        callback({executeSql:function(sql, arguments, statementCallback, statementErrorCallback) {
        }});
    },
        readTransaction:function(callback, errorCallback, successCallback) {
        },
        version:version,
        changeVersion:function(oldVersion, newVersion, callback, errorCallback, successCallback) {
        }};
}
var console = {log:function() {
}};
var $ = window.$;
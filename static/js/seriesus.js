var seriesus = function () {
    var allSeries = new live.Dict();
    function Series(name, key, values) {
        this.name = name;
        this.key = key;
        this.values = new live.List();
    }
    Series.prototype.addValue = function(valueJson) {
        this.values.push(new Value(valueJson.value, new Date(valueJson.time)));
    }
    function Value(val, time) {
        this.value = val;
        this.time = time;
    }
    Value.prototype.getDisplayTime = function() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.time > today) {
            return this.time.format('h:MM');
        } else {
            return this.time.format('yyyy/m/d h:MM');
        }
    }
    function addSeries(seriesJson) {
        var series = new Series(seriesJson.name, seriesJson.key)
        allSeries.put(seriesJson.key, series);
        $.each(seriesJson.values, function() { series.addValue(this); });
    }
    var contentSwitchListeners = new live.util.ListenerList();
    function setContent(templateSelector, params) {
        params = params || {};
        contentSwitchListeners.fire(templateSelector);
        $('#content').html($(templateSelector).template(params));
    }
    function displaySeries(series) {
        gibs.update("series", series.key);
        setContent('#full_series', {series_name: series.name });
        $('.delete').click(function() {
                $.post('/series/delete', {key: series.key}, displayMultiseries);
            });
    }
    function displayMultiseries() {
        setContent('#multiseries');
        gibs.update("series");// Clear out the selected series

        function displayCompactSeries(key, value) {
            // Add the ul for the series
            var displayed = $('#series').append($('#compact_series').template({
                        series_key: value.key,
                        series_name: value.name})).find('#' + value.key);
            displayed.find(".add_value").ajaxForm({
                    clearForm: true,
                    dataType: 'json',
                    data: {seriesKey: value.key},
                    success: function(response) {
                        allSeries.get(value.key).addValue(response.value);
                    }
                });
            function pushListener(val) {
                displayed.find('table').append($('#compact_value').template({
                            value:val.value,
                            time:val.getDisplayTime()
                        }));
            }
            value.values.addPushListener(pushListener);
            contentSwitchListeners.add(function() {
                    value.values.removePushListener(pushListener);
                    return false;
                });
            displayed.find('.series_name').click(function() { displaySeries(value); });
        }

        allSeries.each(displayCompactSeries);// display all existing series

        allSeries.addPutListener(function(key, value) {// display newly added series
                displayCompactSeries(key, value);
                // Focus input in the newly added series
                $('#' + key + ' .value').focus();
            });

        contentSwitchListeners.add(function () {// stop trying to display new series if we're removed
                allSeries.removePutListener(displayCompactSeries);
                return false;
            });
        $('input.name').example("Name", $('input#name'));
        $('#add_series').ajaxForm({
                clearForm: true,
                dataType: 'json',
                success: function(response) {
                    addSeries(response.series);
                    // Explicitly blur the name field on success to get the example back
                    $('#add_series .name').blur();
                }
            });
    }
    $('.displayMultiseries').live('click', displayMultiseries);
    return {
        init: function() {
            $.get('/series', {}, function(data) {
                    $.each(data.series, function() { addSeries(this); });
                    var selectedSeries = gibs.get("series");
                    if (selectedSeries) {
                        displaySeries(allSeries.get(selectedSeries));
                    } else {
                        displayMultiseries();
                    }
                }, 'json');
        }
    };
}();

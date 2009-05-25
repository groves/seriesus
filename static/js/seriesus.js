var seriesus = function () {
    var allSeries = new live.Dict();
    function Series(name, id) {
        this.name = name;
        this.id = id;
    }
    allSeries.addPutListener(function(key, value) {
            var display = $('#series_template').template({
                    series_id: value.id,
                    series_name: value.name});
            // Add the ul for the series
            $('#series').append(display);
        });
    function addSeries(seriesJson) {
        seriesus.allSeries.put(seriesJson.name,
            new seriesus.Series(seriesJson.name, seriesJson.id));
    }
    return {
        allSeries: allSeries,
        init: function() {
            $('input.name').example("Name", $('input#name'));
            $('#add_series').ajaxForm({
                    clearForm: true,
                    dataType: 'json',
                    data: {id: Math.uuid()},
                    success: function(response) {
                        addSeries(response.series);
                        // Focus input in the newly added series
                        $('#' + response.series.id + ' .value').focus();
                        // Explicitly blur the name field on success to get the example back
                        $('#add_series .name').blur();
                    }
                });
            $.get('/series', {}, function(data) {
                    $.each(data.series, function() { addSeries(this); });
                }, 'json');
        },
        Series: Series
    };
}();

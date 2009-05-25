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
            // Add the ul for the series and move the cursor to its value field
            $('#series').prepend(display).find(".value").focus();
        });
    return {
        allSeries: allSeries,
        init: function() {
            $('input.name').example("Name", $('input#name'));
            $('#add_series').ajaxForm({
                    clearForm: true,
                    dataType: 'json',
                    data: {id: Math.uuid()},
                    success: function(response) {
                        seriesus.allSeries.put(response.series.name,
                            new seriesus.Series(response.series.name, response.series.id));
                    }
                });
        },
        Series: Series
    };
}();

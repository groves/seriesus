var seriesus = function () {
    var allSeries = new live.Dict();
    function Series(name, key) {
        this.name = name;
        this.key = key;
    }
    function addSeries(seriesJson) {
        seriesus.allSeries.put(seriesJson.key,
            new seriesus.Series(seriesJson.name, seriesJson.key));
    }
    function displayFullListing() {
        $('#content').html($('#full_listing').template());
        $('input.name').example("Name", $('input#name'));
        $('#add_series').ajaxForm({
                clearForm: true,
                dataType: 'json',
                success: function(response) {
                    addSeries(response.series);
                    // Focus input in the newly added series
                    $('#' + response.series.key + ' .value').focus();
                    // Explicitly blur the name field on success to get the example back
                    $('#add_series .name').blur();
                }
            });
        $.get('/series', {}, function(data) {
                $.each(data.series, function() { addSeries(this); });
            }, 'json');
    }
    allSeries.addPutListener(function(key, value) {
        var display = $('#compact_series').template({
                series_key: value.key,
                series_name: value.name});
        // Add the ul for the series
        var displayed = $('#series').append(display);
        displayed.find('.series_name').click(function() {
                $('#content').html($('#full_series').template({series_name: value.name }));
            });
        displayed.find('.delete').click(function() {
                $.post('/series/delete', {key: value.key}, displayFullListing);
            });
    });
    $('.displayFullListing').live('click', displayFullListing);
    return {
        allSeries: allSeries,
        displayFullListing: displayFullListing,
        Series: Series
    };
}();

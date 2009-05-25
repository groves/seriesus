var seriesus = function () {
    return {
        addSeries: function(series) {
        },
        init: function() {
            $('input.name').example("Name", $('input#name'));
            $('#add_series').ajaxForm({
                    resetForm: true,
                    dataType: 'json',
                    success: seriesus.addSeries,
                });
        }
    };
}();

/*
cbb function by Roger Johansson, http://www.456bereastreet.com/
Modified to take advantage of jQuery by Charlie Groves
*/
var cbb = {
	init : function() {
		$(".cbb").each(function() {
	        $(this).removeClass("cbb");// Remove the cbb class now that we've found it
		    cbb.transform($(this)); 
		});
    },
    transform: function(el) {
        // wrap the element in a div structure with its classes and id
        el.wrap('<div class="cb"><div class="i1"><div class="i2"></div></div></div>');
        var outerDiv = el.closest(".cb");
        if (el.attr("class") != undefined) {
            outerDiv.attr("class", el.attr("class") + " cb");
        }
        el.attr("class", "i3");
        if (el.attr("id") != undefined) {
            outerDiv.attr("id", el.attr("id"));
            el.attr("id", "");
        }
        outerDiv.prepend('<div class="bt"><div></div></div>');
        outerDiv.append('<div class="bb"><div></div></div>');
    }
};
$(cbb.init);

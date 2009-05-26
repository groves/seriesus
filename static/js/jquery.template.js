/**
 * Simple template function for jQuery modified from
 * http://www.bennadel.com/blog/1393-Creating-jQuery-Templates-Plug-in-Using-Textarea-Elements-Thanks-Kurt-Bonnet-.htm
 *
 * This takes a textarea and converts it into an jQuery DOM elements (outside of the current DOM)
 * and returns it. It takes only one argument: the name-value pairs of the values to replace into
 * the template.
 */
jQuery.fn.template = function(values) {
    // Get the value of the textarea.
    var template = this.val();
 
    // Check to make sure we have a value string. If this is not the right kind of jQuery stack, the
    // HTML string will be null.
    if (!template) {
        throw "Template value isn't a string: " + template;
    }
 
    // Now that we have a proper template, we have to replace the mapped values
    if (values) {
        var safeStrEscaper = new RegExp("([\\[\\]\\.\\+\\*\\{\\}\\(\\)\\$\\?\\-])", "gi");
        $.each(values, function(key, value) { 
            // Escape all the special values in the key so that it can be used in a regexp.
            var safeKey = key.replace(safeStrEscaper, "\\$1");
            // Replace the value.
            template = template.replace(new RegExp("\\{" + safeKey + "\\}", "gi"), value); });
    }

    // At this point, our HTML will have fully replaced values. Now, let's convert it into a jQuery
    // DOM element and return it.
    return jQuery(template);
}


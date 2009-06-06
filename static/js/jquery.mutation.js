jQuery.fn.removed = function (callback, fromDocument) {
    return this.each(function() { $(this).bind("DOMNodeRemovedFromDocument", callback); });
    };

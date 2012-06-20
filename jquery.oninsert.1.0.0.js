/**
 * Project: jQuery "OnInsert" Plugin
 * Author: Derija
 * Date: 18.06.12
 * Time: 15:20
 *
 * Micro-library that adds the new event "onInsert" triggered for every element inserted into the document.
 * May be extended to detect completely new elements, but the way jQuery uses Elements makes it really
 * difficult to find a perfect solution...
 */

(function($){
    if( typeof Node != 'function' ) {
        console.log( '[jQuery.onInsert] I don\'t know what kind of browser you\'re using, but it does not support the Node object?!' );
        return;
    }

    // This will require a lot of performance at the beginning of the page if the page is big,
    // but without it is pretty much impossible to reliably detect completely new elements. So
    // I decided to make it optional...
    $(function(){
        if( $(document).data('insert._noDetectNew') )
            return;

        $('*').each(function( index, elem ) {
            $(elem).data('insert._inDocument', true);
        });
    });

    // For appended nodes...
    Node.prototype.appendChild_old = Node.prototype.appendChild;
    Node.prototype.appendChild = function( target ) {
        var before, after;

        before = $(document).find(target).length > 0;
        Node.prototype.appendChild_old.apply(this, arguments);
        after = $(document).find(target).length > 0;

        triggerEvents(target, before, after);
    };

    // For inserted nodes...
    Node.prototype.insertBefore_old = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function( target ) {
        var before, after;

        before = $(document).find(target).length > 0;
        Node.prototype.insertBefore_old.apply(this, arguments);
        after = $(document).find(target).length > 0;

        triggerEvents(target, before, after);
    };

    /**
     * Trigger events on the element on certain conditions and criteria.
     * @param {Node} elem The element that it is about.
     * @param {Boolean} before Determine whether the element was in the document before insertion.
     * @param {Boolean} after  Determine whether the element is in the document after insertion.
     */
    function triggerEvents( elem, before, after ) {
        console.log( $(elem), before, after );

        // Element wasn't in the doc before but is now! Trigger onInsert event.
        if( !before && after ) {
            // Create the event data based on different criteria.
            var evtData = {};
            if( !$(document).data('insert._noDetectNew') )
                evtData.isNew = !$(elem).data('insert._inDocument');
            var jqEvt = jQuery.Event('insert', evtData);

            $(elem).data('insert._inDocument', true).trigger(jqEvt);
        }
    }
})(window.jQuery);
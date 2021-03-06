//https://cdn.rawgit.com/calipho-sib/feature-viewer/v1.0.0/examples/index.html


(function ($) {

    Drupal.behaviors.tripal_manage_analyses_glyph = {
        attach: function (context, settings) {
            /**
             * JS to add the feature viewer.
             */
            tripal_manage_analyses_feature_viewers(settings.children_draw_info);

            // Remove the jquery.ui override of our link theme:
            $(".ui-widget-content").removeClass('ui-widget-content')

            // Add the anchor to the pager links so that when the user clicks a pager
            // link and the page refreshes they are taken back to the location
            // on the page that they were viewing.
            $("div.tripal_manage_analyses-info-box-desc ul.pager a").each(function () {
                pager_link = $(this);
                parent = pager_link.parents('div.tripal_manage_analyses-info-box-desc');
                pager_link.attr('href', pager_link.attr('href') + '#' + parent.attr('id'));
            })
        }
    };


    /**
     * Initializes the feature viewers on the page.
     */
    function tripal_manage_analyses_feature_viewers(features) {

        var mRNAInfo= [];
        console.log(features)

        var residues = features.residues
        var parameters = features.parameters
        var children = features.children

        if (parameters) {
            var options = parameters
        }
        else {
            var options = {
                showAxis: true,
                showSequence: true,
                brushActive: true,
                toolbar: true,
                bubbleHelp: true,
                zoomMax: 3
            }
        }

        Object.keys(children).forEach(function (key, index) {
            //Each child gets its own feature viewer
            var fv = new FeatureViewer(residues, "#tripal_manage_expression_featureloc_viewer_" + index, options);
            var subFeatures = children[key]

            Object.keys(subFeatures).forEach(function (sfKey, sfIndex) {
                var subFeature = subFeatures[sfKey]
                fv.addFeature(subFeature)

            })
        })

        //  Now add master glyph, if we were passed data

        var subFeatures = features.master
        console.log(features)

        if (subFeatures.length > 0) {
            var fv = new FeatureViewer(residues, "#tripal_manage_expression_featureloc_gene", options);

            Object.keys(subFeatures).forEach(function (sfKey, sfIndex) {
                var subFeature = subFeatures[sfKey]
                fv.addFeature(subFeature)
            })
        }





        // Trigger a window resize event to notify charting modules that
        // the container dimensions has changed

        $(document).on('collapsed', function (e) {
            setTimeout(function () {
                if (typeof Event !== 'undefined') {
                    window.dispatchEvent(new Event('resize'));
                }
                else {
                    // Support IE
                    var event = window.document.createEvent('UIEvents');
                    event.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(event);
                }
            }, 501)
        });


    }
})(jQuery);


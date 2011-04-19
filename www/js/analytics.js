// approach to recording using Google Analytics with JQM adapted from Jon Gales:
// http://www.jongales.com/blog/2011/01/10/google-analytics-and-jquery-mobile/

// optimized GA async snippet adapted from:
// http://mathiasbynens.be/notes/async-analytics-snippet
var _gaq = [['_setAccount', 'UA-22821126-1']];
(function(d, t) {
  var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  g.async = 1;
  g.src = '//www.google-analytics.com/ga.js';
  s.parentNode.insertBefore(g, s);
}(document, 'script'));

// approach to recording using Google Analytics with JQM adapted from:
// http://blog.stickmanventures.com/2011/03/15/basic-google-analytics-with-jquery-mobile-pageshow/

var defaultUrl = "#facilities.html";

$('[data-role=page]').live('pageshow', function (event, ui) {
  try {
      if (location.hash)
        url = location.hash;
      else 
        url = defaultUrl;
      
      Utils.log("[ANALYTICS](#" + event.currentTarget.id + ") url: " + url);
      _gaq.push( ['_trackPageview', url] );
      
  } catch(err) {
    Utils.log("[ERROR] While logging analytics: " + err);
  }
});
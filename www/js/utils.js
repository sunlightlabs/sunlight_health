Utils = {
  
  // internal cache of last loaded URL, to protect against JQM's redundant reloading
  currentUrl: null,
  
  // if running in Android, the command to see log messages in a terminal is:
  // adb logcat PhoneGapLog:V *:S
  // or when running in the web browser:
  // adb logcat browser:V *:S
  log: function(msg) {
    console.log("Utils.log:\n" + msg);
  },
  
  // depends on jQuery and JQM being loaded, will run a function on page load
  show: function (page, callback) {
    $("#" + page).live("pageshow", function(event, ui) {
      
      var url = $.mobile.urlHistory.stack[$.mobile.urlHistory.activeIndex].url;
      if (Utils.currentUrl == url)
        return;
      
      // cache current URL
      Utils.currentUrl = url;
      
      if ($.mobile.urlHistory.getNext())
        Utils.log("[BACK](#" + page + ")");
      else {
        Utils.log("[LOAD](#" + page + ")");
        
        // log a hit in Google Analytics
        Utils.hit(event, ui);
      
        callback();
      }
      
    });
  },
  
  // adapted from http://stackoverflow.com/questions/901115/get-querystring-values-with-jquery
  param: function (name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  },
  
  orderedEach: function(object, callback) {
    var keys = [];
    $.each(object, function(key, value) {
      keys[keys.length] = key;
    });
    
    keys = keys.sort();
    
    $.each(keys, function(i, key) {
      callback(key, object[key]);
    });
  },
  
  loadList: function(name, array, assemble, options) {
    if (!options) options = {};
    
    if (array.length > 0) {
      var list = $(".list." + name);
      list.html("");
      $(".loading." + name).hide();
      
      var divider;
      
      for (var i=0; i<array.length; i++) {
        var curr = array[i][options.divider];
        if (options.divider && (curr != divider)) {;
          list.append(
            "<li data-role=\"list-divider\">" +
              curr +
            "</li>");
          divider = curr;
        }
        
        list.append("<li>" + assemble(array[i]) + "</li>");
      }
      
      list.listview("refresh");
    } else
      $(".empty." + name).html(options.empty || "No results found.");
      
  },
  
  loading: function(done) {
    if (done) {
      if (navigator.notification && navigator.notification.activityStop) 
        navigator.notification.activityStop();
      else
        $.mobile.pageLoading(true);
    } else {
      if (navigator.notification && navigator.notification.activityStart) 
        navigator.notification.activityStart();
      else
        $.mobile.pageLoading();
    }
  },
  
  // on iOS, show the loading spinner, but don't throw up a giant dialog in any other context
  bgLoading: function(done) {
    if (done && navigator.notification && navigator.notification.activityStop) 
      navigator.notification.activityStop();
    else if (!done && navigator.notification && navigator.notification.activityStart) 
        navigator.notification.activityStart();
  },
  
  popup: function(title, message) {
    var dialog = '<div data-role="dialog" data-url="dialog" class="page" id="dialog">' +
      '<div data-role="header" data-backbtn="false">' +
        '<h1>' + title + '</h1>' +
      '</div>' +
      '<div data-role="content">' +
        '<p class="message">' + message + '</p>' +
        '<a href="index.html" data-role="button" data-rel="back">Close</a>' +
      '</div>' +
    '</div>';
    $.mobile.pageContainer.append(dialog);
    //TODO: Add an event handler to get rid of the dialog from the DOM tree entirely
    // $("#dialog").live("pagehide", function() {
      
    
    $.mobile.changePage("#dialog", "pop");
    
  },
  
  // get location and feed the lat/lng to a callback,
  // and in case of error, use some predefined popups
  location: function(success) {
    Utils.log("Locating user...");
    navigator.geolocation.getCurrentPosition(
      function(point) {
        Utils.log("Located user at " + point.coords.latitude + "," + point.coords.longitude);
        
        success(point.coords.latitude, point.coords.longitude);
      },
      function(error) {
        Utils.log("Error " + error.code + ": " + error.message);
        
        // from phonegap's JS:
        //   PositionError.PERMISSION_DENIED = 1;
        //   PositionError.POSITION_UNAVAILABLE = 2;
        //   PositionError.TIMEOUT = 3;
        
        if (error.code == 1)
          Utils.popup("Your Location", "You'll need to enable sharing of your location on your phone first.");
        else if (error.code == 2)
          Utils.popup("Your Location", "We couldn't locate you right now. Try again later or in a different place, or search by zip code.");
        else
          Utils.popup("Your Location", "There was an error while finding your location.");
      }
    );
  },
  
  address: function(object, options) {
    var addr = object.address;
    
    if (options && options.line_break)
      addr += "<br/>";
    else
      addr += ", ";
    
    addr += object.city + ", " + object.state + " " + object.zip;
    
    return addr;
  },
  
  directions: function(address) {
    return "http://maps.google.com/maps?" + $.param({daddr: address})
  },
  
  phone: function(string) {
    var digits = string.replace(/[^\d]/g, '').replace(/^1/, ''); // remove optional starting 1
    return "(" + digits.substr(0,3) + ") " + digits.substr(3,3) + "-" + digits.substr(6,4);
  },
  
  chemicalItem: function(chemical) {
    var q = $.param({
      name: chemical.name,
      drug_class: chemical.drug_class,
      subdivision: chemical.subdivision
    });
    
    return "" +
      "<a href=\"drug_chemical.html?" + q + "\">" +
        "<h3>" + 
          chemical.name + 
        "</h3>" +
        "<p>" +
          chemical.drug_names.join(", ") +
        "</p>" +
      "</a>";
  },
  
  hit: function(event, ui) {
    var defaultUrl = "#facilities.html";
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
  },
  
  radiusFor: function(radius) {
    return {
      small: 5,
      medium: 25,
      large: 100
    }[radius];
  }
};


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


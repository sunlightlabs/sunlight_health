Utils = {
  
  // if running in Android, the command to see log messages in a terminal is:
  // adb logcat PhoneGapLog:V *:S
  log: function(msg) {
    console.log(msg);
  },
  
  // depends on jQuery and JQM being loaded, will run a function on page load
  show: function (page, callback) {
    $("#" + page).live("pageshow", function(event, ui) {
      window.ui = ui;
      Utils.log("[LOAD](" + page + ")");
      callback();
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
    navigator.geolocation.getCurrentPosition(
      function(point) {
        Utils.loading(true);
        Utils.log("Located user at " + point.coords.latitude + "," + point.coords.longitude);
        
        success(point.coords.latitude, point.coords.longitude);
      },
      function(error) {
        Utils.loading(true);
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
  }
};
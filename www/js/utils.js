Utils = {
  
  // internal cache of last loaded URL, to protect against JQM's redundant reloading
  currentUrl: null,
  
  hit: function(event, ui) {
    var defaultUrl = "/index";
    try {
      if (location.hash)
        url = "/" + location.hash.replace(/^#/, '').replace(/\?.*?$/, '').replace(".html", '');
      else 
        url = defaultUrl;
      
      var urchinUrl = gaTrack("UA-22821126-1", "health.sunlightlabs.com", url);
      Utils.log("[ANALYTICS](#" + event.currentTarget.id + ") url: " + url);
      // Utils.log("GA GIF URL: " + urchinUrl);
      
    } catch(err) {
      Utils.log("[ERROR] While logging analytics: " + err);
    } 
  },
  
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
      
      //TODO: May not be necessary after upgrading to Beta 1, investigate
      // final safeguard in case there is somehow a way to get to index.html#index.html
      if (window.location.hash == "#index.html")
        window.location = "index.html";
      
      // in case this function gets called twice, there's a redundant reload bug
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
  
  orderedEach: function(object, callback, reverse) {
    var keys = [];
    $.each(object, function(key, value) {
      keys[keys.length] = key;
    });
    
    keys = keys.sort();
    
    if (reverse)
      keys.reverse();
    
    $.each(keys, function(i, key) {
      callback(key, object[key]);
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
      return Utils.uncleanParam(decodeURIComponent(results[1].replace(/\+/g, " ")));
  },
  
  // swaps out particular chars that screw up JQM's navigation
  cleanParam: function(string) {
    return string.replace('\'','%27').replace('(','%28').replace(')','%29');
  },
  
  // undoes the cleaning process
  uncleanParam: function(string) {
    return string.replace('%27','\'').replace('%28','(').replace('%29',')');
  },
  
  // runs each string inside of an object through cleaning (shallow, meant for JQM data nav objects)
  cleanedData: function(object) {
    var cleaned = {};
    $.each(object, function(key, value) {
      if (typeof(value) == "string")
        cleaned[key] = Utils.cleanParam(value);
      else
        cleaned[key] = value;
    });
    
    return cleaned;
  },
  
  // cleans up the strings in an object, returns a query string for it
  queryString: function(object) {
    return $.param(Utils.cleanedData(object));
  },
  
  loadList: function(name, array, options) {
    
    if (array.length > 0) {
      var list = $(".list." + name);
      
      if (options.clear)
        list.html("");
      
      var divider;
      
      for (var i=0; i<array.length; i++) {
        var curr = array[i][options.divider];
        if (options.divider && (curr != divider)) {
          list.append(
            "<li data-role=\"list-divider\">" +
              curr +
            "</li>");
          divider = curr;
        }
        
        list.append("<li>" + options.assemble(array[i]) + "</li>");
      }
      
      list.listview("refresh");
    } else
      $(".empty." + name).show();
      
  },
  
  popup: function(message) {
    var elem = document.createElement('div');
    elem.className = "toast";
    elem.innerHTML = "<div class=\"toast-text\">" + message + "</div>";
    
    var page = $.mobile.activePage.get(0);
    
    page.appendChild(elem);
    
    setTimeout(function() {
      page.removeChild(elem);
    }, 2000);
  },
  
  // get location and feed the lat/lng to a callback,
  // and in case of error, use some predefined popups
  location: function(success) {
    Utils.log("Locating user...");
    Utils.popup("Finding your location...");
    
    var still = setTimeout(function() {
      Utils.popup("Still locating you...")
    }, 5000);
    
    navigator.geolocation.getCurrentPosition(
      function(point) {
        clearTimeout(still);
        Utils.log("Located user at " + point.coords.latitude + "," + point.coords.longitude);
        
        success(point.coords.latitude, point.coords.longitude);
      },
      function(error) {
        clearTimeout(still);
        Utils.log("Error " + error.code + ": " + error.message);
        
        // from phonegap's JS:
        //   PositionError.PERMISSION_DENIED = 1;
        //   PositionError.POSITION_UNAVAILABLE = 2;
        //   PositionError.TIMEOUT = 3;
        
        if (error.code == 1)
          Utils.popup("You'll need to enable sharing of your location on your phone first.");
        else if (error.code == 2)
          Utils.popup("We couldn't locate you right now. Try again later or in a different place, or search by zip code.");
        else
          Utils.popup("There was an error while finding your location.");
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
    var q = Utils.queryString({
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
  
  radiusFor: function(radius) {
    return {
      small: 5,
      medium: 25,
      large: 100
    }[radius];
  }
};
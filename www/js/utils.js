Utils = {
  
  // if running in Android, the command to see log messages in a terminal is:
  // adb logcat PhoneGapLog:V *:S
  log: function(msg) {
    console.log(msg);
  },
  
  // depends on jQuery and JQM being loaded, will run a function on page load
  show: function (page, callback) {
    $("#" + page).live("pageshow", callback);
  },
  
  // adapted from http://stackoverflow.com/questions/901115/get-querystring-values-with-jquery
  param: function (name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  },
  
  loadList: function(name, array, assemble, empty) {
    if (array.length > 0) {
      $(".loading." + name).hide();
      
      for (var i=0; i<array.length; i++)
        $(".list." + name).append("<li>" + assemble(array[i]) + "</li>");
      
      $(".list." + name).listview("refresh");
    } else
      $(".empty." + name).html(empty || "No results found.");
      
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
  }

};
Utils = {
  
  // if running in Android, the command to see log messages in a terminal is:
  // adb logcat PhoneGapLog:V *:S
  log: function(msg) {
    console.log("\n\n" + msg);
  },
  
  // depends on jQuery and JQM being loaded, will run a function on page load
  show: function (selector, callback) {
    $(selector).live("pageshow", callback);
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
  }

};
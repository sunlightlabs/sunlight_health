$(document).bind("mobileinit", function(){
  $.mobile.defaultTransition = 'none';
});

// hide the fact that the user is clicking on an external link
$("#stickey_footer div ul li a[rel=external]").live("click", function() {
  $.mobile.pageLoading();
  return true;
});
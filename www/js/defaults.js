$(document).bind("mobileinit", function(){
  $.mobile.defaultTransition = 'none';
  
  // for Beta 1, if we ever upgrade
  // $.mobile.page.prototype.options.addBackBtn = true;
});

// hide the fact that the user is clicking on an external link
$("#stickey_footer div ul li a[rel=external]").live("click", function() {
  $.mobile.pageLoading();
  return true;
});
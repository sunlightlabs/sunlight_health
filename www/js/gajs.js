/**
 * Google Analytics JS v1
 * http://code.google.com/p/google-analytics-js/
 * Copyright (c) 2009 Remy Sharp remysharp.com / MIT License
 * $Date: 2009-02-25 14:25:01 +0000 (Wed, 25 Feb 2009) $
 */
function gaTrack(urchinCode, domain, url) {
    
  function rand(min, max) {
      return min + Math.floor(Math.random() * (max - min));
  }
    
  var i=1000000000,
      utmn=rand(i,9999999999), //random request number
      cookie=rand(10000000,99999999), //random cookie number
      random=rand(i,2147483647), //number under 2147483647
      today=(new Date()).getTime(),
      win = window.location,
      img = new Image(),
      urchinUrl = 'http://www.google-analytics.com/__utm.gif?utmwv=4&utmn='
          +utmn+'&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn='
          +domain+
          //'&utmr='+win+ // don't send file:// urls to GA, it'll ignore them
          '&utmp='
          +url+'&utmac='
          +urchinCode+
          '&utmcc=__utma%3D'
          +cookie+'.'+random+'.'+today+'.'+today+'.'
          +today+'.2%3B';

  // trigger the tracking
  img.src = urchinUrl;
  return urchinUrl;
}
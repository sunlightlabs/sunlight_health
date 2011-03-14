Utils = {
  
  // if running in Android, the command to see log messages in a terminal is:
  // adb logcat PhoneGapLog:V *:S
  log: function(msg) {
    console.log("\n\n" + msg);
  }
};
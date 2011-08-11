
var GoogleAnalyticsPlugin = function()
{
}

GoogleAnalyticsPlugin.prototype.startTrackerWithAccountID = function(ua_id)
{
    console.log('Starting tracker');
    return PhoneGap.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'GoogleAnalytics', 'startTracker', [ua_id]);

}

GoogleAnalyticsPlugin.prototype.trackPageview = function(page)
{
    return PhoneGap.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'GoogleAnalytics', 'trackPage', [page]);
}

GoogleAnalyticsPlugin.prototype.trackEvent = function(category, action, evtLabel, eventNo)
{
    return PhoneGap.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'GoogleAnalytics', 'trackEvent', [category, action, evtLabel, eventNo]);
}
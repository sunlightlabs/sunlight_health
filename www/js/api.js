var Api = {
  key: null,
  
  get: function(method, params, callback) {
    params = params || {};
    params.apikey = Api.key;
    $.getJSON(Api.url(method), params, function(data) {
      if (data) {
        callback(data[method]);
      }
    });
  },
  
  url: function(method, params) {
    return "http://health.sunlightlabs.com/api/v1/" + method + ".json?per_page=1";
  }
}
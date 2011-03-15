var Api = {
  key: null,
  
  get: function(method, params, callback) {
    params = params || {};
    params.apikey = Api.key;
      
    $.ajax({
      url: Api.url(method), 
      data: params, 
      success: function(data) {
        callback(data[method]);
      },
      dataType: "jsonp"
    });
  },
  
  url: function(method) {
    return "http://health.sunlightlabs.com/api/v1/" + method + ".json";
  },
  
  Supplier: {
    search: function(lat, lng, callback) {
      Api.get("suppliers", {location: lat + "," + lng}, callback);
    }
  }
}
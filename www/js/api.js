var Api = {
  key: null,
  
  get: function(method, sections, params, callback) {
    params = params || {};
    params.apikey = Api.key;
    
    if (sections && sections.length > 0)
      params.sections = sections.join(",");
      
    $.ajax({
      url: Api.url(method), 
      data: params, 
      success: function(data) {
        callback(data[method]);
      },
      dataType: "jsonp"
    });
  },
  
  getOne: function(method, sections, params, callback) {
    Api.get(method, sections, params, function(results) {
      if (results && results.length > 0)
        callback(results[0]);
      else
        callback(null);
    });
  },
  
  url: function(method) {
    return "http://health.sunlightlabs.com/api/v1/" + method + ".json";
  },
  
  Supplier: {
    // returns all suppliers by a given location search
    search: function(lat, lng, callback) {
      Api.get("suppliers", ["basic", "row"], {
        location: lat + "," + lng
        // , sections: "basic"
      }, callback);
    },
    
    find: function(row, callback) {
      Api.getOne("suppliers", [], {row: row}, callback);
    }
  }
}
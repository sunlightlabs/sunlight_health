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
      dataType: "jsonp" //TODO: Turn this off (to regular JSON) when on a device
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
      Api.getOne("suppliers", ["basic", "row"], {row: row}, callback);
    }
  },
  
  Drug: {
    // returns all drugs by a given query string
    terms: function(query, callback) {
      Api.get("drug_terms", [], {term__start: query}, callback);
    },
    
    class: function(drug_class, callback) {
      Api.get("drug_chemicals", [], {drug_class: drug_class, order: "drug_class", sort: "asc"}, callback);
    },
    
    chemical: function(chemical, drug_class, subdivision, callback) {
      Api.getOne("drug_chemicals", [], {
        name: chemical,
        drug_class: drug_class,
        subdivision: subdivision
      }, callback);
    }
  }
}
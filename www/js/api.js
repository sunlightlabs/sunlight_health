var Api = {
  key: null,
  host: "health.sunlightlabs.com/api/v1",
  
  get: function(method, sections, params, callback) {
    params = params || {};
    params.apikey = Api.key;
    
    if (sections && sections.length > 0)
      params.sections = sections.join(",");
      
    Utils.log("[" + method + "](" + params.sections + ") sending request");
    $.ajax({
      url: Api.url(method), 
      data: params, 
      success: function(data) {
        Utils.log("Response received, sending " + (data[method] ? data[method].length : "null") + " results into callback.");
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
    return "http://" + Api.host + "/" + method + ".json";
  },
  
  Facility: {
    // returns all suppliers by a given location search
    searchNearby: function(lat, lng, params, callback) {
      Api.get("facilities", 
              ["basic"], 
              $.extend({location: lat + "," + lng}, params), 
              callback);
    },
    
    searchZip: function(zip, params, callback) {
      Api.get("facilities", 
              ["basic"], 
              $.extend({location: zip}, params),
              callback);
    },
    
    find: function(provider_number, facility_type, sections, callback) {
      Api.getOne("facilities", 
                 sections, 
                 {
                  provider_number: provider_number, 
                  facility_type: facility_type
                 }, 
                 callback);
    },
  },
  
  Supplier: {
    // returns all suppliers by a given location search
    searchNearby: function(supply, lat, lng, callback) {
      var params = {location: lat + "," + lng};
      params["supplies." + supply] = true;
      Api.get("suppliers", ["basic", "row"], params, callback);
    },
    
    searchZip: function(supply, zip, callback) {
      var params = {location: zip};
      params["supplies." + supply] = true;
      Api.get("suppliers", ["basic", "row"], params, callback);
    },
    
    find: function(row, sections, callback) {
      Api.getOne("suppliers", sections, {row: row}, callback);
    },
    
    terms: function(query, callback) {
      Api.get("supplier_terms", [], {term__start: query}, callback);
    },
  },
  
  Drug: {
    // returns all drugs by a given query string
    terms: function(query, callback) {
      Api.get("drug_terms", [], {term__start: query}, callback);
    },
    
    // all chemicals in a given drug class
    class: function(drug_class, callback) {
      Api.get("drug_chemicals", ["basic"], {drug_class: drug_class, order: "subdivision", sort: "asc"}, callback);
    },
    
    // all chemicals in a given drug class...except for one
    classExcept: function(drug_class, chemical, callback) {
      Api.get("drug_chemicals", ["basic"], {
        drug_class: drug_class, 
        order: "subdivision",
        sort: "asc",
        name__ne: chemical
      }, callback);
    },
    
    // any piece of info about a single chemical
    chemical: function(chemical, drug_class, subdivision, sections, callback) {
      Api.getOne("drug_chemicals", sections, {
        name: chemical,
        drug_class: drug_class,
        subdivision: subdivision
      }, callback);
    }
  }
}
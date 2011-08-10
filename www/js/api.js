var Api = {
  host: "health.sunlightlabs.com/api/v1",
  
  get: function(method, sections, params, callback) {
    params = params || {};
    
    if (sections && sections.length > 0)
      params.sections = sections.join(",");
      
    Utils.log("[" + method + "](" + params.sections + ") sending request");
    return $.ajax({
      url: Api.url(method), 
      data: params, 
      success: function(data, status, xhr) {
        Utils.log("Response received, sending " + (data[method] ? data[method].length : "null") + " results into callback.");
        callback(data[method], data.count, data.page, xhr);
      },
      dataType: "jsonp" //TODO: Turn this off (to regular JSON) when on a device
    });
  },
  
  getOne: function(method, sections, params, callback) {
    return Api.get(method, sections, params, function(results, count, page, xhr) {
      if (results && results.length > 0)
        callback(results[0], count, page, xhr);
      else
        callback(null, count, page, xhr);
    });
  },
  
  url: function(method) {
    return "http://" + Api.host + "/" + method + ".json";
  },
  
  Facility: {
    // returns all suppliers by a given location search
    searchNearby: function(lat, lng, radius, sections, params, callback) {
      return Api.get("facilities", 
              sections, 
              $.extend({location: lat + "," + lng, radius: radius}, params), 
              callback);
    },
    
    searchZip: function(zip, radius, sections, params, callback) {
      return Api.get("facilities", 
              sections, 
              $.extend({location: zip, radius: radius}, params),
              callback);
    },
    
    find: function(provider_number, facility_type, sections, callback) {
      return Api.getOne("facilities", 
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
    searchNearby: function(supply, lat, lng, radius, params, callback) {
      params = $.extend({location: lat + "," + lng, radius: radius}, params);
      params["supplies." + supply] = true;
      return Api.get("suppliers", ["basic", "row"], params, callback);
    },
    
    searchZip: function(supply, zip, radius, params, callback) {
      params = $.extend({location: zip, radius: radius}, params);
      params["supplies." + supply] = true;
      return Api.get("suppliers", ["basic", "row"], params, callback);
    },
    
    find: function(row, sections, callback) {
      return Api.getOne("suppliers", sections, {row: row}, callback);
    },
    
    terms: function(query, callback) {
      return Api.get("supplier_terms", [], {term__word_match: query, order: "term", sort: "asc"}, callback);
    },
  },
  
  Drug: {
    // returns all drugs by a given query string
    terms: function(query, callback) {
      return Api.get("drug_terms", [], {term__start: query, order: "term", sort: "asc"}, callback);
    },
    
    // all chemicals in a given drug class
    drugClass: function(drug_class, callback) {
      return Api.get("drug_chemicals", ["basic"], {drug_class: drug_class, order: "subdivision", sort: "asc"}, callback);
    },
    
    // all chemicals in a given drug class...except for one
    drugClassExcept: function(drug_class, chemical, callback) {
      return Api.get("drug_chemicals", ["basic"], {
        drug_class: drug_class, 
        order: "subdivision",
        sort: "asc",
        name__ne: chemical
      }, callback);
    },
    
    // any piece of info about a single chemical
    chemical: function(chemical, drug_class, subdivision, sections, callback) {
      return Api.getOne("drug_chemicals", sections, {
        name: chemical,
        drug_class: drug_class,
        subdivision: subdivision
      }, callback);
    }
  }
}
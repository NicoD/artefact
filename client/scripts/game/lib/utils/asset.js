define(function() {
    
  "use strict";
  
  /*jslint plusplus:true*/  
    
  var dictionary = {},
  
  AssetDictionary = function() {
  
        this.remove = function(key) {
      dictionary[key] = null;
    };
    
    this.get = function(key) {
      return dictionary[key];
    };
    
    this.add = function(key, url) {
      var bmp = new Image();
      bmp.src = '/assets/' + url;   
      
      dictionary[key] = bmp;      
    }
  },
  
  assetDictionaryInstance = new AssetDictionary();
   
  return {
    getDictionary: function() {
      return assetDictionaryInstance;
    }
  };
});
define(["lib/utils/camera", "tools/module"], function(Camera, Module) {
            
  "use strict";
  
  /*jslint plusplus:true*/   
  
  var CameraModule = function(camera, updateInterval) {
    var observers = {},
    self = this,
    
    updateObservers = function(eventName) {
      if(observers[eventName]) {
        var i, nbEvents = observers[eventName].length;
        for(i=0; i<nbEvents; i++) {
          
          observers[eventName][i](self);
        }
      }
    },
    
    update = function() {   
      updateObservers(Module.EVENT_UPDATE);
    };
    
    
    this.addObserver = function(eventName, callback) {
      if(!observers[eventName]) {
        observers[eventName] = [];
      }
      observers[eventName].push(callback);
    };    
    
    this.getTitle = function() {
      return "camera";
    };
   
    setInterval( update, updateInterval);
    
    this.toString = function() {
      return camera.x + ', ' + camera.y + ' , ' + camera.width + ', ' + camera.height;
    };
  }; 
  
  
  return {
      create: function(camera, updateInterval) {
        return new CameraModule(camera, updateInterval);
      }
  };
});
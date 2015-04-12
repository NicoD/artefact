define(["lib/utils/fps", "tools/module"], function(Fps, Module) {
            
  "use strict";
  
  /*jslint plusplus:true*/   
  
  var FpsModule = function(fps, updateInterval) {
    var observers = {}, 
    nbUpdate = 0,
    lastMetric = new Date().getTime(),
    realFps = 0,
    self = this,
    
    updateObservers = function(eventName) {
      
      if(observers[eventName]) {

        var i, nbEvents = observers[eventName].length;
        for(i=0; i<nbEvents; i++) {
          observers[eventName][i](self);
        }
      }
    };   
    
    this.addObserver = function(eventName, callback) {
      if(!observers[eventName]) {
        observers[eventName] = [];
      }
      observers[eventName].push(callback);
    };    
    
    this.getTitle = function() {
      return "max fps";
    };
   
    this.update = function() {
      
      ++nbUpdate;
      var newMetric = new Date().getTime();
      
      
      if((newMetric - lastMetric) > updateInterval) {
        realFps = Math.ceil((1000 * nbUpdate) / (newMetric - lastMetric));        
        lastMetric = newMetric;
        nbUpdate = 0;
        
        updateObservers(Module.EVENT_UPDATE);
      }
    };
    
    this.toString = function() {
      return realFps + " / " + fps.getMaxFps();
    };
    
    fps.addObserver(Fps.DRAW_EVENT, this.update);
  }; 
  
  
  return {
      create: function(fps, updateInterval) {
        return new FpsModule(fps, updateInterval);
      }
  };
});
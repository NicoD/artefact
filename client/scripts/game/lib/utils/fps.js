define(function() {
    
  "use strict";
  
  /*jslint plusplus:true*/  
  
  var DRAW_EVENT = 'draw',
  
  Fps = function(maxFps) {
    
    var observers = {}, 
        drawInterval = 1000/maxFps-1,
    
    updateObservers = function(eventName) {
      
      if(observers[eventName]) {

        var i, nbEvents = observers[eventName].length;
        for(i=0; i<nbEvents; i++) {
          observers[eventName][i]();
        }
      }
    };

    
    this.lastTimestamp = 0;
    
    this.getMaxFps = function() {
      return maxFps;
    };
    
    this.update = function(newTimestamp) {
      if(!this.lastTimestamp) {
        this.lastTimestamp = newTimestamp;  
        updateObservers(DRAW_EVENT);
      }
      var diffSeconds = newTimestamp - this.lastTimestamp;
        
      if(diffSeconds >= drawInterval) {
        this.lastTimestamp = newTimestamp;          
        updateObservers(DRAW_EVENT);
      }
    };
    
    this.addObserver = function(eventName, callback) {
      if(!observers[eventName]) {
        observers[eventName] = [];
      }
      observers[eventName].push(callback);
    };
  }; 
  
  
  return {
      create: function(maxFps) {
        return new Fps(maxFps);
      },
      DRAW_EVENT: DRAW_EVENT
  };
});
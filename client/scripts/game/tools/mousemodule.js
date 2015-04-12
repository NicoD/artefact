define(["jquery", "tools/module"], function($, Module) {
            
  "use strict";
  
  /*jslint plusplus:true*/   
  
  var MouseModule = function(game, updateInterval) {
    var observers = {},
    self = this,
    currentX,
    currentY,
    currentTile,
    
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
    },
    
    $offset = function(obj) {
      var curtop = 0, curleft = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
          obj = obj.offsetParent;
        } while (obj);
      }
      return {left: curleft,top: curtop};
    },
    
    mouseMove = function(e) {
      var offset = $offset(e.target);
      
      currentX = Math.floor(e.pageX-offset.left); 
      currentY = Math.floor(e.pageY-offset.top);
      currentTile = game.map.getTileAt(currentX, currentY);  
    };
    
    
    this.addObserver = function(eventName, callback) {
      if(!observers[eventName]) {
        observers[eventName] = [];
      }
      observers[eventName].push(callback);
    };    
    
    this.getTitle = function() {
      return "mouse";
    };
    $(window).mousemove(mouseMove);
       
    setInterval(update, updateInterval);
    
    this.toString = function() {
      var s = '';
      if(currentX && currentY) {
        s += currentX + 'px ,' + currentY +'px';
      }
      if(currentTile) {
        s += ' (' + currentTile[0] + ', ' + currentTile[1] + ')';
      }
      return s;
    };
  }; 
  
  
  return {
      create: function(game, updateInterval) {
        return new MouseModule(game, updateInterval);
      }
  };
});
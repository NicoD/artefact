define(function() {
    
  "use strict";
    
  var GameTime = function() {
    
    this.currentTime = 0;
    this.lastTime    = 0;
    
    this.update = function(newTime) {
      this.lastTime = this.currentTime;
      this.currentTime = newTime;
    };

    this.elapsed = function() {
      return this.currentTime - this.lastTime;
    };
  }; 
  
  
  return {
    create: function() {
      return new GameTime();
    } 
  };
});
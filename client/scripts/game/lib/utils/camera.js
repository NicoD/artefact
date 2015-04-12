define(function() {
    
  "use strict";
  
  /*jsLint plusplus:true*/  
  
  var Camera = function(x, y, width, height) {
     this.x = x;
     this.y = y;
     this.width = width;
     this.height = height; 
     
     this.rect = function() {
       return {x: this.x, y: this.y, width: this.width, height: this.height};
     };
  },
  DEFAULT_SPEED = 5, // pixel per frame
  cameraInstance = null;
  
  return {
    get: function() {
      if(!cameraInstance) {
        cameraInstance = new Camera();
      }
      return cameraInstance;
    },
    create: function(x, y, width, height) {
      if(cameraInstance) {
        cameraInstance.x = x;
        cameraInstance.y = y;
        cameraInstance.width = width;
        cameraInstance.height = height;  
      } else {
        cameraInstance = new Camera(x, y, width, height);
      }
    },
    DEFAULT_SPEED: DEFAULT_SPEED
  };
});
define(["entity/map", "controller/default"], function(MapEntity, DefaultController) {
   
  "use strict";
   
  /*jsLint bitwise:true, plusplus:true*/   

  var Artefact = function(network) {
    this.network = network;
    
    this.map = MapEntity.create();
    
    this.update = function(timestamp) {
      this.map.update(timestamp);
    };
    
    this.draw = function(ctx, timestamp) {
      this.map.draw(ctx);
    };
    
    DefaultController.create(this);

  };
 
  return {
    create: function(network) {
      return new Artefact(network);
    }
  };
});

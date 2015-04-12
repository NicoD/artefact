define(["jquery", "tools/module"], function($, Module) {
            
  "use strict";
  
  /*jslint plusplus:true*/   
  
  var DebugPannel = function(div) {

    var modules = [];
    this.registerModule = function(module) {
      var divmodule = $('<div/>');
      modules.push([module, divmodule]);
      divmodule.append('<span>' + module.getTitle() + ': </span>');
      divmodule.append('<span>' + String(module));
      div.append(divmodule);
      module.addObserver(Module.EVENT_UPDATE, this.update);
    };
    
    this.update = function(module) {
      var i, nbModules = modules.length;
      for(i=0; i<nbModules; i++) {
        if(modules[i][0] === module) {
          $('span:last', modules[i][1]).html(String(module));
        }
      }
    };
  }; 
  

  return {
      create: function(div) {
        return new DebugPannel(div);
      }
  };
});
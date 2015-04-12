define(['jquery', 'lib/utils/camera'], function($, Camera) {
            
  "use strict";
  
  /*jsLint plusplus:true*/   
  
  var DefaultController = function(game) {
    var camera = Camera.get(),
    
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

    keyDown = function(e) {
      var prevX = camera.x,
          prevY = camera.y;
                
      switch(e.keyCode) {
        case 37:
          camera.x += Camera.DEFAULT_SPEED;
        break;
          
        case 39:
          camera.x -= Camera.DEFAULT_SPEED;
        break;
        
        case 38:
          camera.y += Camera.DEFAULT_SPEED;
        break;
          
        case 40:
          camera.y -= Camera.DEFAULT_SPEED;  
        break;
        
        case 71:
          game.map.showGrid = !game.map.showGrid;
        break;
      }
      if(game.map.isOutOfBound(camera.rect())) {
        camera.x = prevX;
        camera.y = prevY;
      }
    },
    
    dragging,
    lastX,
    lastY,
    
    mouseDown = function(e) {
      var offset = $offset(e.target);
      
      lastX = Math.floor(e.pageX-offset.left);
      lastY = Math.floor(e.pageY-offset.top);
          
      dragging = true;
      e.stopPropagation();
    },
    
    mouseUp = function(e) {
      dragging = false;
      e.stopPropagation();      
    },
    
    mouseMove = function(e) {
      if(dragging) {
        
        var offset = $offset(e.target),
            x = Math.floor(e.pageX-offset.left), 
            y = Math.floor(e.pageY-offset.top),
            
            deltaX = x - lastX,
            deltaY = y - lastY,
            prevX = camera.x,
            prevY = camera.y;
        
        camera.x += deltaX;
        camera.y += deltaY;        

        if(game.map.isOutOfBound(camera.rect())) {
          camera.x = prevX;
          camera.y = prevY;
        }
        lastX = x;
        lastY = y;  
        e.stopPropagation();
      }
    },
    
    mouseClick = function(e) {
      if(!dragging) {
        var offset = $offset(e.target),
            x = Math.floor(e.pageX-offset.left), 
            y = Math.floor(e.pageY-offset.top),
            
            tile = game.map.getTileAt(x, y);

        game.network.action('dig', {tile: tile});
        e.stopPropagation();
      }
    };
    
    $(window).keydown(keyDown);    
    $(window).mousedown(mouseDown);
    $(window).mouseup(mouseUp);
    $(window).mousemove(mouseMove);
    $(window).click(mouseClick);
  }; 
  
  
  return {
    create: function(game) {
      return new DefaultController(game);
    }
  };
});
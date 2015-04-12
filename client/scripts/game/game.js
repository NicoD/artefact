define(["jquery", "lib/utils/fps", "lib/utils/gametime", "lib/utils/camera"], function($, Fps, GameTime, Camera) {
    
    "use strict";
         
    (function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
    }());

    var Game = function(game) {       
        
      var gameTime = GameTime.create();
      this.camera = null;
      
      this.start = function(fps, canvas) {
        var ctx = canvas[0].getContext('2d'),
        startTimestamp = new Date().getTime(),
        // the fps pbject sends an event when a frame must be rendered
        // the update is done independently, it usually should be done a while(true) loop
        // but in JavaScript, we use the requestAnimationFrame so the update might be called at about the 
        // same rate than the update
        // the requestAnimationFrame is handled by the browser and can for example be lowered if the tab is in background
        // this method would be only efficient if requestAnimationFrame is called at a rate > fps
        animate = function(timestamp) {
          if (timestamp >= 1e12){
            timestamp -= startTimestamp;
          }
          gameTime.update(timestamp);
          fps.update(timestamp);
          game.update(gameTime);
          window.requestAnimationFrame(animate);
        };
        fps.addObserver(Fps.DRAW_EVENT, function() {
          ctx.clearRect(0, 0,  canvas.width(),  canvas.height());          
          game.draw(ctx, fps.lastTimestamp);
        });
        window.requestAnimationFrame(animate);           
        
        Camera.create(0, 0, canvas.width(), canvas.height());
      };
    };
        
    return {
      create: function(game) {
        return new Game(game);
      }
    };
});

define(function($) {
    
    "use strict";

    var getCanvas = function(id, width, height) {
  
      var ctx,
      canvas = document.getElementById(id);
      if(!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.id = id;
        document.body.appendChild(canvas);
      } else {
        if(width) {
          canvas.width = width;
        }
        if(height) {
          canvas.height = height;
        }
      }
  
      return canvas;
  },
    
  transparencyCache = {},
  isTransparent = function(image, percent, threshold, cacheId) {
    var transparent = false,
        nbPixelTransparent = 0, 
        canvas, ctx, imageData, picData, i, n;
        
    // might not be loaded ?
    // TODO fix loading
    if(!image.width) {
      return true;
    }            
    if(cacheId) {
      if(transparencyCache[cacheId] !== undefined) {
        return transparencyCache[cacheId];
      }
    }

    canvas = document.createElement("canvas");
    canvas.width  = image.width;
    canvas.height = image.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    imageData = ctx.getImageData(0,0, image.width, image.height);
    picData = imageData.data;
    for (i = 0, n = picData.length; i < n; i += 4) {
      if (picData[i+3] < threshold) {
        ++nbPixelTransparent;
      }
    }
    transparent = (nbPixelTransparent*100 / n > percent);
    if(cacheId) {
      transparencyCache[cacheId] = transparent;
    }
    
    return transparent;
  }
  
  return {
    getCanvas: getCanvas,
    isTransparent: isTransparent
  };
});


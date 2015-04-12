if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
  
define(function() {
  "use strict";
 
  var Map = function() {
    this.widthT;
    this.heightT;
    this.baHeaderSize;
    
    this.setByteArray = function(byteArray) {
      this.ba             = byteArray;
      this.widthT         = this.ba.readUnsignedInt();
      this.heightT        = this.ba.readUnsignedInt();
      this.baHeaderSize   = this.ba.getPosition();
      
      this.onByteArraySet();
    };
    
    this.onByteArraySet = function() {};
        
    /**
     * move the byte array cursor to the given tile 
     */
    this.toTile = function(x, y) {
      this.ba.to(this.baHeaderSize + 7 * (y * this.widthT + x));
    }
  };

  return {
    create: function(extension) {
      var map = new Map();
      if(extension) {
        for(var k in extension) {
          map[k] = extension[k];
        }
      }
      return map;
    }
  };
});
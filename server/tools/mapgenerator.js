/*global require, process, exports */
'use strict';

(function () {
              
  /*jslint plusplus:true*/   
  
  // map data structure
  // 1-4 => width
  // 5-8 => height
  // 9-.. => tiles
  // tile data structure
  // 1-1 => behavior
  // 2-3 => tile-id layer1
  // 4-5 => tile-id layer2
  // 6-7 => tile-id layer3
  var ByteArray = require('../../common/lib/bytearray'),
    
  MapGenerator = function(width, height) {
    var GRASS_GRID_ID = 1,
        BUSH_GRID_ID  = 2,
        TILE_GRID_ID  = 3,
        STONE_GRID_ID = 4,
        LAVA_GRID_ID = 5;
        
    this.generate = function() {
      var mapba = ByteArray.create(),
          x, y, test;
      
      // the +1 makes not reach the end of the buffer 
      // so it doesn't reallocate a new block
      mapba.allocate(8 + 7*(width*height) + 1);
      
      mapba.writeUnsignedInt(width);
      mapba.writeUnsignedInt(height);          
          
      for(y=0; y<width; ++y) {
        for(x=0; x<height; ++x) {
          mapba.writeUnsignedByte(3);
          mapba.writeUnsignedShort(LAVA_GRID_ID * Math.pow(2, 9) + 3);
          mapba.writeUnsignedShort(GRASS_GRID_ID * Math.pow(2, 9) + 8/*Math.floor((Math.random()*5)+1)*/);
          
          test = Math.random()*30;
          if(test < 1) {
            mapba.writeUnsignedShort(BUSH_GRID_ID * Math.pow(2, 9) + 2);
          } else if(test < 2) {
            mapba.writeUnsignedShort(STONE_GRID_ID * Math.pow(2, 9) + 3);
          } else {
            mapba.writeUnsignedShort(0);
          }
        }
      }
      mapba.reset();
      
      return mapba;
    };
  }; 
  

  exports.create = function(width, height) {
    return new MapGenerator(width, height);
  };

}());
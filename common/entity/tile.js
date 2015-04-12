if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
  
define(function() {
  "use strict";
 
   // id is supposed to be a short
  // java script numbers are stored on 8 bytes
  // bit operation convert numbers to 4 bytes numbers
  // first 7 bit represents the grid id
  // last 9 bit represents the tile id
  var parseRawId = function(id) {    
    return [
      id >> 9, 
      id & 511 // mask for last 9 bits
    ];
  };
  
  return {      
    parseRawId: parseRawId
   };
});
/*global require, process, exports */
'use strict';

(function () {
  
  exports.run = function(game, data, refresh) {
    var map = game.map,
        accessibility,
        TileEntity = require('../../common/entity/tile'),
        layers,
        doRefresh = false,
        stream;
        
    map.toTile(data.tile[0], data.tile[1]);
    accessibility = map.ba.readUnsignedByte();
    layers = [
      TileEntity.parseRawId(map.ba.readUnsignedShort()),
      TileEntity.parseRawId(map.ba.readUnsignedShort()),
      TileEntity.parseRawId(map.ba.readUnsignedShort())
    ];

    for(var i=2; i>=0; i--) {
      if(layers[i][0] !== 0 && i > 0) {
        map.ba.to(map.ba.getPosition() - 2*(3-i));
        map.ba.writeUnsignedShort(0);
        doRefresh = true;
        break;
      }
    }
    if(doRefresh) {
      map.toTile(data.tile[0], data.tile[1]);
          
      stream = require('../../common/lib/bytearray').create();
      stream.allocate(16);
      stream.writeUnsignedByte(require('../../common/entity/type').TILE);
      stream.writeUnsignedInt(data.tile[0]);
      stream.writeUnsignedInt(data.tile[1]);
      stream.writeBytes(map.ba.readBytes(7));
      refresh(stream);
    }
  };
}());
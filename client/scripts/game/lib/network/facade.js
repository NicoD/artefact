define(["socketio", "common/lib/bytearray", "common/entity/type"], function(io, ByteArray, EntityType) {
  "use strict";
  
  function Facade() {
    
    var socket, 
        game,
    
    init = function() {
      socket.on('refresh', function (stream) {
        var ba = ByteArray.create(stream),
            entity;
        while(ba.getPosition() < ba.size()) {
          entity = ba.readUnsignedByte();
          switch(entity) {
            case EntityType.TILE:
              game.map.setTile(ba.readUnsignedInt(), ba.readUnsignedInt(), ba.readBytes(7));
            break;
          }
        }
      });
    };

    this.init = function(gameEntity) {
      game = gameEntity;
    }
    
    // /!\ the socket.io file loading must be done on the same port
    this.connect = function(url, port) {
      port |= 80;
      
      socket = io.connect(url + ':' + port);
      socket.on('load', function(data) {        
        game.map.setByteArray(ByteArray.create(data.map));
        init();
      });
      
    };
    
        
    this.action = function(name, parameters) {
      parameters.name = name;
      socket.emit('action', parameters);
    };
  }
  
  return {
    create: function() {
      return new Facade(); 
    } 
  };
});

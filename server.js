(function() {
  "use strict";
  
  var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server, { log: false })
    , game = require('./server/entity/game').create(),
    sockets = [];
  
  server.listen(80);
  
  
  //////////////////////////////////////////////////////////////
  //                      Web server                          //
  //////////////////////////////////////////////////////////////  
    
  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/game.html');
  });
  
  app.get('/scripts/*', function(req, res) {
    if(req.originalUrl.indexOf('/scripts/common/') === 0) {
      // remove the initial "/scripts/"
      res.sendfile(__dirname + '/' + req.originalUrl.substr(8));
    } else {
      res.sendfile(__dirname + '/client' + req.originalUrl);
    }
  });
  
  app.get('/assets/*', function(req, res) {
    res.sendfile(__dirname + '/client' + req.originalUrl);
  });  
  

  //////////////////////////////////////////////////////////////
  //                WebSocket server                          //
  //////////////////////////////////////////////////////////////  
  game.map.setByteArray(require('./server/tools/mapgenerator').create(120, 120).generate());

  io.sockets.on('connection', function (socket) {
    sockets.push(socket);
    socket.emit('load', {map: String(game.map.ba)});
    socket.on('action', function(data) {
      // @TODO secure the name
      require('./server/action/'+ data.name).run(game, data, refresh);
    });
  });
  
  var refresh = function(stream) {
    var nbSockets = sockets.length;
    for(var i=0; i<nbSockets; i++) {
      sockets[i].emit('refresh', String(stream));
    }
  };
  
}());

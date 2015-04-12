/*global require, process, exports */
'use strict';

(function () {
  
  var Game = function() {
    this.map = require('../../common/entity/map').create();
  };

  exports.create = function() {
    return new Game();
  };
}());
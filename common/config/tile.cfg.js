//////////////////////////////////////////////////////////////////////////////////////
//                    This file has been automatically generated                    //
//                               DO NO EDIT MANUALLY                                //
//                 generation date : Sun, 19 May 2013 13:30:36 GMT                  //
//////////////////////////////////////////////////////////////////////////////////////

/*global require, process, exports */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function() {
	'use strict'

	var get, values = {};

	get = function(id) {
		return values[id];
	};

	values[1] = {"name":"grass"};
	values[2] = {"name":"bush"};
	values[3] = {"name":"tile"};
	values[4] = {"name":"stone"};
	values[5] = {"name":"lava"};

	return {
		get: get,
		TILE_GRASS_ID: 1,
		TILE_BUSH_ID: 2,
		TILE_TILE_ID: 3,
		TILE_STONE_ID: 4,
		TILE_LAVA_ID: 5
	};

});
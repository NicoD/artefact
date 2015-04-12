/*global require, process, exports */
'use strict';

/**
 * server initialization
 */
(function () {
  
  var ConfGenerator = require('./confgenerator'),
  
  // store generic tile info
  storeTileCommonInfo = function() {
    var tiles = [
      {name:'grass'},
      {name:'bush' },
      {name:'tile' },
      {name:'stone'},
      {name:'lava' }
    ],
    constantPattern = function(tile) {
      return 'TILE_' + tile.name.toUpperCase();
    },
    id = 0,
    getNextId = function() {
      return ++id;
    },
    
    conf = ConfGenerator.create(constantPattern, getNextId);
    conf.addObject({name: 'grass'});
    conf.addObject({name: 'bush'});    
    conf.addObject({name: 'tile'}); 
    conf.addObject({name: 'stone'});
    conf.addObject({name: 'lava'});     
    
    conf.save(__dirname + '/../common/config/tile.cfg.js'); 
  },
  
  
  // store tile asset info
  storeTileAssetInfo = function() {
    
    var TileInfo = require('../common/config/tile.cfg'),
    
    constantPattern = function(tileAsset) {
      return 'TILEASSET_' + TileInfo.get(tileAsset.type).name.toUpperCase() + '_' + tileAsset.id;
    },
    getTileAssetId = function(tileAsset) {
      return tileAsset.type * Math.pow(2, 9) + tileAsset.id;
    },
    onBeforeStore = function(tileAsset) {
      delete tileAsset.type;
      delete tileAsset.id;
      tileAsset.index |= 0;
    },
    
    conf = ConfGenerator.create(constantPattern, getTileAssetId, onBeforeStore);
    
    conf.addValue('TILE_WIDTH', 32);    
    conf.addValue('TILE_HEIGHT', 32);    
        
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 1,
        asset: 'tile/grass-1.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 2,
        asset: 'tile/grass-2.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 3,
        asset: 'tile/grass-3.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 4,
        asset: 'tile/grass-4.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 5,
        asset: 'tile/grass-5.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 6,
        asset: 'tile/grass-6.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_GRASS_ID,
        id: 7,
        asset: 'tile/grass-7.png'
      }
    );
    conf.addObject(
      {
        type: TileInfo.TILE_GRASS_ID,
        id: 8,
        asset: 'tile/grass-8.png',
        anim_frames: 8,
        anim_fps: 10
      }
    );     
    conf.addObject(
      {
        type:  TileInfo.TILE_BUSH_ID,
        id: 1,
        asset: 'tile/bush-1.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_BUSH_ID,
        id: 2,
        asset: 'tile/bush-2.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_STONE_ID,
        id: 1,
        asset: 'tile/stone-1.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_STONE_ID,
        id: 2,
        asset: 'tile/stone-2.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_STONE_ID,
        id: 3,
        asset: 'tile/stone-3.png'
      }
    );
    conf.addObject(
      {
        type:  TileInfo.TILE_TILE_ID,
        id: 1,
        asset: 'tile/tile-1.png'
      }
    );
    conf.addObject(
      {
        type: TileInfo.TILE_LAVA_ID,
        id: 1,
        asset: 'tile/lava-1.png'
      }
    );     
    conf.addObject(
      {
        type: TileInfo.TILE_LAVA_ID,
        id: 2,
        asset: 'tile/lava-2.png'
      }
    );     
    conf.addObject(
      {
        type: TileInfo.TILE_LAVA_ID,
        id: 3,
        asset: 'tile/lava-3.png',
        anim_frames: 32,
        anim_fps: 30
      }
    ); 
           
    conf.save(__dirname + '/../client/scripts/config/tileasset.cfg.js');
  };
  
  storeTileCommonInfo();
  storeTileAssetInfo();
  
}());
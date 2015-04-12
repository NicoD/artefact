define(['lib/utils/camera', 
        'lib/utils/asset', 
        'lib/utils/display',
        'common/config/tile.cfg', 
        'config/tileasset.cfg',
        'common/entity/map', 
        'common/lib/bytearray'], 
       function(Camera, Asset, Display, TileConfig, TileAssetConfig, CommonMapEntity, ByteArray) {

  "use strict";

  /*jsLint bitwise:true, plusplus:true*/   

  var Map = function() {
    
    var mapWidthP,
        mapHeightP,

        // this bounds the limit of the tiles visible according to the camera
        // they are update by the update method
        startWT, endWT, startHT, endHT,
        
        camera = Camera.get(),
        assetDictionary = Asset.getDictionary(),
        // contains the current index of all the current frame 
        // for each tile and the last time in ms when it has been updated
        baFrameAnimLayer = ByteArray.create(),
        drawTile;
        
    this.showGrid = true;
    
    this.onByteArraySet = function() {
      // 5: 4 byte for timestamp + 1 for current frame
      baFrameAnimLayer.allocate(5 * this.mapWidthT * this.mapHeightT);
    };
    
    this.setTile = function(x, y, bytes) {
      this.toTile(x, y);
      this.ba.writeBytes(bytes);
      
      // new tile, the old animation info are reseted
      baFrameAnimLayer.to(5 * (y * this.widthT + x));
      baFrameAnimLayer.writeUnsignedInt(0);
      baFrameAnimLayer.writeUnsignedByte(0);
    };
    
    
    
    this.isOutOfBound = function(rect) {
      var mapWidthP  = this.widthT * TileAssetConfig.TILE_WIDTH;
      var mapHeightP = this.heightT * TileAssetConfig.TILE_HEIGHT;
      
      if(rect.width > mapWidthP) {
        if(rect.x < 0 ||
           rect.width - rect.x < mapWidthP) {
          return true;
        }
      } else {
        if(rect.x > 0 ||
          rect.width - rect.x > mapWidthP) {
          return true;
        }
      }
      if(rect.height > mapHeightP) {
        if(rect.y < 0 ||
           rect.height - rect.y < mapHeightP) {
          return true;
        }
      } else {
        if(rect.y > 0 ||
          rect.height - rect.y > mapHeightP) {
          return true;
        }
      }  
      return false;
    };
    
    this.getTileAt = function(xP, yP) {
      return [
        Math.floor((xP - camera.x) / TileAssetConfig.TILE_WIDTH), 
        Math.floor((yP - camera.y) / TileAssetConfig.TILE_HEIGHT)
      ];
    };    
     
    this.update = function(gameTime) {
      var activeTile, tileId, tileIdToAnimate, tileConfig, 
          x, y, tileAnimFrames, tileAnimFps, lastFrameUpdate, elapsedTime, nextFrame, i;
          
      startWT = Math.max(0, Math.floor(-camera.x / TileAssetConfig.TILE_WIDTH));
      endWT   = Math.min(this.widthT, startWT + Math.ceil(camera.width / TileAssetConfig.TILE_WIDTH)+1);
      startHT = Math.max(0, Math.floor(-camera.y / TileAssetConfig.TILE_HEIGHT));
      endHT   = Math.min(this.heightT, startHT + Math.ceil(camera.height / TileAssetConfig.TILE_HEIGHT)+1);
      
      // the frame animation layer is updated
      for(y=startHT; y<endHT; y++) {
        for(x=startWT; x<endWT; x++) {
          this.ba.to(this.baHeaderSize + 7 * (y * this.widthT + x));
          activeTile = this.ba.readUnsignedByte();
          
          tileIdToAnimate = 0;
          for(i=0; i<3; i++) {
            
            tileId = this.ba.readUnsignedShort();
            if(tileId !== 0) {
              tileIdToAnimate = tileId;
            } else {
              break;                          
            }
          }
          if(tileIdToAnimate) {            
            tileConfig = TileAssetConfig.get(tileIdToAnimate);            
            tileAnimFrames = tileConfig.anim_frames ? tileConfig.anim_frames : 1,
            tileAnimFps    = tileConfig.anim_fps    ? tileConfig.anim_fps    : 1;
            
           if(tileAnimFrames == 1) {
              continue;
            }
            baFrameAnimLayer.to(5 * (x * this.widthT + y));
            lastFrameUpdate = baFrameAnimLayer.readUnsignedInt();
            elapsedTime = gameTime.currentTime - lastFrameUpdate;
            
            if(1/tileAnimFps*1000 > elapsedTime) {
              continue;
            }            
            baFrameAnimLayer.to(baFrameAnimLayer.getPosition() - 4);
            baFrameAnimLayer.writeUnsignedInt(parseInt(gameTime.currentTime, 10));
            // frame are stored as from 0
            nextFrame = baFrameAnimLayer.readUnsignedByte()+1;
            if(nextFrame >= tileAnimFrames) {
              nextFrame = 0;
            }
            baFrameAnimLayer.to(baFrameAnimLayer.getPosition() - 1);
            baFrameAnimLayer.writeUnsignedByte(nextFrame);
          }
        }
      }
    };
          
    this.draw = function(g) {
      var x, y, i, tileId, tileConfig, nextTileLayerId, frame,
          tileIds = [];
              
      for(y=startHT; y<endHT; y++) {
        this.ba.to(this.baHeaderSize + 7 * (y * this.widthT + startWT));
        
        for(x=startWT; x<endWT; x++) {

          this.ba.readUnsignedByte(); // useless
          for(i=0; i<3; i++) {
            tileId = this.ba.readUnsignedShort();
            if(tileId === 0) {
              this.ba.to(this.ba.getPosition() + ((2-i) * 2) );              
              break;
            }            
            tileConfig = TileAssetConfig.get(tileId);            

            nextTileLayerId = -1;
            
            // TODO use a byte to flag the first by draw

            if(i != 2) {
              nextTileLayerId = this.ba.readUnsignedShort();
              this.ba.to(this.ba.getPosition() - 2);
              if(nextTileLayerId !== 0) {
                var asset = assetDictionary.get(nextTileLayerId);
                if(!asset) {
                  assetDictionary.add(nextTileLayerId, TileAssetConfig.get(nextTileLayerId).asset);
                  asset = assetDictionary.get(nextTileLayerId);
                }
                
                // TODO only check the drawn tile
                if(!Display.isTransparent(asset, 2, 10, nextTileLayerId)) {
                  continue;
                }
              }
            }
            // animation is only handled for the last element on the stack
            // TODO check if the next tile has transparent content
            if(nextTileLayerId === 0 || i==2) {
              baFrameAnimLayer.to(5 * (x * this.widthT + y) + 4);
              frame = baFrameAnimLayer.readUnsignedByte();
            } else {
              frame = 0;
            }
            frame += tileConfig.index;            
            drawTile(g, tileId, x*TileAssetConfig.TILE_WIDTH + camera.x, y*TileAssetConfig.TILE_HEIGHT + camera.y, frame);
          }
        }
      }
    
      if(this.showGrid === true) {
        g.lineWidth = 2;
        g.strokeStyle = "rgba(0,0,0,0.3)";
        for(x=startWT; x<endWT; x++) {          
          g.beginPath();
          g.moveTo(x*TileAssetConfig.TILE_WIDTH + camera.x - 1, 0);
          g.lineTo(x*TileAssetConfig.TILE_WIDTH + camera.x - 1, camera.height);
          g.closePath();
          g.stroke();
        }
        for(y=startHT; y<endHT; y++) {
          g.beginPath();
          g.moveTo(0, y*TileAssetConfig.TILE_HEIGHT + camera.y - 1);
          g.lineTo(camera.width, y*TileAssetConfig.TILE_HEIGHT + camera.y - 1);
          g.closePath();
          g.stroke();          
        }
      }
    };
    
    drawTile = function(g, tileId, x, y, frame) {
      if(!assetDictionary.get(tileId)) {
        assetDictionary.add(tileId, TileAssetConfig.get(tileId).asset);
      }
      g.drawImage(
        assetDictionary.get(tileId), 
        frame*TileAssetConfig.TILE_WIDTH, 0, 
        TileAssetConfig.TILE_WIDTH, TileAssetConfig.TILE_HEIGHT, 
        x, y, 
        TileAssetConfig.TILE_WIDTH, TileAssetConfig.TILE_HEIGHT);
    };
  };
   
   
  return {
    create: function() {
      return CommonMapEntity.create(new Map());
    }
  };
});




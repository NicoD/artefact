/**
 * Allow to read write binary values in Big Endian byte order directly in an byte array
 * Supported types:
 *  - unsigned byte
 *  - byte
 *  - unsigned short
 *  - short
 *  - unsigned int
 *  - int
 *  - ascci char
 *  - ascci string
 *  - boolean
 *  - bytes
 * 
 * compatible AMD/requirejs
 */

// nodejs support for AMD/requirejs
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
  
define(function() {
  "use strict";

  /*jslint bitwise:true, plusplus:true*/

  var ByteStorage, ByteArray;
  
  
  // input (string | ArrayBuffer)
  ByteStorage = function(input) {
      
    var buf, MEM_SIZE = 1024; 

    this.maxPosition = 0;
    
    if (!ArrayBuffer.prototype.copyInto) {
      ArrayBuffer.prototype.copyInto = function (target) {
        var i, that = new Uint8Array(this),
        resultArray = new Uint8Array(target);
        for (i = 0; i < resultArray.length; i++) {
          resultArray[i] = that[i];
        }
        return target;
      };
    }
    

    if(input === undefined) {
      buf = new ArrayBuffer();
    } else if(input instanceof ArrayBuffer) {
      buf = input;   
      this.maxPosition = buf.byteLength;            
    } else if(typeof input === "string") {
      buf = new ArrayBuffer(input.length);
    } else {
      throw new Error("unsupported input " + typeof(input));
    }
    this.ba = new Uint8Array(buf);  
    
    this.position = 0;
    
    
    if(typeof input === "string") {
      this.maxPosition = input.length;
      (function(ba) { 
        var ch, i=0, j=0;
        for (i = 0; i < input.length; i++ ) { 
          ch = input.charCodeAt(i);
          ba[j++] = ch & 0xFF;
          if(ch >= 127) {
            ch = ch >> 8;                       
          }
        }
      }(this.ba));
    }
      
    this.writeByte = function(b) {
      this.ba[this.position++] = b & 0xFF;          
      if(this.position > this.maxPosition) {
        this.maxPosition = this.position;
        if(this.maxPosition >= this.ba.length) {
          this.allocate(MEM_SIZE);
        }
      }
    };
      
      
    this.readByte = function() {
      return this.ba[this.position++];
    };
    
    
    this.readBytes = function(length) {
      var i, bytes;
      bytes = new Uint8Array(new ArrayBuffer(length));
      for(i=0; i<length; i++) {
        bytes[i] = this.readByte();
      }
      return bytes;
    };
    
    this.allocate = function(size) {
      buf = buf.copyInto(new ArrayBuffer(this.ba.length + size));
      this.ba = new Uint8Array(buf);
    };
    
    this.size = function(inMemory) {
      inMemory = !!inMemory;
      return inMemory ? this.ba.length : this.maxPosition;
    };  
  };
  
  ByteArray = function(input) {
      
    var MIN_BYTE, MAX_BYTE, MIN_UBYTE, MAX_UBYTE, MIN_SHORT, MAX_SHORT, MIN_USHORT, MAX_USHORT,
        MIN_INT, MAX_INT, MIN_UINT, MAX_UINT, storage;
    
    MIN_BYTE   = -Math.pow(2, 7) ;
    MAX_BYTE   = Math.pow(2, 7) - 1;
    MIN_UBYTE  = 0;
    MAX_UBYTE  = Math.pow(2, 8) - 1;
    MIN_SHORT  = -Math.pow(2, 15);
    MAX_SHORT  = Math.pow(2, 15) - 1;
    MIN_USHORT = 0;
    MAX_USHORT = Math.pow(2, 16) - 1;
    MIN_INT    = -Math.pow(2, 31);
    MAX_INT    = Math.pow(2, 31) - 1;
    MIN_UINT   = 0;
    MAX_UINT   = Math.pow(2, 32) - 1;
    
    storage = new ByteStorage(input);      
      
    // allocate memory in the buffer (in bytes)
    // useful when write a lot of informations
    this.allocate = function(size) {
      storage.allocate(size);
    };
    
    this.reset = function() {
      storage.position = 0;
    };
      
    this.next = function() {
      ++storage.position;
    };
    
    this.previous = function() {
      --storage.position;
    };
      
    this.to = function(to) {
      storage.position = to;
    };
      
    this.getPosition = function() {
      return storage.position;
    };
       
    this.isUnsignedIntValid = function(value) {
      return !(value < MIN_UINT || value > MAX_UINT);
    };
      
    this.isIntValid = function(value) {
      return !(value < MIN_INT || value > MAX_INT);   
    };
      
    this.isShortValid = function(value) {
      return !(value < MIN_SHORT || value > MAX_SHORT);
    };
      
    this.isUnsignedShortValid = function(value) {
      return !(value < MIN_USHORT || value > MAX_USHORT);
    };
      
    this.isByteValid = function(value) {
      return !(value < MIN_BYTE || value > MAX_BYTE);
    };
      
    this.isASCIIStringValid = function(value) {
      var i=0;
      for(i; i < value.length; i++) {
        if(!this.isASCIICharValid(value.substr(i, 1))) { return false; }
      }
      return true;
    };
      
    this.isASCIICharValid = function(value) {
      return value.length === 1 && value.charCodeAt(0) < 127;
    };
      
    this.isUnsignedByteValid = function(value) {
      return !(value < MIN_UBYTE || value > MAX_UBYTE);
    };
      
    this.writeBytes = function(bytes) {
      var i;
      for(i=0; i < bytes.length; i++) {
        this.writeByte(bytes[i]);
      }
    };
      
    this.writeBool = function(value) {
      this.writeByte(+(value === true));
    };
    
    this.writeASCIIChar = function(value) {
      this.writeByte(value.charCodeAt(0));
    };
    
    this.writeASCIIString = function(value, length) {
      var i = 0, maxLen = length ? Math.min(value.length, length) : value.length;
      for(i; i < maxLen; i++) {                   
        this.writeASCIIChar(value.substr(i, 1));
      }
      if(length === undefined) {
        this.writeASCIIChar("\u0000");
      }
      while(i++ < length) {
        this.writeASCIIChar("\u0000");
      }
    };
      
              
    this.writeUnsignedInt = function(value) {
      storage.writeByte(value >> 24);
      storage.writeByte(value >> 16);
      storage.writeByte(value >> 8);            
      storage.writeByte(value);
    };

      
    this.writeInt = function(value) {
      this.writeUnsignedInt(value);
    };
      
      
    this.writeUnsignedShort = function(value) {
      storage.writeByte(value >> 8);
      storage.writeByte(value);
    };
      
    this.writeShort = function(value) {
      this.writeUnsignedShort(value);
    };
      
    this.writeUnsignedByte = function(value) {
      storage.writeByte(value);
    };
      
    this.writeByte = function(value) {
      this.writeUnsignedByte(value);
    };
      
    this.readBool = function() {
      return this.readByte() === 1;
    };
      
    this.readASCIIChar = function() {
      return String.fromCharCode(this.readByte());
    };
      
    this.readASCIIString = function(length) {
      var buff = "", c;
      while((c = this.readASCIIChar()) !== "\u0000") {
        buff += c;
      }
          
      while(--length >  buff.length) {
        ++storage.position;
      }

      return buff;
    };
      
    this.readUnsignedInt = function() {
      var value = storage.readByte() << 24;
      value |= storage.readByte() << 16;
      value |= storage.readByte() << 8;
      value |= storage.readByte();
      return value < 0 ? Math.pow(2, 32) + value : value;
    };
      
    this.readInt = function() {
      var unsignedValue = this.readUnsignedInt();
      return (unsignedValue > MAX_INT ? unsignedValue - Math.pow(2, 32) : unsignedValue); 
    };
      
    this.readUnsignedShort = function() {
      return (storage.readByte() << 8 | storage.readByte());
    };
      
    this.readShort = function() {
      var unsignedValue = this.readUnsignedShort();
      return (unsignedValue > MAX_SHORT ? unsignedValue - Math.pow(2, 16) : unsignedValue);           
    };
      
    this.readUnsignedByte = function() {      
      return storage.readByte();
    };
      
    this.readBytes = function(length) {
      return storage.readBytes(length);
    };
      
    this.readByte = function() {
      var unsignedValue = this.readUnsignedByte();
      return (unsignedValue > MAX_BYTE ? unsignedValue - Math.pow(2, 8) : unsignedValue);
    };
      
    this.size = function(inMemory) {
      return storage.size(inMemory);
    };
      
    this.toString = function() {
      if(this.size() === 0) { return null; }
      storage.position = 0;
      var buf = "";
      do {
        buf += String.fromCharCode(storage.readByte());
      } while(storage.position < storage.size());

      return buf;
    };
      
    this.toArrayBuffer = function() {
      var buf = new ArrayBuffer(this.size()),
          ba = new Uint8Array(buf);
      storage.position = 0;
      do {
        ba[storage.position] = storage.readByte();
      } while(storage.position < storage.size());

      return buf;
    };
  };


    
  return {      
    create: function(input) {
      return new ByteArray(input);
    }
  };
});
/*global require, process, exports */
'use strict';

(function () {
   
  var ConfGenerator = function(getNameHandlerDefault, getIdHandlerDefault, onBeforeStoreDefault) {
    var confObjects = [],
        confValues  = [];
    this.addObject = function(value, getNameHandler, getIdHandler, onBeforeStore) {
      getNameHandler = getNameHandler ? getNameHandler : getNameHandlerDefault;
      getIdHandler   = getIdHandler   ? getIdHandler   : getIdHandlerDefault;
      onBeforeStore  = onBeforeStore  ? onBeforeStore  : onBeforeStoreDefault;
            
      var data = {
        name: getNameHandler(value) + '_ID',
        id: getIdHandler(value)
      };
      if(onBeforeStore) {
        onBeforeStore(value);
      }
      data.value = value;
      confObjects.push(data);
    };
    
    this.addValue = function(name, value) {
      confValues.push({name: name, value: value});
    };
     
    // synchronous save (i.e. you can refer to the configuration file generated in the same script)
    this.save = function(fileName) {
      var fs = require('fs'),
          out = getHeader(),
          nbConfObjects = confObjects.length,
          nbConfValues  = confValues.length,
          err, i;
          
      out += "\tvar get, values = {};\n";
      out += "\n";      
      out += getDefaultBody();
      out += "\n";
      
      for(i=0; i<nbConfObjects; i++) {
        out += "\tvalues["+confObjects[i].id+"] = " + JSON.stringify(confObjects[i].value) + ";\n";
      }
      out += "\n";
      out += "\treturn {\n";
      out += "\t\tget: get";
      if(nbConfObjects > 0 || nbConfValues > 0) {
        out += ",";
      }
      out += "\n";
      for(i=0; i<nbConfValues; i++) {
        out += "\t\t" + confValues[i].name + ": " + JSON.stringify(confValues[i].value);
        if(i < nbConfValues-1 || nbConfObjects > 0) {
          out += ",";
        }
        out += "\n";
      }
            
      for(i=0; i<nbConfObjects; i++) {
        out += "\t\t" + confObjects[i].name + ": " + confObjects[i].id;
        if(i < nbConfObjects-1) {
          out += ",";
        }
        out += "\n";
      }
      out += "\t};\n";
      out += getFooter();
      try {
        fs.writeFileSync(fileName, out);
      } catch(err) {
        console.log(err);
        return;
      }
      console.log('file ' + fileName + ' written');
    };
  },
  
  getHeader = function() {
    return getWarningHeader() +
           "/*global require, process, exports */\n" +
           "if (typeof define !== 'function') {\n" +
           "\tvar define = require('amdefine')(module);\n" +
           "}\n\n" +
           "define(function() {\n" +
           "\t'use strict'\n\n";
  },
  
  getWarningHeader = function() {
    var i, j,
        maxLength = 80,
        diff, left, right, blankChar,
        out = "",
        sentences,
        nbSentences;
    
   sentences = [
      "",
      "This file has been automatically generated",
      "DO NO EDIT MANUALLY",
      "generation date : " + new Date().toUTCString(),      
      ""
    ];
    nbSentences = sentences.length;


    for(i=0; i<nbSentences; ++i) {
      if(sentences[i].length > maxLength) {
        maxLength = sentences[i].length;
      }
    }
    for(i=0; i<nbSentences; ++i) {
      blankChar = (i === 0 || i === nbSentences - 1) ? "/" : " ";
      out += "//" + blankChar;
      diff = maxLength - sentences[i].length;
      left = Math.floor(diff / 2);
      right = diff - left;
      
      for(j=0; j<left; ++j) {
        out += blankChar;
      }
      out += sentences[i];
      for(j=0; j<right; ++j) {
        out += blankChar;
      }      
      out += blankChar + "//\n";
    }
    out += "\n";
    return out;
  },
  
  getDefaultBody = function() {
    return "\tget = function(id) {\n" +
           "\t\treturn values[id];\n" +
           "\t};\n";
  },
  
  getFooter = function() {
    return "\n});";
  }
   
   
  exports.create = function(getNameHandler, getIdHandler, onBeforeStore) {
    return new ConfGenerator(getNameHandler, getIdHandler, onBeforeStore);
  }
              
}());
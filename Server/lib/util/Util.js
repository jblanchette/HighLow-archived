var _ = require("underscore");

function Util(){

}

/**
 * Generate an ID of default length 10.
 *
 * If a checkList Object is provided, the ID is checked for uniqueness.
 *
 * @param {Number} idLength
 * @param {Object} checkList
 * @returns {String}
 */
Util.prototype.generateID = function( idLength, checkList ){

  var result = "";
  var charCode;
  var done = false;
  var hasChecklist = _.isObject(checkList);


  if(!_.isNumber(idLength) || idLength <= 0){
      idLength = 10;
  }

    while (!done) {
        for (var i = 0; i < 10; i++) {
            charCode = 48 + Math.floor(Math.random() * 9);
            result += String.fromCharCode(charCode);
        }
        if (!hasChecklist || !_.has(checkList, result)) {
            done = true;
        }
    }

  console.log("Generated ID: ", result);
  return result;

};

var jUtil = (jUtil || new Util());

module.exports = jUtil;
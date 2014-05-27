var _ = require("underscore");

var jClientData = function(){
    console.log("Init ClientData");
    this.data = {};

    /**
     * Create an entry in the data set with a {name: data} pair.
     *
     * If an entry exists for name andoverride is true it will be overwritten.
     * Otherwise the call will fail and return false;
     *
     * @returns {Data Object}
     */
    this.data.create = function( name, data, override){

    };

    /**
     * Return the entry for a given name from the data set.
     * If no entry exists, null is returned.
     *
     * @returns {Data Object}
     */
    this.data.read = function( name ){

    };

    /**
     * Return an array of values from the data store.
     *
     * @param {Array} nameArray
     * @returns {Array}
     */
    this.data.readArray = function( nameArray ){

    };

    /**
     * Remove an entry from the data set based on the name.
     *
     */
    this.data.remove = function(){

    };

    /**
     * Append some data on the end of an existing entry.
     * @returns {Data Object}
     */
    this.data.append = function(){

    };


};

exports.ClientData = jClientData;
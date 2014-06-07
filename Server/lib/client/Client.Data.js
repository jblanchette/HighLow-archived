var _ = require("underscore");

function ClientData(){
    this.entries = {};
}

ClientData.prototype.set = function( key, value ){
    this.entires[key] = value;
};

ClientData.prototype.get = function( key ){
    if(_.has(this.entries, key)){
        return this.entries[key];
    }else{
        return null;
    }
};

module.exports = ClientData;
define(['underscore'], function(_){
   function Model(){
       this.data = {};
   };

   Model.prototype.defaults = function( defaultObject ){
       _.defaults(this.data, defaultObject);
   };

   Model.prototype.set = function(key, value){
       this.data[key] = value;
   };

   Model.prototype.get = function(key){
       return this.data[key];
   };

   return Model;
});
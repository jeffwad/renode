/**

  @module       lib/registry
  @description  object registry service

*/

var objects = {};

exports.add = function(object) {

  if(objects.hasOwnProperty(object.id)) {
    throw Error.spawn("object with id ("+ object.id +") is already registered");
  }
  objects[object.id] = object;

};

exports.get = function(id) {

  if(!objects.hasOwnProperty(id)) {
    throw Error.spawn("object with id ("+ id +") cannot be found");
  }
  return objects[id];

};

exports.remove = function(object) {

  delete objects[this.get(object.d)];

};


exports.__flush__ = function() {

  objects = {};

};
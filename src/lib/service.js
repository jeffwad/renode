/**

  @module       lib/service
  @description  service location

*/

var services = {};

exports.register = function(key, service) {

  if(services.hasOwnProperty(key)) {
    throw Error.spawn("service ("+ key +") is already registered");
  }
  services[key] = service;

};

exports.locate = function(key) {

  var service = services[key];
  if(typeof service === "undefined") {
    throw Error.spawn("service ("+ key +") cannot be found");
  }
  return service;

};

exports.__flush__ = function() {

  services = {};

};
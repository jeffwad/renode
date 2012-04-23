/**

  @module       lib/Collection
  @description  A collection of objects

*/
var EventMachine = require("lib/EventMachine"),
    iter         = require("lib/iter"),
    indexOf      = iter.indexOf,
    some         = iter.some;

module.exports = {}.create({


  /**
    @description  constructor
  */
  __init__: function(type) {

    EventMachine.__init__.apply(this);
    Object.defineProperties(this, {
      '_type': {
        value: type
      },
      '_items': {
        value: []
      }
    });

  },


  //  public

  /**
    @description  adds a model to the collection
    @param        {lib/Base} object
  */
  add: function(object) {

    if(!this._type.isPrototypeOf(object)) {
      throw Error.spawn(module.id + "#add: model does not implement " + this._type + " on it's prototype");
    }
    this._items.push(object);

  },


  /**
    @description  retrieves a model by id
    @param        {String} id
    @param        {lib/Base} object
  */
  getById: function(id) {

    var ret = false;

    some(this._items, function(object){
      if (object.id === id) {
        ret = object;
        return true;
      }
      return false;
    });
    return ret;

  },


  /**
    @description  retrieves a model by index
    @param        {String} index
    @param        {lib/Base} object
  */
  getByIndex: function(index) {

    return this._items[index] || false;

  },


  /**
    @description  retrieves all the models
    @return       {Array}
  */
  items: function() {

    return [].concat(this._items);

  },


  /**
    @description  removes a model from the collection
    @param        {lib/Base} object
    @return       {Boolean}
  */
  remove: function(object) {

    var index = indexOf(this._items, object);
    if(index !== -1) {
      this._items.splice(index, 1);
      return true;
    }
    return false;
  }




});
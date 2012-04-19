/**

  @module       app/models/TrackModelCollection
  @description  A collection of models

*/
var Base      = require('lib/Base'),
    iter      = require('lib/iter'),
    BaseModel = require('app/models/BaseModel'),
    indexOf   = iter.indexOf,
    some      = iter.some;

module.exports = Base.create({


  /**
    @description  constructor
  */
  __init__: function(type) {

    Base.__init__.apply(this);
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
    @param        {app/models/BaseModel} model
  */
  add: function(model) {

    if(!this._type.isPrototypeOf(model)) {
      throw Error.spawn(module.id + "#add: model does not implement " + this._type + " on it's prototype");
    }
    this._items.push(model);

  },


  /**
    @description  retrieves a model by id
    @param        {String} id
    @return       {app/models/BaseModel}
  */
  getById: function(id) {

    var ret = false;

    some(this._items, function(model){
      if (model.id === id) {
        ret = model;
        return true;
      }
      return false;
    });
    return ret;

  },


  /**
    @description  retrieves a model by index
    @param        {String} index
    @return       {app/models/BaseModel}
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
    @param        {app/models/BaseModel} model
    @return       {Boolean}
  */
  remove: function(model) {

    var index = indexOf(this._items, model);
    if(index !== -1) {
      this._items.splice(index, 1);
      return true;
    }
    return false;
  }




});
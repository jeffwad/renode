/**

  @module       lib/Base
  @description  object that all other objects in our system will inherit from
                all objects support accessors and relationships
  @todo         1) hasMany is the only relation so far. Implement hasOne, embeds, belongsTo, hasAndBelongsToMany?
                2) there is some code duplication to do with recursing back up the prototype
                chain in two methods. sort this out - but have a think about how first.
                3) add some readonly capacity to the accessors

*/
var EventMachine = require("lib/EventMachine"),
    utils        = require("lib/utils"),
    iter         = require("lib/iter"),
    Collection   = require("lib/Collection"),
    service      = require("lib/service"),
    forEach      = iter.forEach,
    reduce       = iter.reduce,
    chain        = iter.chain,
    Base;


function merge(object, mixin) {
  return reduce({}, chain([object || {}, mixin || {}]), function(ret, value, key) {
    if(!ret.hasOwnProperty(key)) {
      ret[key] = value;
    }
    return ret;
  });
}

function concat(array, mixin) {
  return reduce([], chain([array || [], mixin || []]), function(ret, value, key) {
    if(ret.indexOf(value) === -1) {
      ret.push(value);
    }
    return ret;
  });
}



Base = EventMachine.create({

  /**
    @description  accessors
  */
  accessors: {

    id: {
      type: 'string'
    }
  },


  //  constructors

  /**
    @description  prototoype constructor
  */
  create: function(definition) {

    var base;

    //  merge all the definition object declarations
    forEach(["accessors", "hasMany", "hasOne"], function(property) {

      definition[property] = merge(definition[property], this[property]);

    }, this);

    //  merge all the definition array declarations
    forEach(["services"], function(property) {

      definition[property] = concat(definition[property], this[property]);

    }, this);

    base = EventMachine.create.call(this, definition);

    //  now we want to set up all the relationships factory methods on the prototype
    base._createRelationships();

    return base;

  },


  /**
    @description  instance constructor
  */
  __init__: function(data) {

      EventMachine.__init__.call(this);

      Object.defineProperty(this, "_data", {
        value: {}
      });

      this._initAccessors();
      this._initRelationships();
      this._initServices();
      this._updateAccessors(data);
      this._createRelatedEntities(data);


      //  if the incoming data has no id, generate one, and add it to the data object
      //  as the data object is being passed around all client from the server to instantiate
      //  the synced model
      //  todo: add serialise function and remove the patch on the data.id
      if(typeof data.id === "undefined") {
        this.id = data.id = utils.generateId();
      }
  },


  //  private

  _createAccessor: function(name, definition, enumerable) {

    //  create the getters and setters
    Object.defineProperty(this, name, {

      get: function() {

        return this._data[name];

      },

      set: function(value) {

        if (typeof value !== "undefined" && definition.type) {
          if (typeof value !== definition.type) {
            if (!definition.type.isPrototypeOf(value)) {
              throw Error.spawn("accessor (" + name + ") does not accept data: " + value);
            }
          }
        }

        this._data[name] = value;

        this.emit("update", {
          accessor: name,
          value: value
        });

      },
      enumerable: !! enumerable
    });

    if (typeof definition.defaultValue !== "undefined") {
      this[name] = definition.defaultValue;
    }

  },



  /**
    @description  to be implemented up the prototype chain
  */
  _createEntities: function() {

    throw Error.spawn("Base#_createEntities: to be implemented up the prototype chain");

  },



  /**
    @description  sets up the hasMany relationships on the model,
    @param        {object} object
  */
  _createHasMany: function() {

    forEach(this.hasMany, function(relation, name) {

      var capitalName = name.singularize().capitalize();

      //  create the factory methods
      Object.defineProperty(this, "create" + capitalName, {

        value: function(data) {

          var relatedModel,
              factory = this["_" + name + "Factory"];

          if (factory && typeof factory.create === "function") {
            relatedModel = factory.create(data);
          }
          else {
            relatedModel = relation.spawn(data);
          }

          this[name].add(relatedModel);

          return relatedModel;

        },
        enumerable: false

      });

      Object.defineProperty(this, "remove" + capitalName, {

        value: function(model) {

          this[name].remove(model);

        },
        enumerable: false

      });

      Object.defineProperty(this, "remove" + capitalName + "ByIndex", {

        value: function(index) {

          var collection = this[name];

          collection.remove(collection.getByIndex(index));

        },
        enumerable: false

      });

      Object.defineProperty(this, "remove" + capitalName + "ById", {

        value: function(id) {

          var collection = this[name];

          collection.remove(collection.getById(id));

        },
        enumerable: false

      });

    }, this);

  },


  /**
    @description  create child entities
    @param        {object} data
  */
  _createRelatedEntities: function(data) {

    forEach(chain([this["hasMany"], this["hasOne"]]), function(relation, name) {

      this._createEntities(name, data);

    }, this);

  },



  /**
    @description  sets up the relationship accessors on the model,
  */
  _createRelationships: function() {

    this._createHasMany();
    //this._initHasOne();

  },



  /**
    @description  sets up the accessors on the model
                  recurses up the prototype chain
  */
  _initAccessors: function() {

    forEach(this.accessors, function(accessor, name) {

      if (!this.hasOwnProperty(name)) {

        //  set the accessor definition
        Object.defineProperty(this, "__" + name + "__", {

          value: accessor,
          enumerable: false

        });

        //  create an enumerable accessor
        this._createAccessor(name, accessor, true);

      }

    }, this);

  },



  /**
    @description  sets up the hasMany relationships on the model,
    @param        {object} object
  */
  _initHasMany: function() {

    forEach(this.hasMany, function(relation, name) {

      var capitalName = name.singularize().capitalize();

      if (!this.hasOwnProperty(name)) {

        //  create a non-enumerable accessor
        this._createAccessor(name, {
          'defaultValue': Collection.spawn(relation),
          'type'        : Collection
        });

      }

    }, this);

  },


  /**
    @description  sets up the hasOne relationships on the model,
  */
  _initHasOne: function() {

    forEach(this.hasOne, function(relation, name) {

      var capitalName = name.singularize().capitalize();

      if (!this.hasOwnProperty(name)) {

        //  create a non-enumerable accessor
        this._createAccessor(name, {
          'type': relation
        });

        //  create the factory methods
        Object.defineProperty(this, "create" + capitalName, {

          value: function(data) {

            var relatedModel,
                factory = this["_" + name + "Factory"];

            if (factory && typeof factory.create === "function") {
              relatedModel = factory.create(data);
            }
            else {
              relatedModel = relation.spawn(data);
            }

            this[name] = relatedModel;

            return relatedModel;

          },
          enumerable: false

        });

      }

    }, this);

  },


  /**
    @description  sets up the relationship accessors on the model,
  */
  _initRelationships: function() {

    this._initHasMany();
    //this._initHasOne();

  },



  /**
    @description  sets up the services accessor
  */
  _initServices: function() {

    forEach(this.services, function(serviceName) {

      if (!this.hasOwnProperty(serviceName)) {

        Object.defineProperty(this, serviceName, {

          get: function() {
            return service.locate(serviceName);
          }

        });

      }

    }, this);

  },


  /**
    @description  loops over all the accessors values
                  and updates their values from data
    @param        {object} data
  */
  _updateAccessors: function(data) {

    forEach(this, function(accessor, name){

      if (typeof data[name] !== "undefined") {
        this[name] = data[name];
      }

    }, this);

  }

});


module.exports = Base;
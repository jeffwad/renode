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
    forEach      = iter.forEach,
    services = {};

module.exports = EventMachine.create({


  /**
    @description  accessors
  */
  accessors: {

    id: {
      type: 'string'
    }
  },


  //  constructor

  /**
    @description  constructor
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

      this.id = utils.generateId();

  },


  //  public
  registerService: function(key, service) {

    services[key] = service;

  },


  //  private

  _createAccessor: function(name, definition, enumerable) {

    //  create the getters and setters
    Object.defineProperty(this, name, {

      get: function() {

        return this._data[name];

      },

      set: function(value) {

        if (definition.type) {
          if (typeof value !== definition.type) {
            if (!definition.type.isPrototypeOf(value)) {
              throw Error.spawn("accessor (" + name + ") does not accept data: " + value);
            }
          }
        }

        this._data[name] = value;

      },
      enumerable: !! enumerable
    });

    if (typeof definition.defaultValue !== "undefined") {
      this[name] = definition.defaultValue;
    }

  },


  /**
    @description  sets up the accessors on the model
                  recursing through all the inherited models
    @param        {object || undefined} object
  */
  _initAccessors: function(object) {

    var proto;

    object = object || this;

    if(object.hasOwnProperty('accessors')) {

      forEach(object.accessors, function(accessor, name) {

        if(!this.hasOwnProperty(name)) {

          //  set the accessor definition
          Object.defineProperty(this, '__' + name, {

            value: accessor,
            enumerable: false

          });

          //  create an enumerable accessor
          this._createAccessor(name, accessor, true);

        }

      }, this);

    }

    proto = Object.getPrototypeOf(object);
    if(proto && proto.hasOwnProperty('accessors')) {
      this._initAccessors(proto);
    }


  },


  /**
    @description  sets up the accessor hasMany relationships on the model,
                  recursing through all the inherited models
    @param        {object || undefined} object
  */
  _initRelationships: function(object) {

    var proto;

    object = object || this;

    if(object.hasOwnProperty('hasMany')) {

      forEach(object.hasMany, function(relation, name) {

        var capitalName = name.singularize().capitalize();

        if(!this.hasOwnProperty(name)) {

          //  create a non-enumerable accessor
          this._createAccessor(name, {
            'defaultValue': Collection.spawn(relation),
            'type'        : Collection
          });

          //  create the factory methods
          Object.defineProperty(this, "create" + capitalName, {

            value: function(data) {

              var relatedModel,
                  factory = this["_" + name + "Factory"];

              if(factory && typeof factory.create === "function") {
                relatedModel = factory.create(data);
              }
              else {
                relatedModel = relation.spawn(data);
              }

              this[name].add(relatedModel);

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


        }

      }, this);


    }

    proto = Object.getPrototypeOf(object);
    if(proto && proto.hasOwnProperty('hasMany')) {
      this._initRelationships(proto);
    }


  },


  //  sets up the services
  _initServices: function() {

    if(this.services) {

      forEach(this.services, function(service) {

        Object.defineProperty(this, service, {

          get: function() {
            return services[service];
          }

        });

      }, this);

    }

  },


  /**
    @description  loops over all the accessors values
                  and updates their values from data
    @param        {object} data
  */
  _updateAccessors: function(data) {

    forEach(this, function(accessor, name){

      if(typeof data[name] !== "undefined") {
        this[name] = data[name];
      }

    }, this);

  }


});

/**

  @module       app/models/BaseModel
  @description  base model object
  @todo         1) hasMany is the only relation so far. Implement hasOne, embeds, belongsTo, hasAndBelongsToMany?
                2) there is some code duplication to do with recursing back up the prototype
                chain in two methods. sort this out - but have a think about how first.
                3) add some readonly capacity to the accessors

*/
var utils       = require('lib/utils'),
    Base        = require('lib/Base'),
    iter        = require('lib/iter'),
    Collection  = require('app/models/Collection'),
    forEach     = iter.forEach;



module.exports = Base.create({

  //  properties

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

    Base.__init__.apply(this);

    Object.defineProperty(this, "_data", {
      value: {}
    });

    this._initAccessors();
    this._initRelationships();

    this._updateAccessors(data);

    this.id = utils.generateId();

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
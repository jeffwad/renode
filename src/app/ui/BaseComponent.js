/**

  @module       app/ui/BaseComponent
  @description  base ui component

*/
//"use strict";

var Base    = require("lib/Base"),
    iter    = require("lib/iter"),
    utils   = require("lib/utils"),
    forEach = iter.forEach,
    chain   = iter.chain;


module.exports = Base.create({

  //  properties

  accessors: {

    node: {
      type: HTMLElement.prototype
    },

    parent: {
      type: Base
    }

  },


  //  public

  /***
    @description  constructor
  */
  __init__: function(model) {

    Base.__init__.call(this, {
      model: model,
      id: utils.generateId()
    });

  },


  //  public


  /**
    @description  sets the event listeners up on the entity
                  tells our children to do the same
  */
  addEventListeners: function() {

    this._addEventListeners();


    forEach(this["hasMany"], function(relation, name) {

      forEach(this[name].items(), function(child) {

        child.addEventListeners();

      });

    }, this);


    forEach(this["hasOne"], function(relation, name) {

      relation.addEventListeners();

    });

  },



  /**
    @description  hides the ui entity
  */
  hide: function() {

    this.node.hide();

  },



  /**
    @description  checks that all the render data is correct and then delegates to a private _render method
    @param        {domNode} root
  */
  render: function(root) {

    if(typeof this.html === "undefined") {
      throw Error.spawn("ui/BaseComponent#html has not been set on component");
    }

    this._render();
    this._renderChildren();

    //  if we were passed a root node, append to it
    if(root) {
      root.appendChild(this.node);
    }

  },


  /**
    @description  shows the ui entity
  */
  show: function() {
    this.node.show();
  },



  //  private



  /**
    @description  sets up our event listeners
                  we use the same handlers object as our inherited event machine
                  so we don't need to re implement tear down
  */
  _addEventListeners: function() {

    var object = this;

    while (object) {

      forEach(Object.getOwnPropertyNames(object), function(property){

        //  eg: click>sequencer/control
        if(/(\w+)>(\w+\/\w+)/.test(property)) {

          this.handlers[RegExp.$2] = this.node.on(RegExp.$1, RegExp.$2, this[property].bind(this));
        }

      }, this);

      object = Object.getPrototypeOf(object);

    }



    // forEach(this.events || {}, function(methodName, eventName) {

    //   if(typeof this[methodName] !== "function") {
    //     throw ReferenceError.spawn(methodName + ": is not a method on this object");
    //   }

    //   this.handlers[eventName] = this.node.on("click", eventName, this[methodName].bind(this));

    // }, this);

  },


  /**
    @description  creates a set of related entites based on our models children
    @param        {string} name
  */
  _createEntities: function(name) {

    var factoryMethodName = "create" + name.singularize().capitalize();

    if(this.model[name]) {
      forEach(this.model[name].items(), this[factoryMethodName], this);
    }

  },



  /**
    @description  renders it's template and sets the node
  */
  _render: function() {

    var node = document.createElement("div");
    node.innerHTML = this.html;
    this.node = node.childNodes[0];
    this._update();

  },



  /**
    @description  renders the given child into the specified or default role
                  of it's node
    @param        {object} child
  */
  _renderChild: function(child) {

      var container,
          role = child.role || "default";

      if (this.node.getAttribute("data-role") === role) {
        container = this.node;
      }
      else {
        container = this.node.querySelector('*[data-role="' + role + '"]');
      }
      if (typeof container === "undefined") {
        throw TypeError.spawn("ui/BaseComponent#render role (" + role + ") does not exist");
      }

      child.render();
      container.appendChild(child.node);

  },



  /**
    @description  renders all related children into the specified or default roles
                  of it's node
  */
  _renderChildren: function() {

    forEach(this["hasMany"], function(relation, name) {

      forEach(this[name].items(), this._renderChild, this);

    }, this);

    forEach(this["hasOne"], function(relation, name) {

      this._renderChild(relation);

    }, this);

  },



  /**
    @description  updates the html from the bound model
  */
  _update: function() {

    this.node.setAttribute("data-id", this.model.id);

    forEach(this.model, function(accessor, accessorName) {

      var node = this.node.querySelector("[data-" + accessorName + "]");
      if(node) {
        node.innerHTML = this.model[accessorName];
      }

    }, this);

  }

});
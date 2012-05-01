/**

  @module       app/ui/BaseComponent
  @description  base ui component

*/
//"use strict";

var Base    = require("lib/Base"),
    iter    = require("lib/iter"),
    utils   = require("lib/utils"),
    forEach = iter.forEach,
    imap    = iter.imap;


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

  hasMany: {

    children: Base

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

    if(this.children) {

      forEach(this.children.items(), function(child) {

        child.addEventListeners();

      });

    }
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

    forEach(this.events || {}, function(methodName, eventName) {

      if(typeof this[methodName] !== "function") {
        throw ReferenceError.spawn(methodName + ": is not a method on this object");
      }

      this.handlers[eventName] = this.node.on("click", eventName, this[methodName].bind(this));

    }, this);

  },


  _createEntities: function(name) {

    var factoryMethodName = "create" + name.singularize().capitalize();

    if(this.model[name]) {
      forEach(this.model[name].items(), this[factoryMethodName], this);
      forEach(this[name].items(), this._registerChild, this);
      // forEach(imap(this.model[name].items(), this[factoryMethodName].bind(this)), this._registerChild, this);
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
    @description  renders all registered children into the specified or default roles
                  of it's node
  */
  _renderChildren: function() {

    if (this.children) {
      forEach(this.children.items(), this._renderChild, this);
    }

  },


  /**
    @description  registers a set of child ui objects with this object
                  the objects in question are the related ui components created
                  in _createComponents
  */
  _registerChild: function(child) {

    this.children.add(child);
    child.parent = this;

  },


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
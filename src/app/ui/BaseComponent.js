/**

  @module       app/ui/BaseComponent
  @description  base ui component

*/
"use strict";

var Base    = require("lib/Base"),
    iter    = require("lib/iter"),
    forEach = iter.forEach,
    some    = iter.some;

//  create our prototype ui entity based on the eventMachine
module.exports = Base.create({

  //  properties

  accessors: {

    node: {
      type: document.ELEMENT_NODE
    }

  },


  hasMany: {

    children: module.exports

  },


  services: [],


  //  public


  /**
    @description  constructor
  */
  __init__: function(data) {

    Base.__init__.call(this, data);

  },


  //  public


  /*
    @description  sets the event listeners up on the entity
                  tells our children to do the same
  */
  addEventListeners: function() {

    this._addEventListeners();

    forEach(this.children.items(), function(child) {

      child.addEventListeners();

    });

  },



  /*
    @description  hides the ui entity
  */
  hide: function() {
    this.node.hide();
  },



  /*
    @description  registers a set of child ui objects with this object
    @param        {object} children in iterable set of children
  */
  registerChildren: function(children) {

    forEach(children, function(child, i) {

      this.children.add(child);
      child.parent = this;

    }, this);

  },



  /*
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


  /*
    @description  shows the ui entity
  */
  show: function() {
    this.node.show();
  },



  //  private



  /*
    @description  sets up our event listeners
  */
  _addEventListeners: function() {},


  /*
    @description  renders it's template and sets the node
  */
  _render: function() {

    var node = document.createElement("div");
    node.innerHTML = this.html;
    this.node = node.querySelector(" > *");

  },



  /*
    @description  renders the given child into the specified or default role
                  of it's node
    @param        {object} child
  */
  _renderChild: function(child) {

      var container,
          role = child.role || "default";

      if(this.node.getAttribute("data-role") === role) {
        container = this.node;
      }
      else {
        container = this.node.querySelector('*[data-role="' + role + '"]');
      }
      if(typeof container === "undefined") {
        throw Error.spawn(this.entityType + "#render region '" + region + "'' does not exist");
      }

      child.render();
      container.appendChild(child.node);

  },



  /*
    @description  renders all registered children into the specified or default roles
                  of it's node
  */
  _renderChildren: function() {

    forEach(this.children, this._renderChild, this);

  }


});
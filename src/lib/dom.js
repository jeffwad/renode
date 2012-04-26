/**

  @module       lib/dom
  @description  HTMLElement.prototype enhancements

*/
//"use strict";

var getRegEx, Observer;


getRegEx = (function() {

  var cache = {};

  return function(expr, modifiers) {
    modifiers = modifiers || "";
    var regEx = cache[expr + modifiers];
    if(!regEx) {
      regEx = cache[expr + modifiers] = new RegExp(expr, modifiers);
    }
    return regEx;
  };

}());




Observer = {

  __init__: function(obj, type, func) {

    this.obj = obj;
    this.type = type;
    this.func = func;

  },

  start: function() {
    if(!this.isActive) {
      this.obj.addEventListener(this.type, this.func, false);
      this.isActive = true;
    }
  },
  stop: function() {
    if(this.isActive === true) {
      this.obj.removeEventListener(this.type, this.func, false);
      this.isActive = false;
    }
  }

};


Object.defineProperties(HTMLElement.prototype, {

  on: {

    value: function() {

      var type = arguments[0], func = arguments[1], event, listener, observer;
      if (arguments.length === 3) {
        event = arguments[1];
        listener = arguments[2];
        func = function(e) {

          var node = e.target;
          while (node !== document.body) {
            if (node.getAttribute("data-event") === event) {
              e.boundTarget = node;
              listener.call(node, e);
              break;
            }
            node = node.parentNode;
          }
        };

      }

      observer = Observer.spawn(this, type, func);
      observer.start();
      return observer;
    }

  },



  hasAttr: {

    value: function (attr, operator, value) {

      var v, re;

      switch (true) {
        case operator === false || operator === undefined || operator === "":
          return !! this.hasAttribute(attr);
        case operator === "~=":
          return this.getAttribute(attr).indexOf(value) !== -1 ? true: false;
        default:
          if(operator === "=")  re = getRegEx('(^| |%20)' + value + '(%20| |$)');
          if(operator === "^=") re = getRegEx('^' + value);
          if(operator === "$=") re = getRegEx(value + '$');
          return !!re.test(this.getAttribute(attr));
      }

    }

  },

  hasClass: {

    value: function(c) {
      if(!this.hasAttr('class', '=', c)) {
        return false;
      }
      return true;
    }

  },

  addClass: {

    value: function(c) {
      var reClass = getRegEx("" + c + "", "gi");
      this.className += !this.className.match(reClass) ? ((this.className.length > 0) ? ' ' + c : c) : '';
      return this;
    }

  },

  removeClass: {

    value: function(c) {
      var reClass = getRegEx("^(.*?)" + c + "(.*)", "i");
      this.className = trim(this.className.replace(reClass,"$1$2")).replace('  ', ' ');
      return this;
    }

  },


  getStyle: {

    value: function(prop) {
      return document.defaultView.getComputedStyle(this , "").getPropertyValue(camelCase(prop));
    }

  },

  show: {

    value: function(type) {
      this.style.display = type || 'block';
      return this;
    }

  },

  hide: {

    value: function() {
      return this.show("none");
    }

  },

  toggle: {

    value: function(type) {
      type = type || 'block';
      this.style.display = (this.getStyle("display") === "none") ? type : "none";
      return this;
    }

  }

});

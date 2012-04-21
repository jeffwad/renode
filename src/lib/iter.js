/**
  @module   iteration methods
*/

var StopIteration = new Error();

function iterator(object){

  var it = false, i, keys;

  if (typeof object.next ==='function') {
    it = object;
  }
  else if (typeof object.__iterator__ === "function") {

    it = object.__iterator__();

  }
  else if(object.length) {

    i = 0;
    it = {
      next: function() {
        if (typeof object[i] !== 'undefined') {
          return [object[i], i++];
        }
        throw StopIteration;
      }
    };

  }
  else {

    try {

      keys = Object.keys(object);
      i = 0;

      it = {
        next: function() {
          if (typeof keys[i] !== 'undefined') {
            return [object[keys[i]], keys[i++]];
          }
          throw StopIteration;
        }
      };
    }
    catch(e) {
      it = false;
    }


  }

  return it;
}




function exhaust(object, func){

  var i, l, r, iterable;
  try {
    if (typeof object.length === 'number') {
      for(i = 0, l = object.length; i < l; i++) {
        func(object[i], i);
      }
    }
    else {
      iterable = iterator(object);
      if (iterable) {
        i = 0;
        while (true) {
          r = iterable.next();
          func(r[0], r[1]);
        }
      }
      else {
        for(i in object) {
          if(object.hasOwnProperty(i)) {
            func(object[i], i);
          }
        }
      }
    }
  }
  catch (e) {
    if (e !== StopIteration) {
      throw e;
    }

  }
}


function forEach(o, func, scope) {
  if(typeof o.forEach === 'function') {
    o.forEach(func, scope);
  }
  else {
    exhaust(o, function(value, key){
      func.call(scope, value, key);
    });
  }
}


function filter(o, func, scope) {
  if(typeof o.filter === 'function') {
    return o.filter(func, scope);
  }
  var ret = o.length ? [] : {};
  exhaust(o, function(value, key){
    if (func.call(scope, value, key)) {
      if(o.length) {
        ret.push(value);
      }
      else {
        ret[key] = value;
      }
    }
  });
  return ret;
}



function map(o, func, scope) {
  if(typeof o.map === 'function') {
    return o.map(func, scope);
  }
  var ret = o.length ? [] : {};
  exhaust(o, function(value, key){
    var r = func.call(scope, value, key);
    if(o.length) {
      ret.push(r);
    }
    else {
      ret[key] = r;
    }
  });
  return ret;
}



function some(o, func, scope) {
  if(typeof o.some === 'function') {
    return o.some(func, scope);
  }
  var ret = false;
  exhaust(o, function(value, key){
    if ((ret = func.call(scope, value, key))) {
      throw StopIteration;
    }
  });
  return ret;
}



function every(o, func, scope) {
  if(typeof o.every === 'function') {
    return o.every(func, scope);
  }
  var ret = true;
  exhaust(o, function(value, key){
    if (!(ret = func.call(scope, value, key))) {
      throw StopIteration;
    }
  });
  return ret;
}



function indexOf(o, val) {
  if(typeof o.indexOf === 'function') {
    return o.indexOf(val);
  }
  var ret = -1;
  exhaust(o, function(value, key){
    if (value === val) {
      ret = key;
      throw StopIteration;
    }
  });
  return ret;
}



function lastIndexOf(o, val){
  if(typeof o.lastIndexOf === 'function') {
    return o.lastIndexOf(val);
  }
  var ret = -1;
  exhaust(o, function(value, key){
    if (value === val) {
      ret = key;
    }
  });
  return ret;
}



function toArray(o){
  var ret = [];
  exhaust(o, function(v, k){
    ret.push(v);
  });
  return ret;
}



function reduce(ret, o, func){

  var iterable;

  if(typeof o === "function" && typeof func === "undefined") {

    iterable = iterator(ret);
    func = o;
    try {
      ret = iterable.next();
    }
    catch (e) {
      if (e === StopIteration) {
        throw new TypeError("reduce() of sequence with no initial value");
      }
      throw e;
    }
  }
  else {
    iterable = iterator(o);
  }

  exhaust(iterable, function(value, key){
    ret = func(ret, value, key);
  });
  return ret;
}



function sum(o, ret) {
  return reduce(ret || 0, o, function(ret, a){
    return (ret + a);
  });
}



function pluck(o, key){
  return map(o, function(v){
    return v[key];
  });
}



function chain(args) {

  if(args.length === 1) {
    return iterator(args[0]);
  }

  var iterables = map(args, iterator);
  return {
    next: function() {
      try {
        return iterables[0].next();
      }
      catch(e) {
        if (e !== StopIteration) {
          throw e;
        }
        if(iterables.length === 1) {
          throw StopIteration;
        }
        iterables.shift();
        return iterables[0].next();
      }
    }
  };
}

function imap(iterable, func){

  iterable = iterator(iterable);

  return {

    next: function () {

      return func.apply(null, iterable.next());

    }

  };
}

function range(start, stop, step) {

  var i = 0;

  step = step || 1;

  return {
    next: function() {
      var ret = start;
      if(start >= stop) {
        throw StopIteration;
      }
      start = start + step;
      return [ret, i++];
    }
  };
}


exports.forEach     = forEach;
exports.filter      = filter;
exports.map         = map;
exports.some        = some;
exports.every       = every;
exports.indexOf     = indexOf;
exports.lastIndexOf = lastIndexOf;
exports.toArray     = toArray;
exports.reduce      = reduce;
exports.sum         = sum;
exports.pluck       = pluck;
exports.chain       = chain;
exports.imap        = imap;
exports.range       = range;
exports.iterator    = iterator;

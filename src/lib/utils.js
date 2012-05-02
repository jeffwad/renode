/**

  @module       lib/utils
  @description  utils

*/
var iter         = require("lib/iter"),
    reduce       = iter.reduce,
    chain        = iter.chain,
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

/**
  @description  generates an id
*/
exports.generateId = function () {

  var uuid = [], r, i;

  // rfc4122 requires these characters
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4';

  // Fill in random data.  At i==19 set the high bits of clock sequence as
  // per rfc4122, sec. 4.1.5
  for (i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | Math.random()*16;
      uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
    }
  }

  return uuid.join('');
};


exports.merge = function(object, mixin) {
  return reduce({}, chain([object || {}, mixin || {}]), function(ret, value, key) {
    if(!ret.hasOwnProperty(key)) {
      ret[key] = value;
    }
    return ret;
  });
};


exports.concat = function(array, mixin) {
  return reduce([], chain([array || [], mixin || []]), function(ret, value, key) {
    if(ret.indexOf(value) === -1) {
      ret.push(value);
    }
    return ret;
  });
};

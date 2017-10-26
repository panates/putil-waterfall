/* putil-waterfall
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/putil-waterfall/
 */

function waterfall(funcs, callback) {

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!Array.isArray(funcs))
    throw new Error('Invalid argument. Array of functions are required as first argument');

  callback = callback || function() {};

  if (!funcs.length)
    return callback();

  var index = -1;
  const next = function(error) {
    if (error)
      return callback(error);

    const args = Array.prototype.slice.call(arguments, 1);
    index++;
    const fn = funcs[index];
    if (fn) {
      try {
        const o = fn.apply(fn, [function() {
          const args = arguments;
          setImmediate(function() {
            next.apply(null, args);
          });
        }].concat(args));
        // If promise
        if (o && typeof o === 'object' &&
            typeof o.then === 'function' && typeof o.catch === 'function') {
          o.catch(function(e) {
            callback.apply(callback, [e].concat(args));
          });
        }
      } catch (e) {
        callback.apply(callback, [e].concat(args));
      }
    } else
      callback.apply(callback, [undefined].concat(args));
  };

  next(null);
}

waterfall.every = function(arr, fn, callback) {

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!Array.isArray(arr))
    throw new Error('Invalid argument. Array value are required as first argument');

  callback = callback || function() {};

  var index = -1;
  const next = function(error) {
    if (error)
      return callback(error);
    if (!arr.length)
      return callback();
    const v = arr.shift();
    const args = Array.prototype.slice.call(arguments, 1);
    index++;
    setImmediate(function() {
      try {
        const o = fn.apply(fn, [next, v, index].concat(args));
        // If promise
        if (o && typeof o === 'object' &&
            typeof o.then === 'function' && typeof o.catch === 'function') {
          o.catch(function(e) {
            callback.apply(callback, [e, v, index].concat(args));
          });
        }
      } catch (e) {
        callback.apply(callback, [e, v, index].concat(args));
      }
    });
  };
  next(null);
};

module.exports = waterfall;

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

  callback = callback || function() {
      };

  if (!funcs.length)
    return callback();

  let index = -1;

  function next(error, ...args) {
    if (error) {
      callback(error);
      return;
    }
    index++;
    const fn = funcs[index];
    if (fn) {
      setImmediate(() => {
        try {
          const o = fn(next, ...args);
          if (o && (o instanceof Promise ||
              (typeof o.then === 'function' &&
              typeof o.catch === 'function'))) {
            o.catch(err => {
              callback(err);
            });
          }
        } catch (e) {
          callback(e);
        }
      });
    } else callback(undefined, ...args);
  }

  next(null);
}

module.exports = waterfall;

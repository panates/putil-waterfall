/* putil-waterfall
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

function waterfall(funcs, callback) {

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!Array.isArray(funcs))
    throw new Error('Invalid argument. Array of functions are required as first argument');

  if (!funcs.length)
    return callback ? callback() : undefined;

  let index = -1;
  callback = callback || function() {
      };

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
          fn(...args, next);
        } catch (e) {
          callback(e);
        }
      });
    } else callback(undefined, ...args);
  }

  next(null);
}

module.exports = waterfall;
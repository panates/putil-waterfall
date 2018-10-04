/* putil-waterfall
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/putil-waterfall/
 */
'use strict';

const promisify = require('putil-promisify');

/**
 *
 * @param {Array<Function>} funcs
 * @param {Function} [callback]
 * @return {Promise|null}
 */
function waterfall(funcs, callback) {

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!callback)
    return promisify.fromCallback((cb) => waterfall(funcs, cb));

  if (!Array.isArray(funcs))
    throw new Error('Invalid argument. Array of functions are required as first argument');

  if (!funcs.length)
    return callback();

  let index = -1;
  const next = (error, ...args) => {
    if (error)
      return callback(error);

    index++;
    const fn = funcs[index];
    if (fn) {
      try {
        const o = fn(
            (...args) => {
              setImmediate(() => next(...args));
            }, ...args);
        // If promise
        if (o && typeof o === 'object' &&
            typeof o.then === 'function' && typeof o.catch === 'function') {
          o.then((...args) => next(null, ...args))
              .catch(e => callback(e, ...args));
        }
      } catch (e) {
        callback(e, ...args);
      }
    } else
      callback(null, ...args);
  };

  next(null);
}

/**
 *
 * @param {Array<*>} values
 * @param {Function} fn
 * @param {Function} [callback]
 * @return {Promise|null}
 */
waterfall.every = function(values, fn, callback) {

  if (!Array.isArray(values))
    throw new Error('Invalid argument. Array value are required as first argument');

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!callback)
    return promisify.fromCallback((cb) => waterfall.every(values, fn, cb));

  callback = callback || (() => {});
  const arr = values.slice(0);
  let index = -1;
  const next = (...args) => {
    index++;
    const error = args[0];
    setImmediate(() => {
      if (error || !arr.length)
        return callback(...args);
      args.shift(); // remove error arg
      const v = arr.shift();
      try {
        const o = fn(next, v, index, ...args);
        if (promisify.isPromise(o)) {
          o.then(v => next(null, v))
              .catch((e) => callback(e, v, index, ...args));
        }
      } catch (e) {
        callback(e, v, index, ...args);
      }
    });
  };
  next(null);
};

module.exports = waterfall;

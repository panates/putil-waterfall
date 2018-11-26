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
        if (promisify.isPromise(o)) {
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
  return iterateValues(1, values, fn, callback);
};

/**
 *
 * @param {Array<*>} values
 * @param {Function} fn
 * @param {Function} [callback]
 * @return {Promise|null}
 */
waterfall.some = function(values, fn, callback) {
  return iterateValues(2, values, fn, callback);
};

/**
 *
 * @param {number} op
 * @param {Array} values
 * @param {Function} fn
 * @param {Function} callback
 * @return {Promise|undefined}
 */
function iterateValues(op, values, fn, callback) {

  if (!Array.isArray(values))
    throw new Error('Invalid argument. Array value required as first argument');

  if (callback && typeof callback !== 'function')
    throw new Error('Invalid callback argument');

  if (!callback)
    return promisify.fromCallback((cb) => iterateValues(op, values, fn, cb));

  values = values.slice(0);
  let index = -1;
  const next = (...args) => {
    index++;
    setImmediate(() => {
      if (args[0] || !values.length)
        return callback(...args);
      args.shift(); // remove error arg
      if (op === 2 && args[0]) {
        return callback(null, ...args);
      }
      const v = values.shift();
      const curIndex = index;
      const callNext = (...args) => {
        // Allow calling "next" once
        if (curIndex === index)
          next(...args);
      };
      try {
        const o = fn(callNext, v, index, ...args);
        if (promisify.isPromise(o)) {
          o.then(v => callNext(null, v))
              .catch((e) => callback(e, v, index, ...args));
        }
      } catch (e) {
        callback(e, v, index, ...args);
      }
    });
  };
  next();
}

module.exports = waterfall;

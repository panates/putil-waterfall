# putil-waterfall

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![DevDependencies][devdependencies-image]][devdependencies-url]

Simple, fast async waterfall NodeJs module for ES6.

Runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error.

## Installation

  - `npm install putil-waterfall --save`

## Usage

`waterfall(tasks, callback)`

**tasks:** An array of functions to run.

**callback:** An optional callback to run once all the functions have completed. This will be passed the results of the last task's callback.

Each function calls callback(err, result1, result2, ...) to step through next function in array. Callback's first argument must be error or null. After than first argument values are moved to next functions. If error value is not null, waterfall skips next functions and calls result callback. 

```javascript
const waterfall = require('putil-waterfall');
waterfall([
  function(next) {
    console.log('started');
    next(null, 1, 2);
  },
  function(next, arg1, arg2) {
    let sum = arg1 + arg2;
    console.log('Current sum: ', sum);
    next(null, sum, 3, 4);
  },
  function(next, arg1, arg2, arg3) {
    let sum = arg1 + arg2 + arg3;
    console.log('Current sum: ', sum);
    // arg1 now equals 'three'
    next(null, sum + 10);
  }
], function(err, result) {
  if (err)
    console.error(err);
  else
    console.log('Result: ', result);
});
```
Result output
```
started
Current sum:  3
Current sum:  10
Result:  20
```

## Node Compatibility

  - node `>= 6.x`;
  
### License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/putil-waterfall.svg
[npm-url]: https://npmjs.org/package/putil-waterfall
[travis-image]: https://img.shields.io/travis/panates/putil-waterfall/master.svg
[travis-url]: https://travis-ci.org/panates/putil-waterfall
[coveralls-image]: https://img.shields.io/coveralls/panates/putil-waterfall/master.svg
[coveralls-url]: https://coveralls.io/r/panates/putil-waterfall
[downloads-image]: https://img.shields.io/npm/dm/putil-waterfall.svg
[downloads-url]: https://npmjs.org/package/putil-waterfall
[gitter-image]: https://badges.gitter.im/panates/putil-waterfall.svg
[gitter-url]: https://gitter.im/panates/putil-waterfall?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[dependencies-image]: https://david-dm.org/panates/putil-waterfall/status.svg
[dependencies-url]:https://david-dm.org/panates/putil-waterfall
[devdependencies-image]: https://david-dm.org/panates/putil-waterfall/dev-status.svg
[devdependencies-url]:https://david-dm.org/panates/putil-waterfall?type=dev
[quality-image]: http://npm.packagequality.com/shield/putil-waterfall.png
[quality-url]: http://packagequality.com/#?package=putil-waterfall

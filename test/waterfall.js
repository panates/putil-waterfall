/* eslint-disable */
const assert = require('assert'),
    waterfall = require('../');

describe('Waterfall', function() {

  it('should waterfall success', function(done) {
    waterfall([
      function(callback) {
        callback(null, 1, 2);
      },
      function(arg1, arg2, callback) {
        callback(null, arg1 + arg2);
      },
      function(arg1, callback) {
        callback(null, arg1, 10);
      }
    ], function(err, result1, result2) {
      assert.ok(!err);
      assert.equal(result1, 3);
      assert.equal(result2, 10);
      done();
    });
  });

  it('should exit when passing error in callback', function(done) {
    waterfall([
      function(callback) {
        callback('Error');
      },
      function(callback) {
        callback(null);
      }
    ], function(err) {
      assert.ok(err);
      done();
    });
  });

});
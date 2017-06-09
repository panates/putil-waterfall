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

  it('should exit when array length is zero', function(done) {
    waterfall([], function(err) {
      assert.ok(!err);
      done();
    });
  });

  it('should do nothing when array length is zero, wo/callback', function(done) {
    waterfall([]);
    done();
  });

  it('should exit with error when fill error argument', function(done) {
    waterfall([
      function(callback) {
        callback(new Error('test'));
      }
    ], function(err) {
      assert.equal(err.message, 'test');
      done();
    });
  });

  it('should exit with error when throw error functions', function(done) {
    waterfall([
      function(callback) {
        throw new Error('test');
      }
    ], function(err) {
      assert.equal(err.message, 'test');
      done();
    });
  });

  it('should verify result callback is a function', function(done) {
    let ok;
    try {
      waterfall([
        function(callback) {
        }
      ], 5);
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

  it('should verify first argument is Array', function(done) {
    let ok;
    try {
      waterfall('--', () => {
      });
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

});
/* eslint-disable */
const assert = require('assert');
const waterfall = require('../');

describe('Waterfall', function() {

  it('should waterfall return result value', function(done) {
    waterfall([
      function(next) {
        next(null, 1, 2);
      },
      function(next, arg1, arg2) {
        next(null, arg1 + arg2);
      },
      function(next, arg1) {
        next(null, arg1, 10);
      }
    ], function(err, result1, result2) {
      assert.ok(!err);
      assert.equal(result1, 3);
      assert.equal(result2, 10);
      done();
    });
  });

  it('should waterfall return result value (Promise)', function(done) {
    waterfall([
      function(next) {
        next(null, 1, 2);
      },
      function(next, arg1, arg2) {
        next(null, arg1 + arg2);
      },
      function(next, arg1) {
        next(null, arg1, 10);
      }
    ]).then(result1 => {
      assert.equal(result1, 3);
      done();
    });
  });

  it('should exit when passing error in callback', function(done) {
    waterfall([
      function(next) {
        next('Error');
      },
      function(next) {
        next(null);
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
      function(next) {
        next(new Error('test'));
      }
    ], function(err) {
      assert.equal(err.message, 'test');
      done();
    });
  });

  it('should exit with error when throw error functions', function(done) {
    waterfall([
      function(next) {
        throw new Error('test');
      }
    ], function(err) {
      assert.equal(err.message, 'test');
      done();
    });
  });

  it('should verify result callback is a function', function(done) {
    var ok;
    try {
      waterfall([
        function(next) {
        }
      ], 5, 'callback');
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

  it('should verify first argument is Array', function(done) {
    var ok;
    try {
      waterfall('--', function() {});
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

  it('should catch promise rejects', function(done) {
    waterfall([
      function(next) {
        return new Promise(function(resolve, reject) {
          reject(new Error('test'));
        });
      }
    ], function(err) {
      assert.equal(err.message, 'test');
      done();
    });
  });

});
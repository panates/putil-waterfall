/* eslint-disable */
const assert = require('assert');
const waterfall = require('../');

describe('Waterfall.every', function() {

  it('should waterfall success', function(done) {
    let total = 0;
    waterfall.every([1, 2, 3, 4],
        function(next, val) {
          total += val;
          next(null);
        },
        function(err) {
          assert.ok(!err);
          assert.equal(total, 10);
          done();
        });
  });

  it('should waterfall success (Promise)', function() {
    let total = 0;
    return waterfall.every([1, 2, 3, 4],
        function(next, val) {
          total += val;
          next(null);
        }).then(() => {
      assert.equal(total, 10);
    });
  });

  it('should exit when array length is zero', function(done) {
    waterfall.every([], null, function(err) {
      assert.ok(!err);
      done();
    });
  });

  it('should array contain null and undefined items', function(done) {
    waterfall.every([null], function(next, val) {
      assert.equal(val, null);
      next();
    }, function(err) {
      assert.ok(!err, err);
      done();
    });
  });

  it('should do nothing when array length is zero, wo/callback', function(done) {
    waterfall.every([]);
    done();
  });

  it('should verify first argument is Array', function(done) {
    var ok;
    try {
      waterfall.every('--', function() {});
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

  it('should verify result callback is a function', function(done) {
    var ok;
    try {
      waterfall.every([1, 2, 3, 4],
          function(next) {
          }, 5);
    } catch (e) {
      ok = true;
    }
    assert.ok(ok);
    done();
  });

  it('should exit when passing error in callback', function(done) {
    waterfall.every([1, 2, 3, 4],
        function(next) {
          next(new Error('test'));
        },
        function(err) {
          assert.ok(err);
          assert.equal(err.message, 'test');
          done();
        });
  });

  it('should exit with error when throw error functions', function(done) {
    waterfall.every([1, 2, 3, 4],
        function(next) {
          throw new Error('test');
        },
        function(err) {
          assert.equal(err.message, 'test');
          done();
        });
  });

  if (Promise) {
    it('should catch promise rejects', function(done) {
      waterfall.every([1, 2, 3, 4],
          function(next) {
            return new Promise(function(resolve, reject) {
              reject(new Error('test'));
            });
          }, function(err) {
            assert.equal(err.message, 'test');
            done();
          });
    });
  }

});
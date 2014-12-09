'use strict';

var should = require('should');
var through = require('through2');
var assemble = require('assemble');
var push = require('./')(assemble);

describe('assemble-push', function () {
  assemble.create('item', function () {
    return {
      one: { path: 'one.hbs', content: '1' },
      two: { path: 'two.hbs', content: '2' },
      three: { path: 'three.hbs', content: '3' },
      four: { path: 'four.hbs', content: '4' }
    };
  });
  assemble.items();

  it('should add items to the stream by collection name', function (done) {
    var count = 0;
    push('items')
      .on('data', function () {
        count++;
      })
      .on('error', done)
      .on('end', function () {
        count.should.eql(4);
        done();
      });
  });

  it('should add items to the stream by collection object', function (done) {
    var count = 0;
    push(assemble.views.items)
      .on('data', function () {
        count++;
      })
      .on('error', done)
      .on('end', function () {
        count.should.eql(4);
        done();
      });
  });

  it('should pass items through when piped to', function (done) {
    var count = 0;
    var stream = through.obj();
    stream
      .pipe(push('items'))
      .on('data', function () {
        count++;
      })
      .on('error', done)
      .on('end', function () {
        count.should.eql(6);
        done();
      });

    stream.write({path: 'foo'});
    stream.write({path: 'bar'});
    stream.end();
  });

  it('should read items from the stream', function (done) {
    var count = 0;
    push('items')
      .pipe(through.obj(function (file, enc, cb) {
        count++;
        cb();
      }, function (cb) {
        count.should.eql(4);
        done();
      }))
      .on('error', done);
  })
});
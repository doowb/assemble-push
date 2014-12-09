/*!
 * assemble-push <https://github.com/doowb/assemble-push>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Return a function that will create a stream for pushing template
 * objects onto a stream.
 *
 * ```js
 * var assemble = require('assemble');
 * var push = require('assemble-push')(assemble);
 * ```
 * 
 * @param  {Object}   `app` An application inherited from `template`.
 * @return {Function} Factory function used to build a stream.
 * @api public
 * @name  assemble-push
 */

module.exports = function (app) {

  /**
   * Return a stream that will push a collection of templates onto a stream.
   *
   * ```js
   * // When you have a `posts` template type,
   * // push the posts into the stream to render
   * assemble.task('build-posts', function () {
   *   push('posts')
   *     .pipe(assemble.dest('_gh_pages/posts'));
   * });
   * ```
   * 
   * @param  {String} `collection` Name of the collection to push into the stream.
   * @return {Stream} Stream used in piping objects through.
   * @api public
   * @name  push
   */
  
  return function push (collection) {
    setRenderables(collection);
    
    var tutils = require('template-utils');
    var through = require('through2');

    var source = through.obj();
    var pass = through.obj();
    source.pipe(pass);

    var obj = app.views[collection] || {};
    process.nextTick(function () {
      Object.keys(obj).forEach(function (key) {
        source.write(tutils.toVinyl(obj[key]));
      });
      source.end();
    });
    return pass;
  };

  function setRenderables (collection) {
    var session = app.session;
    var renderables = session.get('renderables') || [];
    renderables.push(collection);
    session.set('renderables', renderables);
  }
};
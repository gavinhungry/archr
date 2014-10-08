/**
 * archur - Search for and download Arch Linux packages
 * https://github.com/gavinhungry/archur
 */

(function() {
  'use strict';

  var Q = require('q');
  var request = require('request');
  var sprintf = require('sprintf');

  // Arch Linux JSON API
  var ARCH_URI = 'https://www.archlinux.org/packages';
  var PKG_URI = ARCH_URI + '/%s/%s/%s/json'; // repo/arch/pkg
  var SEARCH_URI = ARCH_URI + '/search/json/?repo=%s&arch=%s&q=%s';

  var archur = module.exports;

  /**
   * Get default search arguments
   *
   * @param {String} [repo] - repository name (lowercase)
   * @param {String} [arch] - system architecture
   * @return {Object}
   */
  var def = function(repo, arch) {
    return {
      repo: repo || 'core',
      arch: arch || 'x86_64'
    };
  };

  /**
   * Capitalize dash seperated strings
   *
   * @example
   * caps('foo-bar'); // "Foo-Bar"
   *
   * @param {String} str - input string
   * @return {String} str with capitalized words
   */
  var caps = function(str) {
    return str.split('-').map(function(sub) {
      return sub[0].toUpperCase() + sub.slice(1);
    }).join('-');
  };

  /**
   * Get remote JSON
   *
   * @param {String} uri
   * @return {Promise} to resolve to parsed Object, or reject with error
   */
  var json = function(uri) {
    var d = Q.defer();

    request(uri, function(error, response, data) {
      if (error || response.statusCode !== 200) {
        return d.reject(error);
      }

      try {
        var obj = JSON.parse(data);
      } catch(err) {
        return d.reject(err);
      }

      d.resolve(obj);
    });

    return d.promise;
  };

  /**
   * Search for packages
   *
   * @param {String} query - package query
   * @param {String} [repo] - repository name (lowercase), defaults to core
   * @param {String} [arch] - system architecture, defaults to x86_64
   * @return {Promise} to resolve to results, or reject with error
   */
  archur.search = function(query, repo, arch) {
    var args = def(repo, arch);
    var uri = sprintf(SEARCH_URI, caps(args.repo), args.arch, query);

    return json(uri).then(function(obj) {
      return obj.results;
    });
  };

  /**
   * Get data for a single package
   *
   * @param {String} pkg - package name
   * @param {String} [repo] - repository name (lowercase), defaults to core
   * @param {String} [arch] - system architecture, defaults to x86_64
   * @return {Promise} to resolve to result, or reject with error
   */
  archur.package = function(pkg, repo, arch) {
    var args = def(repo, arch);
    var uri = sprintf(PKG_URI, caps(args.repo), args.arch, pkg);

    return json(uri);
  };

})();

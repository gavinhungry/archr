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
   * Capitalize dash seperated strings
   *
   * @example
   * capitalize('foo-bar'); // "Foo-Bar"
   *
   * @param {String} str - input string
   * @return {String} str with capitalized words
   */
  var capitalize = function(str) {
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
   * @param {String} pkg - package name
   * @param {String} [repo] - repository name (lowercase), defaults to core
   * @param {String} [arch] - architecture, defaults to x86_64
   * @return {Promise} to resolve to results, or reject with error
   */
  archur.search = function(pkg, repo, arch) {
    repo = repo || 'core';
    arch = arch || 'x86_64';

    var uri = sprintf(SEARCH_URI, capitalize(repo), arch, pkg);

    return json(uri).then(function(obj) {
      return obj.results;
    });
  };

})();

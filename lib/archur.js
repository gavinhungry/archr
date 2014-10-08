/**
 * archur - Search for and download Arch Linux packages
 * https://github.com/gavinhungry/archur
 */

(function() {
  'use strict';

  var archur = module.exports;

  var Q = require('q');
  var request = require('request');
  var sprintf = require('sprintf');

  // Arch Linux JSON API
  var ARCH_URI = 'https://www.archlinux.org/packages';
  var PKG_URI = ARCH_URI + '/%s/%s/%s/json'; // repo/arch/pkg
  var SEARCH_URI = ARCH_URI + '/search/json/?repo=%s&arch=%s&q=%s';

  archur.defaults = {
    repo: 'core',
    arch: 'x86_64',

    // same format as /etc/pacman.d/mirrorlist
    mirror: 'https://mirrors.kernel.org/archlinux/$repo/os/$arch'
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
   * @param {String} [repo] - repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to results, or reject with error
   */
  archur.search = function(query, repo, arch) {
    repo = repo || archur.defaults.repo;
    arch = arch || archur.defaults.arch;

    var uri = sprintf(SEARCH_URI, caps(repo), arch, query);
    return json(uri).then(function(obj) {
      return obj.results;
    });
  };

  /**
   * Get data for a single package
   *
   * @param {String} pkg - package name
   * @param {String} [repo] - repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to result, or reject with error
   */
  archur.package = function(pkg, repo, arch) {
    repo = repo || archur.defaults.repo;
    arch = arch || archur.defaults.arch;

    var uri = sprintf(PKG_URI, caps(repo), arch, pkg);
    return json(uri);
  };

  /**
   * Get a download URI for a package result
   *
   * @param {String} pkg - package name
   * @return {Promise} to resolve to download URI, or reject with error
   */
  archur.download = function(pkg, repo, arch) {
    return archur.package(pkg, repo, arch).then(function(obj) {
      return archur.defaults.mirror
        .replace('$repo', obj.repo)
        .replace('$arch', obj.arch)
        + '/' + obj.filename;
    });
  };

})();

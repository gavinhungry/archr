/**
 * archr - Search for and download Arch Linux packages
 * https://github.com/gavinhungry/archr
 */

(function() {
  'use strict';

  var archr = module.exports;

  var fs = require('fs');
  var Q = require('q');
  var request = require('request');
  var sprintf = require('sprintf');

  // Arch Linux JSON API
  var ANY_ARCH = 'i686';
  var ARCH_URI = 'https://www.archlinux.org/packages';
  var MIRRORLIST = '/etc/pacman.d/mirrorlist';
  var PKG_URI = ARCH_URI + '/%s/%s/%s/json/'; // repo/arch/pkgname
  var SEARCH_URI = ARCH_URI + '/search/json/?arch=any&arch=%s&q=%s'; // &repo=

  archr.defaults = {
    repo: 'core',
    arch: 'x86_64'
  };

  try {
    var mirrorlist = fs.readFileSync(MIRRORLIST).toString();

    var match = mirrorlist.match(new RegExp(/^Server\s*=\s*(.*)$/m));
    archr.defaults.mirror = match[1];
  } catch(e) {
    archr.defaults.mirror = 'https://mirrors.kernel.org/archlinux/$repo/os/$arch';
  }

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

      var obj;

      try {
        obj = JSON.parse(data);
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
   * @param {String} [repo] - package repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to results, or reject with error
   */
  archr.search = function(query, repo, arch) {
    arch = arch || archr.defaults.arch;

    var uri = sprintf(SEARCH_URI, arch, query);
    if (repo) { uri += '&repo=' + caps(repo); }

    return json(uri).then(function(obj) {
      return obj.results;
    });
  };

  /**
   * Get data for a single package
   *
   * @param {String} pkgname - package name
   * @param {String} [repo] - package repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to result, or reject with error
   */
  archr.package = function(pkgname, repo, arch) {
    repo = repo || archr.defaults.repo;
    arch = arch || archr.defaults.arch;

    var uri = sprintf(PKG_URI, caps(repo), arch, pkgname);
    return json(uri).fail(function() {
      if (arch !== 'any') {
        uri = sprintf(PKG_URI, caps(repo), 'any', pkgname);
        return json(uri);
      }
    });
  };

  /**
   * Get a download URI
   *
   * @param {String} pkgname - package name
   * @return {Promise} to resolve to download URI, or reject with error
   */
  archr.download = function(pkgname, repo, arch) {
    return archr.package(pkgname, repo, arch).then(archr.uri);
  };

  /**
   * Get a download URI from a package object
   *
   * @param {Object} pkg - package object
   * @return {String} download URI
   */
  archr.uri = function(pkg) {
    return archr.defaults.mirror
      .replace('$repo', pkg.repo)
      .replace('$arch', pkg.arch === 'any' ? ANY_ARCH : pkg.arch) +
      '/' + pkg.filename;
  };

})();

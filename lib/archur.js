/**
 * archur - Search for and download Arch Linux packages
 * https://github.com/gavinhungry/archur
 */

(function() {
  'use strict';

  var Q = require('q');
  var request = require('request');

  // Arch Linux JSON API
  const ARCH_URI = 'https://www.archlinux.org/packages';
  const PKG_URI = ARCH_URI + '/%s/%s/%s/json'; // repo/arch/pkg
  const SEARCH_URI = ARCH_URI + '/search/json/?repo=%s&arch=%s&q=%s';

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
   * Search for packages
   *
   * @param {String} pkg - package name
   * @param {String} [repo] - repository name (lowercase), defaults to core
   * @param {String} [arch] - architecture, defaults to x86_64
   * @return {Promise} resolving to JSON results, or rejecting with error
   */
  archur.search = function(pkg, repo, arch) {

  };

})();

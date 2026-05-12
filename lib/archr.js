/**
 * archr - Search for and download Arch Linux packages
 * https://github.com/gavinhungry/archr
 */

(() => {
  'use strict';

  const fs = require('fs');

  // Arch Linux JSON API
  const ARCH_URI = 'https://www.archlinux.org/packages';
  const MIRRORLIST = '/etc/pacman.d/mirrorlist';

  let archr = module.exports;

  archr.defaults = {
    repo: 'core',
    arch: 'x86_64'
  };

  try {
   let mirrorlist = fs.readFileSync(MIRRORLIST).toString();

   let match = mirrorlist.match(new RegExp(/^Server\s*=\s*(.*)$/m));
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
 let caps = str => {
    return str.split('-')
      .map(sub => sub[0].toUpperCase() + sub.slice(1))
      .join('-');
  };

  /**
   * Get remote JSON
   *
   * @param {String} uri
   * @return {Promise} to resolve to parsed Object
   */
 let json = async uri => {
    let response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  };

  /**
   * Search for packages
   *
   * @param {String} query - package query
   * @param {String} [repo] - package repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to an array of package results
   */
  archr.search = async (query, repo, arch) => {
    arch = arch || archr.defaults.arch;

   let uri = `${ARCH_URI}/search/json/?arch=any&arch=${arch}&q=${query}`;
    if (repo) {
      uri += '&repo=' + caps(repo);
    }

    let { results } = await json(uri);
    return results;
  };

  /**
   * Get data for a single package
   *
   * @param {String} pkgname - package name
   * @param {String} [repo] - package repository name
   * @param {String} [arch] - system architecture
   * @return {Promise} to resolve to a single package result
   */
  archr.package = (pkgname, repo, arch) => {
    repo = repo || archr.defaults.repo;
    arch = arch || archr.defaults.arch;

   let uri = `${ARCH_URI}/${caps(repo)}/${arch}/${pkgname}/json/`;
    return json(uri).catch(() => {
      if (arch !== 'any') {
        uri = `${ARCH_URI}/${caps(repo)}/any/${pkgname}/json/`;
        return json(uri);
      }
    });
  };

  /**
   * Get a download URI
   *
   * @param {String} pkgname - package name
   * @return {Promise} to resolve to download URI
   */
  archr.uri = async (pkgname, repo, arch) => {
    let pkg = await archr.package(pkgname, repo, arch);
    return archr.packageUri(pkg);
  };

  /**
   * Get a download URI from an existing package object
   *
   * @param {Object} pkg - package object
   * @return {String} download URI
   */
  archr.packageUri = pkg => {
    return archr.defaults.mirror
      .replace('$repo', pkg.repo)
      .replace('$arch', pkg.arch === 'any' ? archr.defaults.arch : pkg.arch) +
      '/' + pkg.filename;
  };
})();

archur
======
Search for and download [Arch Linux](https://www.archlinux.org) packages.
Provides both a module and a command line tool.


Installation
------------

    npm install archur # install with -g for command-line usage


Usage
-----

    var archur = require('archur');

See `archur.defaults` for configurable defaults.

### Search

    // archur.search(query, [repo], [arch]) -> {Promise}

    archur.search('linux').then(function(pkgs) {
      // pkgs is an array of package data objects
    });


### Individual Package

    // archur.package(pkgname, [repo], [arch]) -> {Promise}

    archur.package('linux', 'testing').then(function(pkg) {
      // pkg is a single package data object
    });


### Download URI

    // archur.download(pkgname, [repo], [arch]) -> {Promise}

    archur.download('linux', 'testing').then(function(uri) {
      // uri is a URI to download testing/linux
    });


Command Line
------------

    -h, --help             output usage information
    -V, --version          output the version number
    -s, --search           search for all packages
    -d, --download         download package
    -p, --package <pkg>    package name or query
    -r, --repo <repo>      package repository name [core]
    -a, --arch <arch>      system architecture [x86_64]
    -c, --concurrency <n>  number of concurrency downloads [1]
    -D, --dir <dir>        path to save downloads


### Examples

Search for keyword on all repos:

    $ archur -sp linux

Search for keyword on a specific repo:

    $ archur -sp linux -r testing # or '-sp testing/linux'

Download package (change mirror in `archur.defaults`):

    $ archur -dp testing/linux


License
-------
Released under the terms of the
[MIT license](http://tldrlegal.com/license/mit-license). See **LICENSE**.

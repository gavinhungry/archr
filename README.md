archr
=====
Search for and download [Arch Linux](https://www.archlinux.org) packages.
Provides both a module and a command line tool.

Installation
------------

    $ npm install archr

Usage
-----

```javascript
var archr = require('archr');
```

See `archr.defaults` for configurable defaults.

### Search

```javascript
// archr.search(query, [repo], [arch]) -> {Promise}

archr.search('linux').then(function(pkgs) {
  // pkgs is an array of package data objects
});
```

### Individual Package

```javascript
// archr.package(pkgname, [repo], [arch]) -> {Promise}

archr.package('linux', 'testing').then(function(pkg) {
  // pkg is a single package data object
});
```

### Download URI

```javascript
// archr.uri(pkgname, [repo], [arch]) -> {Promise}

archr.uri('linux', 'testing').then(function(uri) {
  // uri is a URI to download testing/linux
});
```

Command Line
------------

    Commands:

      search <query>
      download <pkg> [pkg...]

    Options:

      -h, --help         output usage information
      -V, --version      output the version number
      -a, --arch <arch>  system architecture
      -d, --dir <dir>    path to save downloads
      -q, --quiet        no version output

### Examples

Search for keyword on all repos:

    $ archr search linux

Search for keyword on a specific repo:

    $ archr search testing/linux

Download package (change mirror in `archr.defaults`):

    $ archr download testing/linux

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.

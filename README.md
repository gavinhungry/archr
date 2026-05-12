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
const archr = require('archr');
```

See `archr.defaults` for configurable defaults.

### Search

```javascript
// archr.search(query, [repo], [arch]) -> {Promise}

let pkgs = await archr.search('linux');
// pkgs is an array of package data objects
```

### Individual Package

```javascript
// archr.package(pkgname, [repo], [arch]) -> {Promise}

let pkg = await archr.package('linux', 'testing');
// pkg is a single package data object
```

### Download URI

```javascript
// archr.uri(pkgname, [repo], [arch]) -> {Promise}

let uri = await archr.uri('linux', 'testing');
// uri is a URI to download testing/linux
```

Command Line
------------

    Usage: archr [options] [command]

    Options:

      -V, --version            output the version number
      -a, --arch <arch>        system architecture [x86_64]
      -d, --dir <dir>          path to save downloads
      -i, --ignore-cert        ignore certificate errors
      -s, --signatures         also download signature files
      -q, --quiet              no version output
      -h, --help               display help for command

    Commands:

      search <query>
      download <pkg> [pkg...]
      help [command]           display help for command

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

# osm-pbf-to-mddf

convert open street map protocol buffers to
[mddf](https://github.com/substack/mddf)

# example

``` js
#!/usr/bin/env node

var fs = require('fs');
var fd = fs.openSync(argv.outfile, 'w+');
var stat = fs.fstatSync(fd);

var mddf = require('mddf');
var df = mddf({
    blksize: argv.blksize,
    dim: 3, size: 0,
    read: fs.read.bind(null, fd),
    write: fs.write.bind(null, fd)
});

var osmddf = require('osm-pbf-to-mddf')(df);
fs.createReadStream('auckland.osm.pbf').pipe(osmddf);
```

# methods

``` js
var osmddf = require('osm-pbf-to-mddf')
```

## var w = osmddf(df)

Create a writable stream `w` that will write an incoming open street map
protobuf file to the mddf index `df`.

# usage

```
usage: osm-pbf-to-mddf OPTIONS

OPTIONS are:

  -i INFILE   Read from INFILE, an open street map pbf file.
  -o OUTFILE  Write to OUTFILE, an mddf index.
  -b BLKSIZE  Block size to use for mddf index. Default: 4096.

```

# install

To get the library, do:

```
npm install osm-pbf-to-mddf
```

To get the command-line program, do:

```
npm install -g osm-pbf-to-mddf
```

# license

MIT

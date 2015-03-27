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

var osmdf = require('../')(df);
fs.createReadStream('auckland.osm.pbf').pipe(osmdf);

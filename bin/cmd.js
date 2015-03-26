var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
    alias: {
        i: 'infile',
        o: 'outfile',
        b: 'blksize',
        h: 'help'
    },
    default: {
        blksize: 4096
    }
});
var fs = require('fs');
var path = require('path');

if (argv.help) {
    return fs.createReadStream(path.join(__dirname, 'usage.txt'))
        .pipe(process.stdout)
    ;
}

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

fs.createReadStream(argv.infile)
    .pipe(osmdf)
;

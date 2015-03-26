var ecef = require('geodetic-to-ecef');
var through = require('through2');
var writeonly = require('write-only-stream');
var OSM  = require('osm-pbf-parser');

module.exports = function (df) {
    var osm = OSM();
    var items = {};
    var center = [0,0,0];
    
    osm.pipe(through.obj(write));
    var w = writeonly(osm);
    return w;
    
    function write (ilist, enc, next) {
        var pending = 0;
        function advance (err) {
            if (err) w.emit('error', err)
            else if (--pending === 0) next()
        }
        
        for (var i = 0; i < ilist.length; i++) {
            var item = ilist[i];
            if (item.type === 'node') {
                items[item.id] = ecef(item.lat, item.lon);
            }
            else if (item.type === 'way') {
                var len = item.refs.length;
                var data = Buffer(len * 3 * 4);
                center[0] = 0;
                center[1] = 0;
                center[2] = 0;
                
                for (var j = 0; j < len; j++) {
                    var r = items[item.refs[j]];
                    center[0] += r[0] / len;
                    center[1] += r[1] / len;
                    center[2] += r[2] / len;
                    
                    data.writeFloatBE(r[0], j*4*3+0);
                    data.writeFloatBE(r[1], j*4*3+4);
                    data.writeFloatBE(r[2], j*4*3+8);
                }
                pending ++;
                df.put(center, data, advance);
            }
        }
        if (pending === 0) next();
    }
};

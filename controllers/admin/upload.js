'use strict';
// var parse = require('co-body');
var parse = require('co-busboy');
var os = require('os');
var path = require('path');
var fs = require('co-fs');
var saveTo = require('save-to');

module.exports = function *() {
    // parse the multipart body
    var savedFile = '';
    var uuid = uid();
    var parts = parse(this, {
        autoFields: true // saves the fields to parts.field(s)
    });

    // create a temporary folder to store files
    var tmpdir = path.join(__dirname + "../../../public/upload", uuid);

    // make the temporary directory
    yield fs.mkdir(tmpdir);

    // list of all the files
    var files = [];
    var file;

    // yield each part as a stream
    var part;
    while (part = yield parts) {
        // filename for this part
        savedFile = uuid + '/' + part.filename;
        files.push(file = path.join(tmpdir, part.filename));
        // save the file
        yield saveTo(part, file);
    }

    // return all the filenames as an array
    // after all the files have finished downloading
    // console.log(savedFile);
    this.body = savedFile;
};

function uid() {
    return Math.random().toString(36).slice(2);
}
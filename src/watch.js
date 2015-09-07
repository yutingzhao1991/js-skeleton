'use strict';

var watch = require('watch')
var spawn = require('child_process').spawn

watch.watchTree(__dirname + '/../workspace', function (f, curr, prev) {
    if (typeof f !== 'string') {
        return
    }
    var temp = f.match(/workspace\/([\w-_]+)\/app/)
    if (temp && temp.length == 2) {
        var name = temp[1]
        var builder = spawn('node', [__dirname + '/build.js', name])
        builder.stdout.on('data', function (data) {
            console.log('' + data)
        })

        builder.stderr.on('data', function (data) {
            console.error('buiding error: ' + data);
        })

        builder.on('close', function (code) {
            console.log('end buiding with code ' + code);
        })
    }
})
'use strict';

var watch = require('watch')
var spawn = require('child_process').spawn
var isDebug = false
process.argv.forEach(function(a) {
    if (a == '--debug') {
        isDebug = true
    }
})

watch.watchTree(__dirname + '/../workspace', function (f, curr, prev) {
    if (typeof f !== 'string') {
        return
    }
    var temp = f.match(/workspace\/(.+)\/app/)
    if (temp && temp.length == 2) {
        var name = temp[1]
        var params = [__dirname + '/build.js', name]
        if (isDebug) {
            params.push('--debug')
        }
        var builder = spawn('node', params)
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
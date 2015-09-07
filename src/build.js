'use strict';

var fs = require('fs')

var TMPL = fs.readFileSync(__dirname + '/skeleton.tmpl') + ''
var target = process.argv[2]

// 初始化works文件夹
try {
    // Query the entry
    var stats = fs.lstatSync(__dirname + '/../works')
    // Is it a directory?
    if (stats.isDirectory()) {
        // Yes it is
    } else {
        console.log('works is not a directory')
        process.exit(1)
    }
} catch (e) {
    // create
    fs.mkdirSync(__dirname + '/../works')
}

if (target) {
    building(target)
} else {
    console.log('building all')
    // 没有目标则默认build全部
    var names = fs.readdirSync(__dirname + '/../workspace')
    names.forEach(function(n) {
        var stats = fs.lstatSync(__dirname + '/../workspace/' + n)
        if (stats.isDirectory()) {
            building(n)
        }
    })
}

function building(name) {
    console.log('start building ' + name)
    var css = getResource(name, 'css')
    var js = getResource(name, 'js')
    var html = getResource(name, 'html')
    var output = TMPL.replace('{{title}}', name)
                     .replace('{{css}}', css)
                     .replace('{{js}}', js)
                     .replace('{{html}}', html)
    fs.writeFile(__dirname + '/../works/' + name + '.html', output, function(e) {
        if (e) {
            console.error(e)
        } else {
            console.log('success to write ' + name + '.html')
        }
    })
}

function getResource(name, type) {
    var ret = ''
    try {
        ret = fs.readFileSync(__dirname + '/../workspace/' + name + '/app.' + type) + ''
    } catch (e) {
        ret = ''
    }
    return ret
}

function buildConfig() {
    // TODO
}
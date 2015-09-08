'use strict';

var fs = require('fs')

var TMPL = fs.readFileSync(__dirname + '/skeleton.tmpl') + ''
var DEBUG_TMPL = fs.readFileSync(__dirname + '/debug.tmpl') + ''
var target = process.argv[2]
var isDebug = false
process.argv.forEach(function(a) {
    if (a == '--debug') {
        isDebug = true
    }
})

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

if (target && target != '--debug') {
    building(target)
} else {
    console.log('building all')
    // 没有目标则默认build全部
    buildAll()
}

function buildAll() {
    var names = fs.readdirSync(__dirname + '/../workspace')
    var demoList = []
    names.forEach(function(n) {
        var stats = fs.lstatSync(__dirname + '/../workspace/' + n)
        if (stats.isDirectory()) {
            building(n)
            demoList.push(n)
        }
    })
    var config = {
        demoList: demoList
    }
    fs.writeFile(__dirname + '/../works/config.json', JSON.stringify(config), function(e) {
        if (e) {
            console.error(e)
        } else {
            console.log('success to write config.json')
        }
    })
}

function building(name) {
    console.log('start building ' + name)
    var css = getResource(name, 'css')
    var js = getResource(name, 'js')
    var html = getResource(name, 'html')
    var T = isDebug ? DEBUG_TMPL : TMPL
    var output = T.replace(/\{\{name\}\}/g, name)
                     .replace('{{html}}', html)
    if (!isDebug) {
        output = output.replace('{{css}}', css)
                       .replace('{{js}}', js)
    }
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
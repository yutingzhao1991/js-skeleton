'use strict';

var fs = require('fs')

var TMPL = fs.readFileSync(__dirname + '/skeleton.tmpl') + ''
var target = process.argv[1]

if (target) {
    building(target)
} else {
    // 没有目标则默认build全部
}

function building(name) {
    var css = fs.readFileSync(__dirname + '../') + ''
}
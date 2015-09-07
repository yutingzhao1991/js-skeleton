var options = {
    height: 350,
    width: 850,
    data: [{
        name: 'IOS',
        value: [323, 4343, 6847, 43434]
    }, {
        name: 'Andriod',
        value: [323, 4343, 4847, 434545]
    }, {
        name: 'PC',
        value: [323, 4343, 9847, 545322]
    }],
    areaTitle: ["UV -(每用户VV)-> VV","VV -(每VV曝光)-> 曝光", "曝光 -(ECPM)-> 收入"],
    container: document.getElementById('container'),
    conversionType: ['raw', 'percentage', 'cpm']
}

$(function() {

    var data = options.data
    var height = options.height
    var leftLabelWidth = 55
    // 这个width不包含左侧的label占位的宽度
    var width = options.width - leftLabelWidth
    // 计算每一项数据的总数，放入到 totalValue 中, drawedValue 存放的是已经绘制到图中的值，默认是0
    var totalValue = []
    var drawedValue = []
    var valueLength = _.max(data, function(item) { return item.value.length }).value.length
    for (var i = 0; i < valueLength; i++) {
      totalValue.push(0)
      drawedValue.push(0)
    }
    data.forEach(function(item) {
      item.value.forEach(function(v, index) {
        totalValue[index] += v
      })
    })

    // 计算所有点的坐标，改图是由 (data.length + 1) * valueLength 个点位构成的矩形图
    var points = []
    for (var i = 0; i <= data.length; i++) {
      points.push([])
      for (var j = 0; j < valueLength; j++) {
        var p = {
          x: width * (j / (valueLength - 1)),
          y: height * (drawedValue[j] / totalValue[j])
        }
        if (i < data.length) {
          data[i].value[j] = data[i].value[j] || 0
          drawedValue[j] += data[i].value[j]
          // 每个点在它那一列中占的比例,最后一个点没有比例
          p.rate = data[i].value[j] / totalValue[j]
          p.value = data[i].value[j]
        }
        points[i].push(p)
      }
    }

    // 计算所有的area的坐标，每个area是一个梯形区域，由四个点构成
    // 一共有 data.length * valueLength - 1 个区域
    var computedAreaData = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < valueLength - 1; j++) {
        var ps = [points[i][j], points[i][j+1], points[i+1][j+1], points[i+1][j]]
        // 计算转化率，转化率的值是第二个点/第一个点
        var conversion = ps[1].value / ps[0].value;
        var conversionType = options.conversionType[j]
        var conversionText = getConversionText(conversion, conversionType)
        computedAreaData.push({
          points: ps, // 四个点
          name: data[i].name,
          conversion: conversion,
          conversionText: conversionText,
          color: getColor(i)
        })
      }
    }

    // 初始化图表和各个区域
    var chart = d3.select(options.container).append('svg')
      .attr('width', width + leftLabelWidth).attr('height', height)
      .attr('preserveAspectRatio', 'xMidYMid') // 响应式
      .attr('viewBox', [0, 0, width, height].join(' '))
    var drawArea = chart.append('g')
    // 偏移出左侧的label位置
    drawArea.attr('transform', 'translate(' + leftLabelWidth + ',0)')
    var areas = drawArea.selectAll('g').data(computedAreaData).enter().append('g')

    // 绘制区域
    areas.append('path')
      .style('fill', function(d) { if (d.hover) {return '#000'} return d.color })
      .attr('d', function(d) {
        // [{x, y}, {x, y}, ...]
        // => Mx,yLx2,y2Z
        var ret = "M" + d.points.map(function(p, index) {
          // 周围出一些空间
          var x = (index == 1 || index == 2 ? p.x - 2 : p.x)
          var y = (index > 1 ? p.y - 2 : p.y)
          return x + ',' + y
        }).join("L") + "Z"
        return ret
      })

    // 绘制label
    chart.selectAll('text').data(data).enter()
      .append('text')
      .text(function(d, index) {
        var rate = points[index][0].rate
        if (rate < 0.05) {
          // 小于 5% 默认不展示
          return ''
        }
        return d.name
      })
      .attr('x', leftLabelWidth - 5)
      .attr('y', function(d, index) {
        // 取第一个点的位置
        var y = points[index][0].y
        return y >= height - 12 ? y : y + 12
      })
      .style({
        'text-anchor': 'end',
        'fill': '#83ccf5',
        'font-size': '10px'
      })

    // 绘制百分比文字
    var pointsWithText = []
    for (var i = 0; i < points.length - 1; i ++) {
      pointsWithText = pointsWithText.concat(points[i])
    }
    drawArea.selectAll('text').data(pointsWithText).enter()
      .append('text')
      .text(function(d) {
        if (!d.hover && d.rate < 0.05) {
          // 小于 5% 默认不展示
          return ''
        }
        return (d.rate * 100).toFixed(1) + '%'
      })
      .attr('x', function(d) {
        return d.x >= width ? d.x - 80 : d.x
      })
      .attr('y', function(d) {
        return d.y >= height - 12 ? d.y : d.y + 12
      })
      .style('fill', '#000')
      .style('font-size', '10px')

    // 添加转化率
    areas.append('text')
      .text(function(d) {
        if (d.points[0].rate < 0.05 || d.points[1].rate < 0.05) {
          // 小于 5% 默认不展示
          return ''
        }
        return d.conversionText
      })
      .attr('x', function(d) {
        return (d.points[0].x + d.points[2].x) / 2 - 30
      })
      .attr('y', function(d) {
        return (d.points[0].y + d.points[2].y) / 2 + 5
      })
      .style('fill', '#fff')
      .style('font-size', '16px')

    // 添加详情
    // 每一列一个详情tip
    var detailsData = []
    for (var i = 0; i < valueLength - 1; i ++) {
      detailsData.push(i)
    }
    var details = drawArea.selectAll('.detail')
      .data(detailsData).enter()
      .append('g').attr('class', 'detail').style('display', 'none')
    details.append('path')
      .style('fill', 'rgba(0,0,0,.6)')
      .attr('d', function(d, index) {
        var itemLength = width / (valueLength - 1)
        var points = [[itemLength * index, 0],
          [itemLength * (index + 1) - 2, 0],
          [itemLength * (index + 1) - 2, height - 2],
          [itemLength * index, height - 2]
        ]
        var ret = "M" + points.map(function(p) {
          return p[0] + ',' + p[1]
        }).join("L") + "Z"
        return ret
      })
      .style('border-radius', '3px')
    details.append('text')
      .attr('x', function(d, index) {
        return width * (index / (valueLength - 1)) + 10
      })
      .attr('y', 10)
      .style('fill', '#fff')
      .selectAll('tspan').data(function(d, index) {
        var conversionType = options.conversionType[index]
        var tips = data.map(function(item) {
          var conversion = item.value[index + 1] / item.value[index]
          var conversionText = getConversionText(conversion, conversionType)
          var t = item.name + ': ' + humanize(item.value[index])
          t += ' -(' + conversionText + ')'
          t += '-> ' + humanize(item.value[index + 1])
          return t
        })
        if (options.areaTitle[index]) {
          tips.unshift(' ')
          tips.unshift(options.areaTitle[index])
        }
        return tips
      }).enter()
      .append('tspan')
      .style('font-size', '8px')
      .attr('x', function(d, index) {
        return this.parentNode.getAttribute('x')
      })
      .attr('dy', '1.5em')
      .text(function(d) {return d})

    drawArea.on('mousemove', function() {
      var index = Math.floor((d3.event.layerX - leftLabelWidth) / (width / (valueLength - 1)))
      details.style('display', 'none')
      if (index >= 0 && index < valueLength - 1) {
        details.filter(function (d, i) { return i === index}).style('display', '')
      }
    }).on('mouseleave', function() {
      details.style('display', 'none')
    })
})

var COLORS = ['#ff934a', '#7ebcef', '#fdda34', '#a263bb', '#e75f51', '#80d25c']
function getColor(index) {
  return COLORS[index % COLORS.length]
}

function getConversionText(conversion, conversionType) {
  conversionType = conversionType || 'percentage'
  var conversionText = ''
  if (conversionType == 'percentage') {
    conversionText = (conversion * 100).toFixed(1) + '%'
  } else if (conversionType == 'cpm') {
    conversionText = (conversion * 1000).toFixed(1)
  } else {
    conversionText = conversion.toFixed(1)
  }
  return conversionText
}

function humanize(value) {
  var res = value
  var unit = ''
  if (Math.abs(res) >= 100000000) {
    unit = '亿'
    res = res / 100000000
  } else if (Math.abs(res) >= 10000) {
    unit = '万'
    res = res / 10000
  }
  return res.toFixed(1) + unit;
}
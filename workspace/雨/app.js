$(function () {
  var pageWidth = $('#container').width('100%').width()
  var pageHeight = $('#container').height('100%').height()
  var dropDuration = 4000
  var frameDuration = 50
  var count = 1000
  var initData = []
  for (let i = 0; i < count; i++) {
    initData.push({
      x: d3.randomUniform(pageWidth - 20)(),
      time: d3.randomUniform(1)()
    })
  }
  var items = d3.select('#container')
    .style('overflow', 'hidden')
    .selectAll('div')
    .data(initData)
    .enter()
    .append('div')
    .style('width', '2px')
    .style('height', '3px')
    .style('background-color', '#fff')
    .style('position', 'absolute')
    .style('left', (item) => {
      return Math.floor(item.x) + 'px'
    })
    .style('top', (item) => {
      var y = d3.easeQuadIn(item.time)
      return Math.floor(y * pageHeight) + 'px'
    })

    d3.timer(() => {
      pageWidth = $('#container').width()
      pageHeight = $('#container').height() - 30
      items.data(items.data().map((item) => {
        return {
          x: item.x,
          time: item.time >= 1 ? 0 : item.time += frameDuration / dropDuration
        }
      }))
      .style('top', (item) => {
        var y = d3.easeQuadIn(item.time)
        return Math.floor(y * pageHeight) + 'px'
      })
    }, frameDuration)
})

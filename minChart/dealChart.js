const FONT_FAMILY = '"PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", 微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif'
const legend = {
  type: 'scroll',
  orient: "horizontal",
  x: "center",
  itemWidth: 12,
  itemHeight: 12,
  selected: {},
  data: []
}
const xAxis = {
  type: 'category',
  axisTick: {
    show: false
  },
  axisLabel: {
    textStyle: {
      color: '#888',
      fontFamily: FONT_FAMILY
    }
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: '#888'
    }
  },
  axisTick: {
    show: false
  },
  data: []
}
const yAxis = {
  type: 'value',
  nameTextStyle: {
    color: '#444',
    fontSize: 13,
    fontFamily: FONT_FAMILY,
  },
  axisTick: {
    show: false
  },
  axisLabel: {
    textStyle: {
      color: '#888',
      fontFamily: FONT_FAMILY,
    }
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: '#888'
    }
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: '#f5f5f5'
    }
  }
}

/**
 * 格式化 echarts 结构
 * @param {object} data
 * @return {object}
 */
export function optionFormatter(data) {
  let option = {}
  let emptyOption = {
    isEmpty: true,
    graphic: {
      type: 'text',
      left: 'center',
      top: 'middle',
      z: 100,
      style: {
        fill: '#444',
        text: '暂无数据',
        font: '26px ' + FONT_FAMILY
      }
    }
  }

  if (!data || JSON.stringify(data) === '{}') {
    return emptyOption
  } else if (data.series && !data.series.length) {
    return emptyOption
  }
  // else {
  option = {
    tooltip: {
      show: true,
      backgroundColor: '#fff',
      textStyle: {
        color: '#333'
      },
      extraCssText: 'box-shadow: 0px 0px 10px -4px rgba(3, 3, 3, .4)'
    },
    legend: legend,
    grid: {},
    xAxis: xAxis,
    yAxis: yAxis,
    series: []
  }

  if (typeof (data.title) === 'string') {
    option.title = {
      text: data.title,
      show: false,
      textStyle: {
        color: '#444',
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: 'normal',
      },
      left: 24,
      top: 16
    }
  }

  option.color = data.color

  // 处理series
  data.series.forEach((item, index) => {
    option.legend.data.push({ name: item.name })
    option.xAxis.data = data.xaxis.data
  })

  option.series = data.series

  return option
  // }
}

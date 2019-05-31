<template>
  <div class="chart" :id="chartId" :chartType="chartType"></div>
</template>

<script>
import echarts from 'echarts'
import { optionFormatter } from '@/utils/dealChart'
import resize from './mixins/resize'
import downloadIcon from '@/assets/img/export.png'

export default {
  name: 'Charts',
  mixins: [resize],
  props: {
    chartId: {
      type: String,
      required: true,
      // default: 'chart'
    },
    chartType: {
      type: String,
      required: true,
      // default: 'chart'
    },
    chartData: {
      type: Object,
      required: true,
      // default: {}
    }
  },
  watch: {
    chartData: {
      handler(newVal, val) {
        // draw chart
        newVal && this[`draw${this.chartType}`](newVal)
      },
      deep: true
    }
  },
  data() {
    return {
      chart: null,
      downloadIcon: 'image://' + downloadIcon,
    }
  },
  mounted() {
    this.initChart()
    // chartType: HeatMap
    this[`draw${this.chartType}`]
      ? this[`draw${this.chartType}`](this.chartData, true)
      : this.$message({ type: 'warning', message: `该${this.chartType}图表类型不支持!` })
  },
  beforeDestroy() {
    if(!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.getInstanceByDom(document.getElementById(this.chartId))
        || echarts.init(document.getElementById(this.chartId))
    },
    getRandomColors(length) {
      let colors = [], temp = [];  // (~~(Math.random()*(1<<24))).toString(16)
      while (colors.length < length) {
        temp.push(getColor())
        colors = [...new Set(temp)]
      }
      function getColor() {
        return '#' + ('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6)
      }
      return colors
    },
    drawHeatmap(data, isFirst) {
      // 格式化自定义的 y 轴
      let yAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      if(window.localStorage.getItem('lang') == 'en_US') {
          yAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
      this.chart.showLoading('default', {
        text: '',
        color: '#409eff'
      });
      if (isFirst) return
      const optionFormat = optionFormatter(data)
      if(optionFormat.isEmpty) {
          this.chart.clear()
          optionFormat.xAxis = {}
          optionFormat.yAxis = {}
          optionFormat.grid = {
            left: 36,
            right: 0,
            top: 26,
            bottom: 52
          }
          setTimeout(() => {
            if (this.chart) {
              this.chart.hideLoading()
            }
          }, 500)
          this.chart.setOption(optionFormat)
        return
      }

      let seriesData = []
        , yIndex = null
        , maxArr = []
        , onedimen = []
        , maxNum = null
        
      optionFormat.series.forEach((item, index) => {
        yIndex = getIndex(item.name, yAxisData)
        maxArr.push(item.data)
        item.data.forEach((dataItem, dataIndex) => {
          seriesData.push([parseInt(yIndex), dataIndex, dataItem || '-'])
        })
        // console.log('seriesData', seriesData)
        item.type = 'heatmap'
        item.itemStyle = {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, .5)'
          }
        }
        item.label = {
          normal: {
            show: true,
            color: '#444'
          }
        }
      })
      optionFormat.legend.show = false
      optionFormat.xAxis.nameTextStyle = {
        color: '#444',
        fontSize: 12
      }
      optionFormat.xAxis.splitArea = {
        show: true
      }
      optionFormat.xAxis.axisLine = {
        lineStyle: {
            color: '#535353'
        }
      }
      
      seriesData = seriesData.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
      })

      if (maxArr.length) {
        onedimen = maxArr.join(',').split(',')
        maxNum = Math.max.apply(null, onedimen)
      }

      // 覆盖格式化后的`option`数据 按需修改
      let coverTemp = {
        grid: {
          left: 36,
          right: 0,
          top: 26,
          bottom: 52
        },
        toolbox: {
          show: true,
          showTitle: false,
          feature: {
            saveAsImage: {
              icon: this.downloadIcon
            }
          },
          top: 0,
          right: 0
        },
        yAxis: {
          type: 'category',
          splitArea: {
              show: true
          },
          axisTick: {
              show: false
          },
          axisLine: {
              lineStyle: {
                  color: '#535353'
              }
          },
          data: yAxisData
        },
        visualMap: {
          show: !optionFormat.isYear,
          min: 0,
          max: 20,
          calculable: true,
          orient: 'horizontal',
          left: 'left',
          bottom: -10,
          itemWidth: 15,
          color: ['#0068FF', '#fff'],
        }
      }
      
      coverTemp.visualMap.max = maxNum
      
      const option =JSON.parse(JSON.stringify({ ...optionFormat, ...coverTemp }))
      option.series.forEach(item => {
        item.data = []
        item.data = seriesData.splice(0, optionFormat.xAxis.data.length)  // 多次裁剪 seriesData 数组
      })

      option.tooltip.formatter = (params, ticket, callback) => {
        let xData = option.xAxis.data
          , yData = option.yAxis.data
          , htmls = ''
        htmls += `<div style="font-size:14px;height:31px;color:#333;border-radius:4px;line-height:31px;padding-left:15px; padding-right:15px; text-align: left; color: #0068FF;">${yData[params.value[1]]}</div><div><p style="font-size:13px;padding:4px 15px;color:"#444444"">${xData[params.value[0]]}: 平均热力${params.value[2]}</p></div>`
        return htmls
      }

      function getIndex (val, arr) {
        for(let i in arr) {
          if(val == arr[i]) {
            return i
          }
        }
      }
      this.chart.clear()
      this.chart.hideLoading()
      this.chart.setOption(option)
    },
    drawAreaLine(data, isFirst) {
      this.chart.showLoading('default', {
        text: '',
        color: '#409eff'
      });
      if (isFirst) return
      const optionFormat = optionFormatter(data)
      if(optionFormat.isEmpty) {
        this.chart.clear()
        optionFormat.xAxis = {}
        optionFormat.yAxis = {}
        optionFormat.grid = {
          left: 36,
          right: 0,
          top: 26,
          bottom: 52
        }
        setTimeout(() => {
          if (this.chart) {
            this.chart.hideLoading()
          }
        }, 500)
        this.chart.setOption(optionFormat)
        return
      }

      let _colors = ["#87D14B", "#3BB8FF", "#FFC62E", "#FF9631", "#7460EE"] // this.getRandomColors(optionFormat.legend.data.length)
      // console.log(_colors)

      let areaColor = _colors.map(item => {
        return {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: item // 0% 处的颜色
          }, {
            offset: 1, color: '#fff' // 100% 处的颜色
          }]
        }
      })

      optionFormat.series.forEach((item, index) => {
        item.type = 'line'
        item.showSymbol = true
        item.symbolSize = 6
        item.areaStyle = {
          normal: {
            color: areaColor[index]
          }
        }
        if (item.name) {
          optionFormat.legend.selected[item.name] = index < 2
        }
      })
      optionFormat.legend.bottom = 12
      optionFormat.tooltip.trigger = 'axis'
      optionFormat.tooltip.axisPointer = {
        type: "line",
        animation: true,
        lineStyle: {
          color: '#444'
        }
      }

      // 覆盖格式化后的`option`数据 按需修改
      let coverTemp = {
        color: _colors,  // ["#87D14B", "#3BB8FF", "#FFC62E", "#FF9631", "#7460EE"]
        grid: {
          top: 60,
          right: 45,
          bottom: 60,
          left: 60
        }
      }
      const option =JSON.parse(JSON.stringify({ ...optionFormat, ...coverTemp }))

      option.tooltip.formatter = (params, ticket, callback) => {
        let htmls = ''
        htmls += '<div style="font-size:14px;height:31px;color:#333;border-radius:4px;line-height:31px;padding-left:15px;padding-right:15px; text-align: left;">' + params[0].axisValue + '</div><div>'
        params.forEach(item => {
          htmls += '<p style="font-size:13px;padding:4px 15px;color:#444444; text-align: left;">' + item.marker + ' ' + item.seriesName + this.$t('format.TRAFFIC') + ': ' + (item.data || '--') + this.$t('format.perTime') + '</p>'
        })
        // for(let i = 0; i < params.length; i++) {
        //     htmls += '<p style="font-size:13px;padding:4px 15px;color:#444444; text-align: left;">' + params[i].marker + ' ' + params[i].seriesName + this.$t('format.TRAFFIC') + ': ' + (params[i].data ? params[i].data : '--') + this.$t('format.perTime') + '</p>'
        // }
        htmls += '</div>'
        return htmls
      }
      this.chart.clear()
      this.chart.hideLoading()
      this.chart.setOption(option)
    } 
  }
}
</script>

<style>

</style>

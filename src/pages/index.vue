<template>
  <div>
    <el-row :gutter="20" class="indexTask">
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">总客户</div>
          <div class="nums">500</div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">今日客户</div>
          <div class="nums">500</div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">总订单</div>
          <div class="nums">500</div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">今日订单</div>
          <div class="nums">500</div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">总任务</div>
          <div class="nums">500</div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="items">
          <div class="grid-demo">进行中的任务</div>
          <div class="nums">500</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :span="12">
        <div class="itemBg">
          <div id="container1" style="width: 100%;height: 320px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="itemBg">
          <div id="container2" style="width: 100%;height: 320px"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :span="12">
        <div class="itemBg">
          <div id="container3" style="width: 100%;height: 320px"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="itemBg">
          <div id="container4" style="width: 100%;height: 320px"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :span="24">
        <div class="itemBg">
          <div id="container5" style="width: 100%;height: 320px"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts')
// 引入柱状图组件、折线图、饼状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
export default {
  name: 'index',
  data () {
    return {}
  },
  mounted () {
    this.chartline()
    this.resize()
    this.orderList()
    this.orderError()
    this.getReviewCount()
  },
  methods: {
    // 今日任务排行榜
    chartline () {
      var dom = document.getElementById('container1')
      var myChart = echarts.init(dom)
      myChart.setOption({
        title: {
          text: '今日任务排行榜'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['今日已购买', '今日待购买']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              readOnly: false
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['张三', '杨欢', '圭贤', '晟敏', '利特', '希澈', '东海']
        },
        series: [
          {
            name: '今日已购买',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: '#40C9C6'
              }
            },

            data: [10, 10, 20, 30, 10, 20, 30]
          },
          {
            name: '今日待购买',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              normal: {
                color: '#F4516C'
              }
            },
            data: [20, 30, 40, 20, 30, 50]
          }
        ]
      })
    },
    // 七天内未分配任务
    resize () {
      var dom = document.getElementById('container2')
      var myChart = echarts.init(dom)
      myChart.setOption({
        title: {
          text: '买号7天内未分配任务'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['买号7天内未分配任务'],
          top: '10%'
        },
        toolbox: {
          right: '3%',
          show: true,
          feature: {
            dataView: {
              readOnly: false
            },
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '买号7天内未分配任务',
            type: 'pie',
            radius: ['60%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 35,
                name: '买号7天内未分配任务'
              }
            ]
          }
        ]
      })
    },
    // 每日订单统计报表
    orderList () {
      var dom = document.getElementById('container3')
      var myChart = echarts.init(dom)
      myChart.setOption({
        title: {
          text: '每日订单统计报表'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
          	smooth:true,
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
          	smooth:true,
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
          	smooth:true,
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
          	smooth:true,
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
          	smooth:true,
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      })
    },
    // 每日订单异常报表
    orderError () {
      var dom = document.getElementById('container4')
      var myChart = echarts.init(dom)
      myChart.setOption({
        title: {
          text: '每日订单统计异常报表'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
        
          {
          	smooth:true,
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [2120, 2232, 101, 2134, 90, 230, 2210]
          },
          {
          	smooth:true,
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 2234, 290, 330, 310]
          },
          {
          	smooth:true,
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [2250, 232, 201, 1254, 190, 330, 900]
          },
          {
          	smooth:true,
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 2332, 301, 2234, 390, 330, 30]
          },
          {
          	smooth:true,
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [123, 932, 901, 234, 1290, 330, 1320]
          }
        ]
      })
    },
    // 每日限评数统计报表
    getReviewCount () {
      var dom = document.getElementById('container5')
      var myChart = echarts.init(dom)
      myChart.setOption({
        title: {
          text: '每日限评数统计报表'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
        	smooth:true,
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [2120, 132, 101, 1234, 90, 230, 210]
        },
        {
        	smooth:true,
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 2234, 290, 330, 310]
        },
        {
        	smooth:true,
          name: '视频广告',
          type: 'line',
          stack: '总量',
          data: [150, 232, 2201, 154, 190, 1130, 410]
        },
        {
        	smooth:true,
          name: '直接访问',
          type: 'line',
          stack: '总量',
          data: [320, 1132, 301, 2234, 390, 330, 320]
        },
        {
        	smooth:true,
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 2330, 1320]
        }
        ]
      })
    }
  }
}
</script>

<style scoped></style>

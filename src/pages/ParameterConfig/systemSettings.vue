<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>系统设置</span>
      <span>/</span>
      <span>{{title}}</span>
    </div>
    <div class="tabList mb20">
      <ul class="tabBlock">
        <li :class="active === 1 ? 'active':''" @click="serviceHandle">服务类型</li>
        <li :class="active === 2 ? 'active':''" @click="ParameterHandle">增值服务费</li>
        <li :class="active === 3 ? 'active':''" @click="exchangeHandle">货币汇率</li>
        <li :class="active === 4 ? 'active':''" @click="countryHandle">国家管理</li>
        <li :class="active === 5 ? 'active':''" @click="platformHandle">平台管理</li>
        <li :class="active === 6 ? 'active':''" @click="ipHandle">IP管理</li>
        <li :class="active === 7 ? 'active':''" @click="autoShareHandle">自动分配</li>
        <li :class="active === 8 ? 'active':''" @click="takeMoneyHandle">提现配置</li>
        <li :class="active === 9 ? 'active':''" @click="salesEstimateHandle">销量预估</li>
        <li :class="active === 10 ? 'active':''" @click="numberSystemHandle">养号系统</li>
      </ul>
    </div>
    <div v-if="active==1">
      <serviceType></serviceType>
    </div>
    <div v-if="active==2">
      <ParameterService></ParameterService>
    </div>
    <div v-if="active==3">
      <exchangeRate></exchangeRate>
    </div>
    <div v-if="active==4">
      <countryManage></countryManage>
    </div>
    <div v-if="active==5">
      <platform></platform>
    </div>
    <div v-if="active==6">
      <dynamicIP></dynamicIP>
    </div>
    <div v-if="active==7">
      <autoShare></autoShare>
    </div>
    <div v-if="active==8">
      <takeMoneySet></takeMoneySet>
    </div>
    <div v-if="active==9">
      <salesEstimate></salesEstimate>
    </div>
    <div v-if="active==10">
      <numberSys></numberSys>
    </div>

  </div>
</template>

<script>
  import serviceType from './serviceType'
  import ParameterService from './ParameterService'
  import exchangeRate from './exchangeRate'
  import countryManage from './countryManage'
  import platform from './platform'
  import dynamicIP from './dynamicIP'
  import autoShare from './autoShare'
  import takeMoneySet from './takeMoneySet'
  import salesEstimate from './salesEstimate'
  import numberSys from './productList'
  export default {
    name: 'systemSettings',
    data() {
      return {
        active: 1,
        title: '服务类型'
      }
    },
    components: {
      serviceType,
      ParameterService,
      exchangeRate,
      countryManage,
      platform,
      dynamicIP,
      autoShare,
      takeMoneySet,
      salesEstimate,
      numberSys
    },
    methods: {
      serviceHandle() {
        let _this = this
        _this.active = 1
        _this.title = '服务类型'
      },
      ParameterHandle() {
        let _this = this
        _this.active = 2
        _this.title = '增值服务费'
      },
      exchangeHandle() {
        let _this = this
        _this.active = 3
        _this.title = '货币汇率'
      },
      countryHandle() {
        let _this = this
        _this.active = 4
        _this.title = '国家管理'
      },
      platformHandle() {
        let _this = this
        _this.active = 5
        _this.title = '平台管理'
      },
      ipHandle() {
        let _this = this
        _this.active = 6
        _this.title = 'IP管理'
      },
      autoShareHandle() {
        let _this = this
        _this.active = 7
        _this.title = '自动分配'
      },
      takeMoneyHandle() {
        let _this = this
        _this.active = 8
        _this.title = '提现配置'
      },
      salesEstimateHandle() {
        let _this = this
        _this.active = 9
        _this.title = '销量预估'
      },
      //养号系统
      numberSystemHandle() {
        let _this = this
        _this.active = 10
        _this.title = '养号系统'
      }
    }
  }
</script>

<style>

</style>

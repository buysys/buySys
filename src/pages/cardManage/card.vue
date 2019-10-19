<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>卡片管理</span>
      <span>/</span>
      <span>{{title}}</span>
    </div>
    <div class="tabList mb20">
      <ul class="tabBlock">
        <li :class="active === 1 ? 'active':''" @click="shiti">实体信用卡</li>
        <li :class="active === 2 ? 'active':''" @click="xuni">虚拟信用卡</li>
      </ul>
    </div>
    <div v-show="TabShiTi">
      <practicalCard></practicalCard>
    </div>
    <div v-show="TabXuNi">
      <virtualCard></virtualCard>
    </div>
  </div>
</template>

<script>
  import practicalCard from './practicalCard'
  import virtualCard from './virtualCard'

  export default {
    name: 'card',
    data() {
      return {
        title: '实体信用卡',
        TabShiTi: true,
        TabXuNi: false,
        active: 1
      }
    },
    components: {
      practicalCard,
      virtualCard
    },
    methods: {
      shiti() {
        let _this = this
        _this.title = '实体信用卡'
        _this.TabXuNi = false
        _this.TabShiTi = true
        _this.active = 1
      },
      xuni() {
        let _this = this
        _this.title = '虚拟信用卡'
        _this.TabXuNi = true
        _this.TabShiTi = false
        _this.active = 2
      }
    },
  }
</script>

<style>
</style>

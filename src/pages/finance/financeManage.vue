<template>
  <div class="container">
    <div class="mb20 fz14">
      <span>首页</span>
      <span>/</span>
      <span>财务管理</span>
      <span>/</span>
      <span>{{title}}</span>
    </div>
    <div class="tabList mb20">
      <ul class="tabBlock">
        <li :class="active === 1 ? 'active':''" @click="kehu">客户账户</li>
      </ul>
    </div>
    <div v-if="TabKeHu">
      <customer></customer>
    </div>
  </div>
</template>

<script>
  import customer from './customerAccount'

  export default {
    name: 'financeManage',
    data() {
      return {
        title: '客户账户',
        TabKeHu: true,
        active: 1
      }
    },
    components: {
      customer
    },
    methods: {
      kehu() {
        let _this = this
        _this.active = 1
        _this.title = '客户账户'
      }
    }
  }
</script>

<style>
</style>

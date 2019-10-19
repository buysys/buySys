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
    <div v-if="active==1">
      <customerAccount></customerAccount>
    </div>
  </div>
</template>

<script>
  import customerAccount from './customerAccount'

  export default {
    name: 'finance',
    data() {
      return {
        title: '客户账户',
        active: 1
      }
    },
    components: {
      customerAccount
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

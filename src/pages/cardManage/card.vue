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
    <div v-if="active==1">
      <entityCard></entityCard>
    </div>
    <div v-if="active==2">
      <virtuaCard></virtuaCard>
    </div>
  </div>
</template>

<script>
  import entityCard from './entityCard'
  import virtuaCard from './virtuaCard'

  export default {
    name: 'card',
    data() {
      return {
        title: '实体信用卡',
        active: 1
      }
    },
    components: {
      entityCard,
      virtuaCard
    },
    methods: {
      shiti() {
        let _this = this
        _this.title = '实体信用卡'
        _this.active = 1
      },
      xuni() {
        let _this = this
        _this.title = '虚拟信用卡'
        _this.active = 2
      }
    },
  }
</script>

<style>
</style>

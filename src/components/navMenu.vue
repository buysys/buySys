<template>
  <div class="navCon">
    <div class="navHead">
      <div class="line"></div>
      <el-menu :default-active="onRoutes" background-color="#001529" text-color="#fff" active-text-color="#5FB878"
        class="el-menu-demo navBox" mode="horizontal" @select="handleSelect" unique-opened router>
        <el-menu-item>
          <img class="imgLogo" src="../assets/image/logo.png" />
        </el-menu-item>
        <el-menu-item index="index" style="border: none;"><i class="el-icon-files"></i>首页</el-menu-item>
        <el-menu-item index="order"><i class="el-icon-document-checked"></i>订单管理</el-menu-item>
        <el-menu-item index="task"><i class="el-icon-document"></i>任务管理</el-menu-item>
        <el-menu-item index="buyNumList"><i class="el-icon-set-up"></i>账号管理</el-menu-item>
        <el-menu-item index="card"><i class="el-icon-bank-card"></i>卡片管理</el-menu-item>
        <el-menu-item index="customer"><i class="el-icon-news"></i>客户管理</el-menu-item>
        <el-menu-item index="user"><i class="el-icon-user"></i>用户管理</el-menu-item>
        <el-menu-item index="finance"><i class="el-icon-data-line"></i>财务管理</el-menu-item>
        <el-menu-item index="system"><i class="el-icon-setting"></i>系统设置</el-menu-item>
        <el-submenu index="11" class="userInfoBox">
          <template slot="title"><i class="el-icon-s-custom"></i>kyumin</template>
          <el-menu-item index="userInfo">个人资料</el-menu-item>
          <el-menu-item index="12" @click="loginOut">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import bus from './bus'
  export default {
    name: 'navMenu',
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg
      })
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '')
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath)
      },
      loginOut() {
        this.$router.push('/login')
        sessionStorage.clear()
      }
    }
  }
</script>

<style>

</style>

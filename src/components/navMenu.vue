<template>
  <div class="navCon">
    <div class="navHead">
      <div class="line"></div>
<!--      <div class="navs">-->
        <el-menu :default-active="onRoutes" background-color="#001529" text-color="#fff"
                 active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" @select="handleSelect"
                 unique-opened router>
          <el-menu-item index="index"><i class="el-icon-files"></i>首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document-checked"></i>订单管理</template>
            <el-menu-item index="orderPlacingManage">下单管理</el-menu-item>
            <el-menu-item index="AdditionalOrder">加购订单</el-menu-item>
            <el-menu-item index="wishOrder">心愿订单</el-menu-item>
            <el-menu-item index="likesOrder">点赞订单</el-menu-item>
            <el-menu-item index="QAorder">QA订单</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-suitcase"></i>任务管理</template>
            <el-menu-item index="placeOrderTask">下单任务</el-menu-item>
            <el-menu-item index="addPurchaseTask">加购任务</el-menu-item>
            <el-menu-item index="wishTask">心愿任务</el-menu-item>
            <el-menu-item index="likesTask">点赞任务</el-menu-item>
            <el-menu-item index="QaTask">QA任务</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-s-check"></i>买号管理</template>
            <el-menu-item index="buyNumLevel">买号等级</el-menu-item>
            <el-menu-item index="buyNumList">买号列表</el-menu-item>
            <el-menu-item index="registerAccount">注册账号</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-bank-card"></i>卡片管理</template>
            <el-menu-item index="VirtualCard">虚拟卡管理</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-s-custom"></i>客户管理</template>
            <el-menu-item index="">客户列表</el-menu-item>
            <el-menu-item index="">补税记录</el-menu-item>
            <el-menu-item index="">公司部门</el-menu-item>
            <el-menu-item index="">退款订单</el-menu-item>
            <el-menu-item index="">提现记录</el-menu-item>
            <el-menu-item index="">提现配置</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"><i class="el-icon-news"></i>合作伙伴</template>
            <el-menu-item index="">伙伴管理</el-menu-item>
            <el-menu-item index="">返利订单</el-menu-item>
            <el-menu-item index="">提现记录</el-menu-item>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title"><i class="el-icon-key"></i>支付管理</template>
            <el-menu-item index="">支付类型</el-menu-item>
            <el-menu-item index="">支付方式</el-menu-item>
          </el-submenu>
          <el-submenu index="9" class="userInfoBox">
            <template slot="title"><i class="el-icon-s-custom"></i>kyumin</template>
            <el-menu-item index="">修改头像</el-menu-item>
            <el-menu-item index="">个人资料</el-menu-item>
            <el-menu-item index="">我的通讯录</el-menu-item>
            <el-menu-item index="">信箱</el-menu-item>
            <el-menu-item index="">安全退出</el-menu-item>
          </el-submenu>
          <el-menu-item index="10" class="loginOut" @click="loginOut"><i class="el-icon-setting"></i>退出
          </el-menu-item>
        </el-menu>
<!--      </div >-->
    </div>
  </div>
</template>

<script>
import bus from './bus'
export default {
  name: 'navMenu',
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    loginOut () {
      this.$router.push('/login')
      sessionStorage.clear()
    }
  }
}
</script>

<style>

</style>

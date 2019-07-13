<template>
	<div class="navCon">
		<div class="navHead">
			<div class="line"></div>
			<el-menu :default-active="onRoutes" background-color="#001529" text-color="#fff" active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" @select="handleSelect" unique-opened router>
				<el-menu-item>
					<img class="imgLogo" src="../assets/image/logo.png" />
				</el-menu-item>
				<el-menu-item index="index" style="border: none;"><i class="el-icon-files"></i>首页</el-menu-item>
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
				<!--<el-submenu index="4">
					<template slot="title"><i class="el-icon-s-check"></i>账号管理</template>
					<el-menu-item index="buyNumLevel">买号等级</el-menu-item>
					<el-menu-item index="buyNumList">买号列表</el-menu-item>
					<el-menu-item index="registerAccount">注册账号</el-menu-item>
				</el-submenu>-->
				<el-menu-item index="buyNumList" style="border: none;"><i class="el-icon-s-check"></i>账号管理</el-menu-item>
				<el-submenu index="5">
					<template slot="title"><i class="el-icon-bank-card"></i>卡片管理</template>
					<el-menu-item index="VirtualCard">虚拟信用卡</el-menu-item>
					<el-menu-item index="practicalCard">实体信用卡</el-menu-item>
				</el-submenu>
				<el-menu-item index="index"><i class="el-icon-files"></i>首页</el-menu-item>
				<el-menu-item index="orderList"><i class="el-icon-document-checked"></i>订单管理</el-menu-item>
				<el-menu-item index="TaskList"><i class="el-icon-suitcase"></i>任务管理</el-menu-item>
				<el-submenu index="4">
					<template slot="title"><i class="el-icon-s-check"></i>买号管理</template>
					<el-menu-item index="buyNumLevel">买号等级</el-menu-item>
					<el-menu-item index="buyNumList">买号列表</el-menu-item>
					<el-menu-item index="registerAccount">注册账号</el-menu-item>
				</el-submenu>
				<el-menu-item index="CardManage"><i class="el-icon-bank-card"></i>卡片管理</el-menu-item>
				<el-submenu index="6">
					<template slot="title"><i class="el-icon-s-custom"></i>客户管理</template>
					<el-menu-item index="customerList">客户列表</el-menu-item>
					<el-menu-item index="refundOrder">退款订单</el-menu-item>
					<el-menu-item index="takeMoneyList">提现记录</el-menu-item>
					<el-menu-item index="takeMoneySet">提现配置</el-menu-item>
				</el-submenu>
				<el-menu-item index="userManage"><i class="el-icon-user"></i>用户管理</el-menu-item>
				<el-submenu index="10">
					<template slot="title"><i class="el-icon-s-tools"></i>系统设置</template>
					<el-menu-item index="serviceType">服务类型</el-menu-item>
					<el-menu-item index="ParameterService">增值费服务</el-menu-item>
					<el-menu-item index="exchangeRate">货币汇率</el-menu-item>
					<el-menu-item index="countryManage">国家管理</el-menu-item>
					<el-menu-item index="platform">平台管理</el-menu-item>
					<el-menu-item index="dynamicIP">IP池管理</el-menu-item>
					<el-menu-item index="autoShare">自动分配</el-menu-item>
				</el-submenu>
				<el-submenu index="11" class="userInfoBox">
					<template slot="title"><i class="el-icon-s-custom"></i>kyumin</template>
					<el-menu-item index="personalData">个人资料</el-menu-item>
					<el-menu-item index="headPortrait">修改头像</el-menu-item>
					<el-menu-item index="">个人资料</el-menu-item>
				</el-submenu>
				<el-menu-item index="12" class="loginOut" @click="loginOut"><i class="el-icon-setting"></i>退出
				</el-menu-item>
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
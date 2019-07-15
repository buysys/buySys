<template>
	<div class="navCon">
		<div class="navHead">
			<div class="line"></div>
			<el-menu :default-active="onRoutes" background-color="#001529" text-color="#fff" active-text-color="#5FB878" class="el-menu-demo navBox" mode="horizontal" @select="handleSelect" unique-opened router>
				<el-menu-item>
					<img class="imgLogo" src="../assets/image/logo.png" />
				</el-menu-item>
				<el-menu-item index="index" style="border: none;"><i class="el-icon-files"></i>首页</el-menu-item>
				<el-menu-item index="orderList"><i class="el-icon-document-checked"></i>订单管理</el-menu-item>
				<el-menu-item index="TaskList"><i class="el-icon-suitcase"></i>任务管理</el-menu-item>
				<el-menu-item index="buyNumList"><i class="el-icon-files"></i>账号管理</el-menu-item>
				<el-menu-item index="CardManage"><i class="el-icon-bank-card"></i>卡片管理</el-menu-item>
				<el-menu-item index="customerList"><i class="el-icon-s-custom"></i>客户管理</el-menu-item>
				<el-menu-item index="userManage"><i class="el-icon-user"></i>用户管理</el-menu-item>
				<el-menu-item index="systemSettings"><i class="el-icon-setting"></i>系统设置</el-menu-item>
				<el-submenu index="11" class="userInfoBox">
					<template slot="title"><i class="el-icon-s-custom"></i>kyumin</template>
					<el-menu-item index="personalData">个人资料</el-menu-item>
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

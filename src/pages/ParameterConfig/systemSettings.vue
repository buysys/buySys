<template>
	<div class="container">
		<div class="tabList">
			<ul class="tabBlock">
				<li :class="active === 1 ? 'active':''" @click="serviceHandle">服务类型</li>
				<li :class="active === 2 ? 'active':''" @click="ParameterHandle">增值服务费</li>
				<li :class="active === 3 ? 'active':''" @click="exchangeHandle">货币汇率</li>
				<li :class="active === 4 ? 'active':''" @click="countryHandle">国家管理</li>
				<li :class="active === 5 ? 'active':''" @click="platformHandle">平台管理</li>
				<li :class="active === 6 ? 'active':''" @click="ipHandle">IP管理</li>
				<li :class="active === 7 ? 'active':''" @click="autoShareHandle">自动分配</li>
			</ul>
		</div>
		<div v-show="serviceType">
			<serviceType></serviceType>
		</div>
		<div v-show="ParameterService">
			<ParameterService></ParameterService>
		</div>
		<div v-show="exchangeRate">
			<exchangeRate></exchangeRate>
		</div>
		<div v-show="countryManage">
			<countryManage></countryManage>
		</div>
		<div v-show="platform">
			<platform></platform>
		</div>
		<div v-show="dynamicIP">
			<dynamicIP></dynamicIP>
		</div>
		<div v-show="autoShare">
			<autoShare></autoShare>
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
	export default {
		name: 'systemSettings',
		data() {
			return {
				serviceType: true,
				ParameterService: false,
				exchangeRate: false,
				countryManage: false,
				platform: false,
				dynamicIP: false,
				autoShare: false,
				active: 1				
			}
		},
		components: {
			serviceType,
			ParameterService,
			exchangeRate,
			countryManage,
			platform,
			dynamicIP,
			autoShare
		},
		methods: {
			serviceHandle() {
				let _this = this
				_this.serviceType = true
				_this.ParameterService = false
				_this.exchangeRate = false
				_this.countryManage = false
				_this.platform = false
				_this.dynamicIP = false
				_this.autoShare = false
				_this.active = 1
			},
			ParameterHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = true
				_this.exchangeRate = false
				_this.countryManage = false
				_this.platform = false
				_this.dynamicIP = false
				_this.autoShare = false				
				_this.active = 2
			},
			exchangeHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = false
				_this.exchangeRate = true
				_this.countryManage = false
				_this.platform = false
				_this.dynamicIP = false
				_this.autoShare = false
				_this.active = 3
			},
			countryHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = false
				_this.exchangeRate = false
				_this.countryManage = true
				_this.platform = false
				_this.dynamicIP = false
				_this.autoShare = false
				_this.active = 4
			},
			platformHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = false
				_this.exchangeRate = false
				_this.countryManage = false
				_this.platform = true
				_this.dynamicIP = false
				_this.autoShare = false
				_this.active = 5
			},
			ipHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = false
				_this.exchangeRate = false
				_this.countryManage = false
				_this.platform = false
				_this.dynamicIP = true
				_this.autoShare = false
				_this.active = 6
			},
			autoShareHandle() {
				let _this = this
				_this.serviceType = false
				_this.ParameterService = false
				_this.exchangeRate = false
				_this.countryManage = false
				_this.platform = false
				_this.dynamicIP = false
				_this.autoShare = true
				_this.active = 7
			}
			
		},
	}
</script>

<style>

</style>
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
			<li :class="active === 1 ? 'active':''" @click="xuni">虚拟信用卡</li>
			<li :class="active === 2 ? 'active':''" @click="shiti">实体信用卡</li>
		</ul>
	</div>
	<div v-show="TabXuNi">
		<VirtualCard></VirtualCard>
	</div>
	<div v-show="TabShiTi">
		<practicalCard></practicalCard>
	</div>
	</div>
</template>

<script>
	import VirtualCard from './VirtualCard'
	import practicalCard from './practicalCard'

	export default {
		name: 'CardManage',
		data() {
			return {
        title:'虚拟信用卡',
				TabXuNi:true,
				TabShiTi:false,
				active:1
			}
		},
		components:{
			VirtualCard,
			practicalCard
		},
		methods:{
			xuni(){
				let _this = this
        _this.title = '虚拟信用卡'
				_this.TabXuNi = true
				_this.TabShiTi = false
				_this.active = 1
			},
			shiti(){
				let _this = this
        _this.title = '实体信用卡'
				_this.TabXuNi = false
				_this.TabShiTi = true
				_this.active = 2
			}
		},
	}
</script>

<style>
</style>

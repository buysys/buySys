import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import Login from '@/pages/login'
// import auth from './auth'
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/index'
		},
		{
			path: '/home',
			name: 'home',
			component: resolve => require(['../components/home.vue'], resolve),
			children: [
				{
					path: '/index',
					name: 'index',
					component: resolve => require(['../pages/index.vue'], resolve),
					meta: {
						title: '首页'
					}
				},
				{
					path: '/orderList',
					name: 'orderList',
					component: resolve => require(['../pages/order/orderList.vue'], resolve),
					meta: {
						title: '订单管理'
					}
				},
				{
					path: '/TaskList',
					name: 'TaskList',
					component: resolve => require(['../pages/task/TaskList.vue'], resolve),
					meta: {
						title: '任务管理'
					}
				},
				{
					path: '/buyNumLevel',
					name: 'buyNumLevel',
					component: resolve => require(['../pages/buyNum/buyNumLevel.vue'], resolve),
					meta: {
						title: '买号等级'
					}
				},
				{
					path: '/buyNumList',
					name: 'buyNumList',
					component: resolve => require(['../pages/buyNum/buyNumList.vue'], resolve),
					meta: {
						title: '买号列表'
					}
				},
				{
					path: '/registerAccount',
					name: 'registerAccount',
					component: resolve => require(['../pages/buyNum/registerAccount.vue'], resolve),
					meta: {
						title: '注册账号'
					}
				},
				{
					path: '/VirtualCard',
					name: 'VirtualCard',
					component: resolve => require(['../pages/card/VirtualCard.vue'], resolve),
					meta: {
						title: '虚拟卡管理'
					}
				},
				{
					path: '/practicalCard',
					name: 'practicalCard',
					component: resolve => require(['../pages/card/practicalCard.vue'], resolve),
					meta: {
						title: '实体卡管理'
					}
				},
				{
					path: '/userManage',
					name: 'userManage',
					component: resolve => require(['../pages/systemSettings/userManage.vue'], resolve),
					meta: {
						title: '用户管理'
					}
				},
				{
					path: '/customerList',
					name: 'customerList',
					component: resolve => require(['../pages/customer/customerList.vue'], resolve),
					meta: {
						title: '客户列表'
					}
				},
				{
					path: '/takeMoneySet',
					name: 'takeMoneySet',
					component: resolve => require(['../pages/ParameterConfig/takeMoneySet.vue'], resolve),
					meta: {
						title: '提现配置'
					}
				},
				{
					path: '/partnerManage',
					name: 'partnerManage',
					component: resolve => require(['../pages/Cooperativepartner/partnerManage.vue'], resolve),
					meta: {
						title: '伙伴管理'
					}
				},
				{
					path: '/returnOrder',
					name: 'returnOrder',
					component: resolve => require(['../pages/Cooperativepartner/returnOrder.vue'], resolve),
					meta: {
						title: '返利订单'
					}
				},
				{
					path: '/DiscountRecord',
					name: 'DiscountRecord',
					component: resolve => require(['../pages/Cooperativepartner/DiscountRecord.vue'], resolve),
					meta: {
						title: '提现记录'
					}
				},
				{
					path: '/ParameterService',
					name: 'ParameterService',
					component: resolve => require(['../pages/ParameterConfig/ParameterService.vue'], resolve),
					meta: {
						title: '增值费服务'
					}
				},
				{
					path: '/dynamicIP',
					name: 'dynamicIP',
					component: resolve => require(['../pages/ParameterConfig/dynamicIP.vue'], resolve),
					meta: {
						title: 'IP池管理'
					}
				},
				{
					path: '/platform',
					name: 'platform',
					component: resolve => require(['../pages/ParameterConfig/platform.vue'], resolve),
					meta: {
						title: '平台管理'
					}
				},
				{
					path: '/autoShare',
					name: 'autoShare',
					component: resolve => require(['../pages/ParameterConfig/autoShare.vue'], resolve),
					meta: {
						title: '自动分配'
					}
				},
				{
					path: '/serviceType',
					name: 'serviceType',
					component: resolve => require(['../pages/ParameterConfig/serviceType.vue'], resolve),
					meta: {
						title: '服务类型'
					}
				},
				{
					path: '/countryManage',
					name: 'countryManage',
					component: resolve => require(['../pages/ParameterConfig/countryManage.vue'], resolve),
					meta: {
						title: '国家管理'
					}
				},
				{
					path: '/exchangeRate',
					name: 'exchangeRate',
					component: resolve => require(['../pages/ParameterConfig/exchangeRate.vue'], resolve),
					meta: {
						title: '货币汇率'
					}
				},
				{
					path: '/personalData',
					name: 'personalData',
					component: resolve => require(['../pages/personalData.vue'], resolve),
					meta: {
						title: '个人资料'
					}
				},
				{
					path: '/CardManage',
					name: 'CardManage',
					component: resolve => require(['../pages/card/CardManage.vue'], resolve),
					meta: {
						title: '卡片管理'
					}
				}
			]
		},
		{
			path: '/login',
			name: 'login',
			component: resolve => require(['../pages/login.vue'], resolve)
		},
		{
			path: '/register',
			name: 'register',
			component: resolve => require(['../pages/register.vue'], resolve),
			meta: {
				title: '注册'
			}
		},
	]
})
// function requireAuth (to, from, next) {
//   if (auth.loggedIn() === 'null' || auth.loggedIn() === null) {
//     next({
//       path: '/',
//       query: { redirect: to.fullPath }
//     })
//   } else {
//     next()
//   }
// }

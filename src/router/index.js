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
			children: [{
					path: '/index',
					name: 'index',
					component: resolve => require(['../pages/index.vue'], resolve),
					meta: {
						title: '首页'
					}
				},
				{
					path: '/orderPlacingManage',
					name: 'orderPlacingManage',
					component: resolve => require(['../pages/order/orderPlacingManage.vue'], resolve),
					meta: {
						title: '下单管理'
					}
				},
				{
					path: '/AdditionalOrder',
					name: 'AdditionalOrder',
					component: resolve => require(['../pages/order/AdditionalOrder.vue'], resolve),
					meta: {
						title: '加购订单'
					}
				},
				{
					path: '/wishOrder',
					name: 'wishOrder',
					component: resolve => require(['../pages/order/wishOrder.vue'], resolve),
					meta: {
						title: '心愿订单'
					}
				},
				{
					path: '/likesOrder',
					name: 'likesOrder',
					component: resolve => require(['../pages/order/likesOrder.vue'], resolve),
					meta: {
						title: '点赞订单'
					}
				},
				{
					path: '/QAorder',
					name: 'QAorder',
					component: resolve => require(['../pages/order/QAorder.vue'], resolve),
					meta: {
						title: 'QA订单'
					}
				},
				{
					path: '/placeOrderTask',
					name: 'placeOrderTask',
					component: resolve => require(['../pages/task/placeOrderTask.vue'], resolve),
					meta: {
						title: '下单任务'
					}
				},
				{
					path: '/addPurchaseTask',
					name: 'addPurchaseTask',
					component: resolve => require(['../pages/task/addPurchaseTask.vue'], resolve),
					meta: {
						title: '加购任务'
					}
				},
				{
					path: '/wishTask',
					name: 'wishTask',
					component: resolve => require(['../pages/task/wishTask.vue'], resolve),
					meta: {
						title: '心愿单任务'
					}
				},
				{
					path: '/likesTask',
					name: 'likesTask',
					component: resolve => require(['../pages/task/likesTask.vue'], resolve),
					meta: {
						title: '点赞任务'
					}
				},
				{
					path: '/QaTask',
					name: 'QaTask',
					component: resolve => require(['../pages/task/QaTask.vue'], resolve),
					meta: {
						title: 'QA任务'
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
					path: '/customerList',
					name: 'customerList',
					component: resolve => require(['../pages/customer/customerList.vue'], resolve),
					meta: {
						title: '客户列表'
					}
				},
				{
					path: '/refundOrder',
					name: 'refundOrder',
					component: resolve => require(['../pages/customer/refundOrder.vue'], resolve),
					meta: {
						title: '退款订单'
					}
				},
				{
					path: '/takeMoneyList',
					name: 'takeMoneyList',
					component: resolve => require(['../pages/customer/takeMoneyList.vue'], resolve),
					meta: {
						title: '提现记录'
					}
				},
				{
					path: '/takeMoneySet',
					name: 'takeMoneySet',
					component: resolve => require(['../pages/customer/takeMoneySet.vue'], resolve),
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
						title: '动态IP池'
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
					path: '/commentType',
					name: 'commentType',
					component: resolve => require(['../pages/ParameterConfig/commentType.vue'], resolve),
					meta: {
						title: '留评类型'
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
				}
			]
		},
		{
			path: '/login',
			name: 'name',
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
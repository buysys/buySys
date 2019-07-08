import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import Login from '@/pages/login'
// import auth from './auth'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
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
          meta: {title: '首页'}
        },
        {
          path: '/orderPlacingManage',
          name: 'orderPlacingManage',
          component: resolve => require(['../pages/orderPlacingManage.vue'], resolve),
          meta: {title: '下单管理'}
        },
        {
          path: '/AdditionalOrder',
          name: 'AdditionalOrder',
          component: resolve => require(['../pages/AdditionalOrder.vue'], resolve),
          meta: {title: '加购订单'}
        },
        {
          path: '/wishOrder',
          name: 'wishOrder',
          component: resolve => require(['../pages/wishOrder.vue'], resolve),
          meta: {title: '心愿订单'}
        },
        {
          path: '/likesOrder',
          name: 'likesOrder',
          component: resolve => require(['../pages/likesOrder.vue'], resolve),
          meta: {title: '点赞订单'}
        },
        {
          path: '/QAorder',
          name: 'QAorder',
          component: resolve => require(['../pages/QAorder.vue'], resolve),
          meta: {title: 'QA订单'}
        },
        {
          path: '/placeOrderTask',
          name: 'placeOrderTask',
          component: resolve => require(['../pages/task/placeOrderTask.vue'], resolve),
          meta: {title: '下单任务'}
        },
        {
          path: '/addPurchaseTask',
          name: 'addPurchaseTask',
          component: resolve => require(['../pages/task/addPurchaseTask.vue'], resolve),
          meta: {title: '加购任务'}
        },
        {
          path: '/wishTask',
          name: 'wishTask',
          component: resolve => require(['../pages/task/wishTask.vue'], resolve),
          meta: {title: '心愿单任务'}
        },
        {
          path: '/likesTask',
          name: 'likesTask',
          component: resolve => require(['../pages/task/likesTask.vue'], resolve),
          meta: {title: '点赞任务'}
        },
        {
          path: '/QaTask',
          name: 'QaTask',
          component: resolve => require(['../pages/task/QaTask.vue'], resolve),
          meta: {title: 'QA任务'}
        },
        {
          path: '/buyNumLevel',
          name: 'buyNumLevel',
          component: resolve => require(['../pages/buyNum/buyNumLevel.vue'], resolve),
          meta: {title: '买号等级'}
        },
        {
          path: '/buyNumList',
          name: 'buyNumList',
          component: resolve => require(['../pages/buyNum/buyNumList.vue'], resolve),
          meta: {title: '买号列表'}
        },
        {
          path: '/registerAccount',
          name: 'registerAccount',
          component: resolve => require(['../pages/buyNum/registerAccount.vue'], resolve),
          meta: {title: '注册账号'}
        },
        {
          path: '/VirtualCard',
          name: 'VirtualCard',
          component: resolve => require(['../pages/card/VirtualCard.vue'], resolve),
          meta: {title: '虚拟卡管理'}
        },
				{
				  path: '/register',
				  name: 'register',
				  component: resolve => require(['../pages/register.vue'], resolve),
				  meta: {title: '注册'}
				}
      ]
    },
    {
      path: '/login',
      name: 'name',
      component: resolve => require(['../pages/login.vue'], resolve)
    }
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

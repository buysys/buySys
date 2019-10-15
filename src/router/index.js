import Vue from 'vue'
import Router from 'vue-router'
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
          path: '/buyNumList',
          name: 'buyNumList',
          component: resolve => require(['../pages/buyNum/buyNumList.vue'], resolve),
          meta: {
            title: '账号管理'
          }
        },
        {
          path: '/CardManage',
          name: 'CardManage',
          component: resolve => require(['../pages/card/CardManage.vue'], resolve),
          meta: {
            title: '卡片管理'
          }
        },
        {
          path: '/customerList',
          name: 'customerList',
          component: resolve => require(['../pages/customer/customerList.vue'], resolve),
          meta: {
            title: '客户管理'
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
          path: '/financeManage',
          name: 'financeManage',
          component: resolve => require(['../pages/finance/financeManage.vue'], resolve),
          meta: {
            title: '财务管理'
          }
        },
        {
          path: '/systemSettings',
          name: 'systemSettings',
          component: resolve => require(['../pages/ParameterConfig/systemSettings.vue'], resolve),
          meta: {
            title: '系统设置'
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

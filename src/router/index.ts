import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import crmLayout from '@/views/layout/layout-crm.vue'
// import adminLayout from '@/views/layout/layout-admin.vue'
import login from '@/views/login/index.vue'
import taskApproval from './modules/taskApproval'
import crmMoudule from './modules/crmMoudule'
import adminMoudule from './modules/admin'
Vue.use(VueRouter)
const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/crm'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  ...taskApproval,
  ...crmMoudule,
  ...adminMoudule
]
console.log(routes)
const router = new VueRouter({
  routes
})
router.beforeEach((to: any, from: any, next: any) => {
  if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
    if (localStorage.getItem('loginTime') && Number(new Date().getTime()) > Number(localStorage.getItem('loginTime'))) {
      localStorage.clear()
      next({
        path: '/login' // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    } else {
      if (localStorage.getItem('loginCode') === '200') {
        next()
      } else {
        localStorage.removeItem('weatherValue')
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    }
  } else {
    next()
  }
})
export default router

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: require('@/components/List').default
    },
    {
      path: '/list:query',
      redirect: '/'
    },
    {
      path: '/add:id',
      name: 'add',
      component: require('@/components/Add').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

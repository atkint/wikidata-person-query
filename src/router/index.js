import Vue from 'vue'
import Router from 'vue-router'
import AddPerson from '@/components/AddPerson'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AddPerson',
      component: AddPerson
    },
    {
      path: '/AddPerson',
      name: 'AddPerson',
      component: AddPerson
    }
    
  ]
})

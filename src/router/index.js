import { createRouter, createWebHistory } from 'vue-router'

import PageHome from '@/components/PageHome'
import PageNotFound from '@/components/PageNotFound'
import PageThreadShow from '@/components/PageThreadShow'
import sourceData from '@/data.json'

const routes = [
  { path: '/', name: 'Home', component: PageHome },
  { path: '/thread/:id', name: 'ThreadShow', component: PageThreadShow, props: true, beforeEnter: (to, from, next) => {
    // check if thread exists
    const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)
    // if exists continue
    if (threadExists) {
      return next()
    }
    // if doesn´t exist redirect user to PageNotFound
    else {
      return next({name: 'NotFound', params: { pathMatch: to.$route.path.substring(1).split('/') }, 
      // preserve existing query and hash
      query: to.query, hash: to.hash})
    }
  }},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
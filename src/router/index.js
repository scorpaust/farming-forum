import { createRouter, createWebHistory } from 'vue-router'

import Category from '@/pages/Category'
import Forum from '@/pages/Forum'
import PageHome from '@/pages/Home'
import PageNotFound from '@/pages/NotFound'
import PageThreadShow from '@/pages/ThreadShow'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import SignIn from '@/pages/SignIn'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import { findById } from'@/helpers'
import store from '@/store'

const routes = [
  { path: '/', name: 'Home', component: PageHome },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  { path: '/thread/:id', name: 'ThreadShow', component: PageThreadShow, props: true, async beforeEnter (to, from, next) {

    await store.dispatch('threads/fetchThread', {id: to.params.id })

    // check if thread exists
    const threadExists = findById(store.state.threads.items, to.params.id)
    // if exists continue
    if (threadExists) {
      return next()
    }
    // if doesn´t exist redirect user to PageNotFound
    else {
      console.log("não existe")
      return next({name: 'NotFound', params: { pathMatch: to.path.substring(1).split('/') }, 
      // preserve existing query and hash
      query: to.query, hash: to.hash})
    }
  }},
  { path: '/forum/:forumId/thread/create', name: 'ThreadCreate', component: ThreadCreate, props: true, meta: { requiresAuth: true }},
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  { path: '/forum/:id', name: 'Forum', component: Forum, props: true },
  { path: '/category/:id', name: 'Category', component: Category, props: true },
  { path: '/signin', name: 'SignIn', component: SignIn, meta: { requiresGuest: true } },
  { path: '/signout', name: 'SignOut', async beforeEnter (to, from) {
    await store.dispatch('auth/signOut')
    return { name: 'Home'}
  } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query:  { redirectTo: to.path }}
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home'}
  }
})

export default router
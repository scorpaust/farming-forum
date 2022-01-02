import { createRouter, createWebHistory } from 'vue-router'

import { findById } from'@/helpers'
import store from '@/store'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home')},
  {
    path: '/me',
    name: 'Profile',
    component: () => import('@/pages/Profile'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import('@/pages/Profile'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  { path: '/thread/:id', name: 'ThreadShow', component: () => import('@/pages/ThreadShow'), props: true, async beforeEnter (to, from, next) {

    await store.dispatch('threads/fetchThread', {id: to.params.id, once: true })

    // check if thread exists
    const threadExists = findById(store.state.threads.items, to.params.id)
    // if exists continue
    if (threadExists) {
      return next()
    }
    // if doesn´t exist redirect user to PageNotFound
    else {
      return next({name: 'NotFound', params: { pathMatch: to.path.substring(1).split('/') }, 
      // preserve existing query and hash
      query: to.query, hash: to.hash})
    }
  }},
  { path: '/forum/:forumId/thread/create', name: 'ThreadCreate', component: () => import('@/pages/ThreadCreate'), props: true, meta: { requiresAuth: true }},
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import('@/pages/ThreadEdit'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register'),
    meta: { requiresGuest: true }
  },
  { path: '/forum/:id', name: 'Forum', component: () => import('@/pages/Forum'), props: true },
  { path: '/category/:id', name: 'Category', component: () => import('@/pages/Category'), props: true },
  { path: '/signin', name: 'SignIn', component: () => import('@/pages/SignIn'), meta: { requiresGuest: true } },
  { path: '/signout', name: 'SignOut', async beforeEnter (to, from) {
    await store.dispatch('auth/signOut')
    return { name: 'Home'}
  } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFound'), },
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

router.afterEach(() => {
  store.dispatch('clearItems', {modules: ['categories', 'forums', 'posts', 'threads']})
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
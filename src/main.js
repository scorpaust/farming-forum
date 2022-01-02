import App from './App.vue'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrollDirective from '@/plugins/PageScrollDirective'
import VeeValidatePlugin from "@/plugins/VeeValidatePlugin"
import Vue3Pagination from '@/plugins/Vue3Pagination'
import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { firebaseConfig }  from "@/config/firebase.js"
import fontAwesome from './plugins/fontAwesome'
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeApp } from "firebase/app";
import router from '@/router'
import store from '@/store'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(fontAwesome)
forumApp.use(ClickOutsideDirective)
forumApp.use(PageScrollDirective)
forumApp.use(Vue3Pagination)
forumApp.use(VeeValidatePlugin)
forumApp.use(createHead())

const components = import.meta.globEager('./components/App*')

Object.entries(components).forEach(([path, definition]) => {
  // Get name of component, based on filename
  // "./components/Fruits.vue" will become "Fruits"
  const componentName = path.split('/').pop().replace(/\.\w+$/, '')

  // Register component on this Vue instance
  forumApp.component(componentName, definition.default)
})

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const mystorage = getStorage(app)
forumApp.mount('#app')

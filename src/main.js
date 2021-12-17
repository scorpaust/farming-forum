import App from './App.vue'
import AppDate from '@/components/AppDate.vue'
import { createApp } from 'vue'
import firebaseConfig from "@/config/firebase"
import fontAwesome from './plugins/fontAwesome'
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import router from '@/router'
import store from '@/store'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(fontAwesome)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

getAuth().onAuthStateChanged(user => {
  store.dispatch('unsubscribeAuthUserSnapshot')
  if (user) {
    store.dispatch('fetchAuthUser')
  }
})


forumApp.mount('#app')

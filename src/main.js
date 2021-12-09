import App from './App.vue'
import AppDate from '@/components/AppDate.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { firebaseConfig } from "@/config/firebase"
import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { library } from '@fortawesome/fontawesome-svg-core'
import router from '@/router'
import store from '@/store'

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)

library.add(faGlobe)
forumApp.component('font-awesome-icon', FontAwesomeIcon)

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

forumApp.mount('#app')

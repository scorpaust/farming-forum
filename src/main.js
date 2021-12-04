import App from './App.vue'
import { createApp } from 'vue'
import router from '@/router'

const forumApp = createApp(App)

forumApp.use(router)
forumApp.mount('#app')

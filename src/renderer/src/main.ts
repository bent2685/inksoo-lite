import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@renderer/store'
import 'uno.css'
import './assets/base.scss'
import './assets/unocss-icons'
const app = createApp(App)
app.use(pinia)
app.mount('#app')

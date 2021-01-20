import Vue from 'vue'
import App from './App'
import './static/css/global.css'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

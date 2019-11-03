import Vue from 'vue'
import App from './App.vue'
import EleForm from 'vue-ele-form'
import ElementUI from 'element-ui'
import EleFormDynamic from '../src/EleFormDynamic.vue'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(EleForm)
Vue.component('dynamic', EleFormDynamic)

new Vue({
  render: h => h(App)
}).$mount('#app')

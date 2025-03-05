import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import router from './router'
import store from './store'
import App from './App.vue'
import axiosIns from '@/libs/axios'
import 'vue-select/dist/vue-select.css'

import { extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import '@validations';
import { VBTooltip } from 'bootstrap-vue'
import Dayjs from 'vue-dayjs'

Vue.use(Dayjs, {
  // language set, default cn
  lang: 'es',
  filters: {
    ago: 'ago',
  },
  directives: {
    countdown: 'countdown',
  },
})

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})

Vue.directive('b-tooltip', VBTooltip)

import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

Vue.prototype.$http = axiosIns

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

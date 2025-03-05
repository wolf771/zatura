/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'


import state from "./state.js"
import getters from "./getters.js"
import mutations from "./mutations.js"
import actions from "./actions.js"

Vue.use(Vuex)

import moduleTodo from './todo/moduleTodo.js'
import moduleCalendar from './calendar/moduleCalendar.js'
import moduleChat from './chat/moduleChat.js'
import moduleEmail from './email/moduleEmail.js'
import moduleAuth from './auth/moduleAuth.js'
import moduleECommerce from './eCommerce/moduleECommerce.js'


export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
        todo: moduleTodo,
        calendar: moduleCalendar,
        chat: moduleChat,
        email: moduleEmail,
        auth: moduleAuth,
        eCommerce: moduleECommerce,
    },
    strict: process.env.NODE_ENV !== 'production'
})

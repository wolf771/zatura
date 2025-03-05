import API from '@/libs/axios'

const initialState = {
  submitLoading: false,
  doc: {
    date: null,
    amount: '',
    reference: '',
    payment_method: '',
    description: '',
  },
}
export default {
  namespaced: true,
  state: {
    submitLoading: false,
    doc: {
      date: null,
      amount: '',
      reference: '',
      payment_method: '',
      description: '',
    },

  },
  getters: {},
  mutations: {
    SET_DOCUMENT_DATA(state, document) {
      state.documentData = document
    },
    SET_SUBMIT_LOADING(state, value) {
      state.submitLoading = value
    },
    SET_INITIAL_STATE(state) {
      state.doc = { ...initialState.doc }
    },
  },
  actions: {
    async setInitialState({ commit }) {
      commit('SET_INITIAL_STATE')
    //   return new Promise((resolve, reject) => {
    //     API.post('companies/edit-company-email-configs', data).then(response => {
    //       resolve(response?.data)
    //       commit('SET_SUBMIT_LOADING', false)
    //     }).catch(e => {
    //       reject(e)
    //       commit('SET_SUBMIT_LOADING', false)
    //     })
    //   })
    },
    async submit({ commit }, data) {
    //   commit('SET_SUBMIT_LOADING', true)
    //   return new Promise((resolve, reject) => {
    //     API.post('companies/edit-company-email-configs', data).then(response => {
    //       resolve(response?.data)
    //       commit('SET_SUBMIT_LOADING', false)
    //     }).catch(e => {
    //       reject(e)
    //       commit('SET_SUBMIT_LOADING', false)
    //     })
    //   })
    },
  },
}

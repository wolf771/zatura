import API from '@/libs/axios'

const initialState = {
  emailData: {
    username: '',
    fromEmail: '',
    password: '',
    fromName: '',
    host: '',
    port: '',
    protocol: '',
    encryption: '',
  },
}
export default {
  namespaced: true,
  state: {
    loading: false,
    submitLoading: false,
    emailData: {
      username: '',
      fromEmail: '',
      password: '',
      fromName: '',
      host: '',
      port: '',
      protocol: '',
      encryption: '',
    },

  },
  getters: {},
  mutations: {
    SET_EMAIL_DATA(state, email_data) {
      state.emailData = { ...email_data, fromEmail: email_data.from_email, fromName: email_data.from_name }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SUBMIT_LOADING(state, loading) {
      state.submitLoading = loading
    },
    SET_INITIAL_STATE(state) {
      state.emailData = initialState.emailData
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async get({ commit }, { company_id }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get(`companies/email-configs/${company_id}?type=reception_document`)
        commit('SET_EMAIL_DATA', response?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    async submit({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post('companies/edit-company-email-configs', data).then(response => {
          resolve(response?.data)
          commit('SET_SUBMIT_LOADING', false)
        }).catch(e => {
          reject(e)
          commit('SET_SUBMIT_LOADING', false)
        })
      })
    },
  },
}

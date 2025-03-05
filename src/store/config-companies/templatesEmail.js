import API from '@/libs/axios'

const initialState = {
  template: {},
  templates: [],
}
export default {
  namespaced: true,
  state: {
    loading: false,
    submitLoading: false,
    templates: [],
    template: {},

  },
  getters: {},
  mutations: {
    SET_TEMPLATES_EMAIL_DATA(state, templates) {
      state.templates = { ...templates }
      const template = templates[0]
      state.template = template
    },
    SET_TEMPLATE_EMAIL(state, tabIndex) {
      state.template = state.templates[tabIndex]
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SUBMIT_LOADING(state, loading) {
      state.submitLoading = loading
    },
    SET_INITIAL_STATE(state) {
      state.templates = initialState.templates
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async get({ commit }, { company_id }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get(`companies/template-emails/${company_id}`)
        commit('SET_TEMPLATES_EMAIL_DATA', response?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    async setTemplateEmail({ commit }, { tabIndex }) {
      commit('SET_TEMPLATE_EMAIL', tabIndex)
    },
    async submit({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post('companies/edit-company-template-emails', data).then(response => {
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

import API from '@/libs/axios'

const initialState = {
  term: {},
  terms: [],
}
export default {
  namespaced: true,
  state: {
    loading: false,
    submitLoading: false,
    terms: [],
    term: {},

  },
  getters: {},
  mutations: {
    SET_TERMS_DATA(state, terms) {
      state.terms = { ...terms }
      const term = terms[0]
      state.term = term
    },
    SET_TERM(state, tabIndex) {
      state.term = state.terms[tabIndex]
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SUBMIT_LOADING(state, loading) {
      state.submitLoading = loading
    },
    SET_INITIAL_STATE(state) {
      state.terms = initialState.terms
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async get({ commit }, { company_id }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get(`companies/terms/${company_id}`)
        commit('SET_TERMS_DATA', response?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    async setTerm({ commit }, { tabIndex }) {
      commit('SET_TERM', tabIndex)
    },
    async submit({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post('companies/edit-company-term', data).then(response => {
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

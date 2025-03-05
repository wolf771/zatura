import API from '@/libs/axios'
import { isEmpty } from 'lodash'

const initialState = {
  hacienda: {
    username: '',
    password: '',
    pin: '',
    key: null,
    cfe: 0,
    cte: 0,
    cnc: 0,
    cnd: 0,
    ccce: 0,
    cpce: 0,
    crce: 0,
    fec: 0,
    type: false,
  },
}
export default {
  namespaced: true,
  state: {
    loading: false,
    submitLoading: false,
    hacienda: {
      username: '',
      password: '',
      pin: '',
      key: null,
      cfe: 0,
      cte: 0,
      cnc: 0,
      cnd: 0,
      ccce: 0,
      cpce: 0,
      crce: 0,
      fec: 0,
      type: false,
    },

  },
  getters: {},
  mutations: {
    SET_HACIENDA_DATA(state, hacienda) {
      if (isEmpty(hacienda)) {
        state.hacienda = { ...initialState.hacienda }
      } else {
        state.hacienda = { ...hacienda, type: hacienda.type !== 'prod' }
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SUBMIT_LOADING(state, loading) {
      state.submitLoading = loading
    },
    SET_INITIAL_STATE(state) {
      state.hacienda = initialState.hacienda
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async get({ commit }, { company_id }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get(`companies/hacienda-configs/${company_id}`)
        commit('SET_HACIENDA_DATA', response?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    async submit({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post('companies/edit-company-hacienda-configs', data).then(response => {
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

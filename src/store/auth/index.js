/* eslint-disable consistent-return */
import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    user: null,
    company: null,
    paymentTerms: [],
    consecutives: {
      fe: '0000000000',
      nc: '0000000000',
      nd: '0000000000',
      te: '0000000000',
      cce: '0000000000',
      cpce: '0000000000',
      rce: '0000000000',
      qt: '0000000000',
      fec: '0000000000',
      fr: '0000000000',
    },
    loginLoading: false,
  },
  getters: {},
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOGIN_LOADING(state, val) {
      state.loginLoading = val
    },
    SET_COMPANY(state, company) {
      state.company = company
    },
    SET_COMPANIES(state, companies) {
      state.companies = companies
    },
    SET_INIT_DATA(state, initData) {
      state.paymentTerms = initData.payment_terms
      state.consecutives = initData.consecutives
    },

  },
  actions: {
    async login({ commit }, { email, password }) {
      commit('SET_LOGIN_LOADING', true)
      // eslint-disable-next-line no-useless-catch
      try {
        const { data } = await API.post('auth/login', {
          email,
          password,
        })
        commit('SET_LOGIN_LOADING', false)
        if (data.success) {
          commit('SET_USER', data?.data?.user)
          commit('SET_COMPANY', data?.data?.active_company)
          commit('SET_COMPANIES', data?.data?.companies)
          localStorage.setItem('token', data?.data?.token)
          localStorage.setItem('zaturacom', data?.data?.active_company?.id)
        }
        return data
      } catch (error) {
        commit('SET_LOGIN_LOADING', false)
        throw error
      }
    },
    async me({ commit }) {
      try {
        const { data } = await API.get('auth/me')
        commit('SET_USER', data?.data?.user)
        commit('SET_COMPANY', data?.data?.active_company)
        commit('SET_COMPANIES', data?.data?.companies)
        localStorage.setItem('zaturacom', data?.data?.active_company?.id)
        return data
      } catch (error) {
        console.log(error)
      }
    },
    async logout({ commit }) {
      try {
        await API.post('auth/logout')
        commit('SET_USER', null)
        commit('SET_COMPANY', null)
        localStorage.removeItem('token')
      } catch (error) {
        console.log(error)
      }
    },
    async changeActiveCompany({ commit }, companyId) {
      try {
        const { data } = await API.post('auth/change-active-company', {
          companyId,
        })
        commit('SET_COMPANY', data?.data)
        localStorage.setItem('zaturacom', data?.data?.id)

        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async getInitData({ commit }) {
      try {
        const { data } = await API.get('company-init-data')
        commit('SET_INIT_DATA', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
  },
}

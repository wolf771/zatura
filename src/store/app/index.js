/* eslint-disable consistent-return */
import { $themeBreakpoints } from '@themeConfig'
import API from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    register: {
      user: null,
      company: null,
      hacienda: null,
      haciendaRequired: false,
      emailData: null,
      existingUser: false,
      emailStepRequired: false,
      customEmailConfig: false,
      userId: '',
    },
    registerLoading: false,
    initData: {
      countries: [],
      provinces: [],
      cantons: [],
      districts: [],
      product_categories: [],
      tax_codes: [],
      tax_types: [],
      units: [],
      currencies: [],
      payment_methods: [],
      payment_forms: [],
      payment_terms: [],
      economic_activities: [],
      plans: [],
    },
    users: [],
    cantons: [],
    districts: [],
    barrios: [],
    windowWidth: 0,
    shallShowOverlay: false,
    identificationTypes: [
      { value: '01', text: 'Cédula Física' },
      { value: '02', text: 'Cédula Juridica' },
      { value: '03', text: 'DIMEX' },
      { value: '04', text: 'NITE' },
    ],
    cabysCodes: [],
  },
  getters: {
    currentBreakPoint: state => {
      const { windowWidth } = state
      if (windowWidth >= $themeBreakpoints.xl) return 'xl'
      if (windowWidth >= $themeBreakpoints.lg) return 'lg'
      if (windowWidth >= $themeBreakpoints.md) return 'md'
      if (windowWidth >= $themeBreakpoints.sm) return 'sm'
      return 'xs'
    },
  },
  mutations: {
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
    },
    SET_INIT_DATA(state, val) {
      state.initData = val
    },
    SET_CANTONS(state, val) {
      state.cantons = val
    },
    SET_DISTRICTS(state, val) {
      state.districts = val
    },
    SET_BARRIOS(state, val) {
      state.barrios = val
    },
    SET_REGISTER(state, val) {
      state.register = { ...state.register, ...val }
    },
    SET_REGISTER_LOADING(state, val) {
      state.registerLoading = val
    },
    SET_CABYS_CODES(state, val) {
      console.log(val)
      state.cabysCodes = val
    },
    SET_USERS(state, val) {
      state.users = val
    },
  },
  actions: {
    async getInitData({ commit }) {
      try {
        const { data } = await API.get('get-init-data')
        commit('SET_INIT_DATA', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async getCantonsByProvinceNumber({ commit }, provinceNumber) {
      try {
        const { data } = await API.get('get-cantons-by-province-number', {
          params: { provinceNumber },
        })
        commit('SET_CANTONS', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async getUsers({ commit }) {
      try {
        const { data } = await API.get('auth/get-users')
        commit('SET_USERS', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async getDistrictsByCantonNumber(
      { commit },
      { provinceNumber, cantonNumber },
    ) {
      try {
        const { data } = await API.get('get-districts-by-canton-number', {
          params: { provinceNumber, cantonNumber },
        })
        commit('SET_DISTRICTS', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async getBarriosByDistrictNumber(
      { commit },
      { provinceNumber, cantonNumber, districtNumber },
    ) {
      try {
        const { data } = await API.get('get-barrios-by-district-number', {
          params: { provinceNumber, cantonNumber, districtNumber },
        })
        commit('SET_BARRIOS', data?.data)
        return data?.data
      } catch (error) {
        console.log(error)
      }
    },
    async register({ commit }, data) {
      commit('SET_REGISTER_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post('register', data).then(response => {
          commit('SET_REGISTER', {})
          commit('SET_REGISTER_LOADING', false)
          resolve(response?.data)
        }).catch(e => {
          commit('SET_REGISTER_LOADING', false)
          reject(e)
        })
      })
    },
    async getCabysCodes({ commit }, data) {
      try {
        const { data: response } = await API.get('get-cabys-codes', {
          params: { ...data },
        })
        commit('SET_CABYS_CODES', response?.data)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
  },
}

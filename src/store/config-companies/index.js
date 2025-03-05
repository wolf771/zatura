import API from '@/libs/axios'

const initialState = {
  company: {
    name: '',
    fantasy_name: '',
    identification_type: '',
    identification: '',
    email: '',
    phone: '',
    province: '',
    canton: '',
    district: '',
    barrio: '',
    other_signs: '',
    database: '',
    logo: '',
    logo_file: null,
    economic_activity: '',
    country_id: '',
  },
  other_configs: {
    custom_quotation_name: '',
    currency: {},
    mode_pos: false,
    currency_emit_doc: 0,
    stop_generate_xmls: false,
  },
}
export default {
  namespaced: true,
  state: {
    loading: false,
    submitLoading: false,
    company: {
      name: '',
      fantasy_name: '',
      identification_type: '',
      identification: '',
      email: '',
      phone: '',
      province: '',
      canton: '',
      district: '',
      barrio: '',
      other_signs: '',
      database: '',
      logo: '',
      logo_file: null,
      economic_activity: '',
      country_id: '',
    },
    other_configs: {
      custom_quotation_name: '',
      currency: {},
      mode_pos: false,
      currency_emit_doc: 0,
      stop_generate_xmls: false,
    },
  },
  getters: {},
  mutations: {
    SET_COMPANY(state, company) {
      const other_configs = { ...company.other_configs }
      // eslint-disable-next-line prefer-const
      let companyData = company
      delete companyData.other_configs
      state.company = {
        ...companyData,
        canton: companyData.cantons.number,
        district: companyData.districts.number,
        province: companyData.provinces.id,
        barrio: companyData.barrio_id,
        economic_activity: companyData.economic_activity_id,
      }
      state.other_configs = {
        ...state.other_configs,
        currency: JSON.parse(other_configs.currency.value).id,
        custom_quotation_name: other_configs.custom_quotation_name.value,
        mode_pos: other_configs.mode_pos.value === 'true',
        currency_emit_doc: other_configs.currency_emit_doc.value,
        stop_generate_xmls: other_configs.stop_generate_xmls.value === 'true',
      }
    },
    SET_DATA(state, val) {
      state.company = { ...state.company, ...val }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_SUBMIT_LOADING(state, value) {
      state.submitLoading = value
    },
    SET_INITIAL_STATE(state) {
      state.company = initialState.company
      state.other_configs = initialState.other_configs
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async get({ commit, dispatch }, { company_id }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get(`companies/${company_id}`)
        const company = response?.data
        await dispatch(
          'app/getCantonsByProvinceNumber',
          company.provinces.number,
          { root: true },
        )
        await dispatch(
          'app/getDistrictsByCantonNumber',
          {
            cantonNumber: company.cantons.number,
            provinceNumber: company.provinces.number,
          },
          { root: true },
        )
        await dispatch(
          'app/getBarriosByDistrictNumber',
          {
            cantonNumber: company.cantons.number,
            provinceNumber: company.provinces.number,
            districtNumber: company.districts.number,
          },
          { root: true },
        )
        commit('SET_COMPANY', company)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    async submit({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      return new Promise((resolve, reject) => {
        API.post(
          'companies/edit-company-general-configs',
          data,
        ).then(response => {
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

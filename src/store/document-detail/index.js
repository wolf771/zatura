// eslint-disable-next-line import/no-extraneous-dependencies
import API from '@/libs/axios'
import { perPageOptions } from '../../constants'

export default {
  namespaced: true,
  state: {
    document: null,
    items: [],
    perPage: 10,
    currentPage: 1,
    totalRows: 3,
    pageOptions: perPageOptions,
    searchTerm: '',
    loading: false,
  },
  getters: {},
  mutations: {
    SET_DOCUMENT(state, document) {
      state.document = document
    },
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_PER_PAGE(state, perPage) {
      state.perPage = perPage
    },
    SET_CURRENT_PAGE(state, currentPage) {
      state.currentPage = currentPage
    },
    SET_TOTAL_ROWS(state, totalRows) {
      state.totalRows = totalRows
    },
    SET_SEARCH_TERM(state, searchTerm) {
      state.searchTerm = searchTerm
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
  },
  actions: {
    async get({ commit }, { type, id }) {
      try {
        const { data: response } = await API.get(
          `document-detail/${type}/${id}`,
        )

        commit('SET_DOCUMENT', response?.data)
        return response?.data
      } catch (error) {
        console.log(error)
      }
      return false
    },

    async getInvoices({ commit, state }, { currentPage }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get('invoices', {
          params: {
            page: currentPage,
            per_page: state.perPage,
            searchTerm: state.searchTerm,
          },
        })

        commit('SET_PER_PAGE', response?.data?.per_page)
        commit('SET_CURRENT_PAGE', response?.data?.current_page)
        commit('SET_TOTAL_ROWS', response?.data?.total)
        commit('SET_ITEMS', response?.data?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getTickets({ commit, state }, { currentPage }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get('tickets', {
          params: {
            page: currentPage,
            per_page: state.perPage,
            searchTerm: state.searchTerm,
          },
        })

        commit('SET_PER_PAGE', response?.data?.per_page)
        commit('SET_CURRENT_PAGE', response?.data?.current_page)
        commit('SET_TOTAL_ROWS', response?.data?.total)
        commit('SET_ITEMS', response?.data?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getQuotations({ commit, state }, { currentPage }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get('quotations', {
          params: {
            page: currentPage,
            per_page: state.perPage,
            searchTerm: state.searchTerm,
          },
        })

        commit('SET_PER_PAGE', response?.data?.per_page)
        commit('SET_CURRENT_PAGE', response?.data?.current_page)
        commit('SET_TOTAL_ROWS', response?.data?.total)
        commit('SET_ITEMS', response?.data?.data)
        commit('SET_LOADING', false)
        return response?.data
      } catch (error) {
        console.log(error)
      }
      return false
    },

    perPageChange({ commit }, perPage) {
      commit('SET_PER_PAGE', perPage)
    },
    searchTermChange({ commit }, searchTerm) {
      commit('SET_SEARCH_TERM', searchTerm)
    },
  },
}

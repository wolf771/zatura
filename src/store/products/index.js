import API from '@/libs/axios'
import { perPageOptions } from '../../constants'

export default {
  namespaced: true,
  state: {
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
    // ////////////////////////////GET PRODUCT////////////////////////////////////////////
    async get({ commit, state }, { currentPage }) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.get('products', {
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
    },
    // /////////////////////////////////SAVE PRODUCT//////////////////////////////////////////////
    async save({ commit, state }, payload) {
      try {
        commit('SET_LOADING', true)
        const { data: response } = await API.post('products', payload)

        if (!payload?.id) {
          commit('SET_ITEMS', [response?.data, ...state.items])
          commit('SET_LOADING', false)
        } else {
          commit(
            'SET_ITEMS',
            state.items.map(item => (item.id === payload.id ? response?.data : item)),
          )
          commit('SET_LOADING', false)
        }
        return response?.data
      } catch (error) {
        console.log(error)
      }
    },
    /// /////////////////////////////////DELETE PRODUCT////////////////////////////////////////////
    async delete({ commit, state }, payload) {
      try {
        commit('SET_LOADING', true)
        console.log(payload)
        const { data: response } = await API.delete('products', {
          params: payload,
        })
        if (response?.success) {
          const items = state.items.filter(item => item.id !== payload.id)
          commit('SET_ITEMS', items)
        }
        commit('SET_LOADING', false)
      } catch (error) {
        console.log(error)
      }
    },
    perPageChange({ commit }, perPage) {
      commit('SET_PER_PAGE', perPage)
    },
    searchTermChange({ commit }, searchTerm) {
      commit('SET_SEARCH_TERM', searchTerm)
    },
  },
}

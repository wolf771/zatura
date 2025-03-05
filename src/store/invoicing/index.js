// eslint-disable-next-line import/no-extraneous-dependencies
import API from '@/libs/axios'
import { Decimal } from 'decimal.js'

export default {
  namespaced: true,
  state: {
    clients: [],
    products: [],
    items: [],
    currency: null,
    term: {},
    submitLoading: false,
  },
  getters: {
    subtotal: state => state.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    ),
    total: (state, getters) => getters.subtotal - getters.discount + getters.tax,
    tax: state => {
      const taxes = state.items.map(item => {
        const flatTaxes = item.taxes.flat()
        const trs = flatTaxes.map(tax => {
          const decimal = new Decimal(tax.tax_type.rate)
          return decimal.toNumber() / 100
        })

        const total = trs.reduce((acc, tr) => acc + tr, 0)

        const decimalDiscount = new Decimal(item.discount || 0)
        const dis = decimalDiscount.toNumber() / 100
        const totalDiscount = item.price * item.quantity * dis
        const subtotal = item.price * item.quantity - totalDiscount

        return subtotal * total
      })

      const totalTax = taxes.reduce((acc, tr) => acc + tr, 0)

      return totalTax
    },
    discount: state => {
      const discounts = state.items.map(i => {
        const decimal = new Decimal(i.discount || 0)
        const dis = decimal.toNumber() / 100

        return i.price * i.quantity * dis
      })

      const totalDiscount = discounts.reduce((acc, tr) => acc + tr, 0)
      return totalDiscount
    },
  },
  mutations: {
    SET_CLIENTS(state, clients) {
      state.clients = clients
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_ITEM(state, item) {
      state.items.push(item)
    },
    REMOVE_ITEM(state, index) {
      state.items.splice(index, 1)
    },
    UPDATE_ITEM(state, { index, item }) {
      state.items.splice(index, 1, item)
    },
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_CURRENCY(state, currency) {
      state.currency = currency
    },
    SET_SUBMIT_LOADING(state, value) {
      state.submitLoading = value
    },
    SET_TERMS_DATA(state, data) {
      state.term = data.terms.find(term => term.type === data.type)
    },
  },
  actions: {
    async getClients({ commit }, { term }) {
      try {
        const { data: response } = await API.get('get-clients', {
          params: {
            term,
          },
        })

        commit('SET_CLIENTS', response?.data)

        return response?.data
      } catch (error) {
        console.log(error)
      }
      return null
    },
    async getProducts({ commit }, { term }) {
      try {
        const { data: response } = await API.get('get-products', {
          params: {
            term,
          },
        })

        commit('SET_PRODUCTS', response?.data)

        return response?.data
      } catch (error) {
        console.log(error)
      }
      return null
    },

    async addItem({ commit, state }, item) {
      try {
        const items = JSON.parse(JSON.stringify(state.items))
        const index = items.findIndex(i => i.id === item.id)

        if (index > -1) {
          items[index].quantity += item.quantity
          console.log(items)
          commit('SET_ITEMS', items)
        } else {
          commit('ADD_ITEM', item)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateItems({ commit }, items) {
      try {
        commit('SET_ITEMS', items)
      } catch (error) {
        console.log(error)
      }
    },
    updateCurrency({ commit }, currency) {
      commit('SET_CURRENCY', currency)
    },
    updateItem({ commit }, { index, item }) {
      console.log('update item action: ', index, item)
      commit('UPDATE_ITEM', { index, item })
    },
    removeItem({ commit }, index) {
      commit('REMOVE_ITEM', index)
    },
    async quotationDocument({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      try {
        return new Promise((resolve, reject) => {
          API.post('quotations', data).then(response => {
            resolve(response?.data)
            commit('SET_SUBMIT_LOADING', false)
          }).catch(e => {
            reject(e)
            commit('SET_SUBMIT_LOADING', false)
          })
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async invoiceDocument({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      try {
        return new Promise((resolve, reject) => {
          API.post('invoices', data).then(response => {
            resolve(response?.data)
            commit('SET_SUBMIT_LOADING', false)
          }).catch(e => {
            reject(e)
            commit('SET_SUBMIT_LOADING', false)
          })
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async ticketDocument({ commit }, data) {
      commit('SET_SUBMIT_LOADING', true)
      try {
        return new Promise((resolve, reject) => {
          API.post('tickets', data).then(response => {
            resolve(response?.data)
            commit('SET_SUBMIT_LOADING', false)
          }).catch(e => {
            reject(e)
            commit('SET_SUBMIT_LOADING', false)
          })
        })
      } catch (error) {
        console.log(error)
      }
      return false
    },
    async getTerm({ commit }, { company_id, type }) {
      try {
        const { data: response } = await API.get(`companies/terms/${company_id}`)
        commit('SET_TERMS_DATA', { terms: response?.data, type })
        return response?.data
      } catch (error) {
        console.log(error)
      }
      return null
    },
  },
}

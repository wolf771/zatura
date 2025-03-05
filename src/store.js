import Vue from 'vue'
import Vuex from 'vuex'
import UtilitiesService from './services/utilities.service'
import UserService from './services/user.service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    countries: [],
    provinces: [],
    cantons: [],
    districts: [],
    identification_types: [
      {value: '01', text: 'Cédula Física'},
      {value: '02', text: 'Cédula Juridica'},
      {value: '03', text: 'DIMEX'},
      {value: '04', text: 'NITE'}
    ],
    categories: [],
    units: [],
    tax_types: [],
    user: "",
    currencies: [],
    selected_items: [
      {
        uid: 1,
        id: 0,
        name: "",
        price: 0,
        calculate_price: 0,
        quantity: 1,
        discount: 0,
        tax_type: {
          id: 1,
          rate: 0
        },
        currency: {
          id: 2,
          symbol: "₡"
        }
      }
    ],
    payment_methods: [],
    payment_terms: [],
    payment_forms: [],
    consecutives: {
      fe: 0,
      nc: 0,
      nd: 0,
      te: 0,
      cce: 0,
      cpce: 0,
      rce: 0,
      qt : 0,
      fec: 0
    },
    exchange_rate: "",
    current_currency: {
      id: 1,
      symbol: "$",
      name: ""
    },
    company_default: {},
    general_configurations: {},
    notifications: [
      {'title': 'Documento aceptado', 'body': 'El documento 000000001 fue rechazado por el ministerio de hacienda...', 'classes':'text-success'},
      {'title': 'Documento rechazado', 'body': 'El documento 000000002 fue aceptado por el ministerio de hacienda...', 'classes': 'text-danger'}
    ],
    templates_email: [],
    terms: []
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload.token
    },
    updateCountries(state, payload) {
      state.countries = payload.countries
    },
    updateProvinces(state, payload) {
      state.provinces = payload.provinces
    },
    updateCantons(state, payload) {
      state.cantons = payload.cantons
    },
    updateDistricts(state, payload) {
      state.districts = payload.districts
    },
    updateCategories(state, payload) {
      state.categories = payload.categories
    },
    updateUnits(state, payload) {
      state.units = payload.units
    },
    updateTaxTypes(state, payload) {
      state.tax_types = payload.tax_types
    },
    updateUser(state, payload) {
      state.user = payload.user
    },
    updateCurrencies(state, payload) {
      state.currencies = payload.currencies
    },
    updateSelectedItems(state, payload) {
      state.selected_items = payload.selected_items;
    },
    updatePaymentMethods(state, payload) {
      state.payment_methods = payload.payment_methods;
    },
    updatePaymentTerms(state, payload) {
      state.payment_terms = payload.payment_terms;
    },
    updatePaymentForms(state, payload) {
      state.payment_forms = payload.payment_forms;
    },
    updateConsecutives(state, payload) {
      state.consecutives = payload.consecutives;
    },
    updateExchangeRate(state, payload) {
      state.exchange_rate = payload.exchange_rate;
    },
    updateCurrentCurrency(state, payload) {
      state.current_currency = payload.current_currency;
    },
    updateCompanyDefault(state, payload) {
      state.company_default = payload.company_default;
    },
    updateGeneralConfigurations(state, payload) {
      state.general_configurations = payload.general_configurations;
    },
    updateNotifications(state, payload) {
      state.notifications = payload.notifications
    },
    updateTemplatesEmail(state, payload) {
      state.templates_email = payload.templates_email
    },
    updateTerms(state, payload) {
      state.terms = payload.terms
    },
    resetState(state, payload) {
      Object.assign(state, payload.defaultState)
    }
  },
  actions: {
    loadItems(context, payload) {
      context.commit('updateSelectedItems', payload);
    },
    updateItems(context, payload) {
      let items = context.state.selected_items;
      items[payload.index] = Object.assign(items[payload.index] , payload.item);
      context.commit('updateSelectedItems', {selected_items: items});
    },
    addNewItem(context, payload) {
      let items = JSON.parse(JSON.stringify(this.state.selected_items));
      items.push(payload.item);
      context.commit('updateSelectedItems', {selected_items: items});
    },
    deleteItem(context, payload) {
      context.commit('updateSelectedItems', {selected_items: payload.selected_items});
    },
    clearItemsInvoice(context) {
      let selected_items = [
        {
          uid: 1,
          id: 0,
          name: "",
          price: 0,
          calculate_price: 0,
          quantity: 1,
          discount: 0,
          tax_type: {
            id: 1,
            rate: 0
          },
          currency: {
            id: 2,
            symbol: "₡"
          }
         
        }
      ];
      context.commit('updateSelectedItems', {selected_items: selected_items});
    },
    getCountries(context) {
      if (this.state.countries.length == 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getCountries().then(res => {
            context.commit('updateCountries', {'countries': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      }
    },
    getProvinces(context) {
      if (this.state.provinces.length == 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getProvinces().then(res => {
            context.commit('updateProvinces', {'provinces': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.state.provinces);
        });
      }
    },
    getCantons(context, payload) {
      let province = payload.province;
      return new Promise((resolve, reject) => {
        UtilitiesService.getCantons(province).then(res => {
          context.commit('updateCantons', {'cantons': res.data} );
          resolve(res.data);
        })
        .catch(() => {
          reject('Error');
        })
      });
    },
    getDistricts(context, payload) {
      let province = payload.province;
      let canton = payload.canton;
      return new Promise((resolve, reject) => {
        UtilitiesService.getDistricts(province, canton).then(res => {
          context.commit('updateDistricts', {'districts': res.data} );
          resolve(res.data);
        })
        .catch(() => {
          reject();
        })
      });
    },
    getCategories(context) {
      if (this.state.categories.length == 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getCategories().then(res => {
            context.commit('updateCategories', {'categories': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      }
    },
    getUnits(context) {
      if (this.state.units.length == 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getUnits().then(res => {
            context.commit('updateUnits', {'units': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      }
    },
    getTaxTypes(context) {
      if (this.state.tax_types.length == 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getTaxTypes().then(res => {
            context.commit('updateTaxTypes', {'tax_types': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      }
    },
    getUser (context) {
     return new Promise((resolve, reject) => {
      UserService.getUser()
      .then((res) => {
        //context.commit('updateUser', {user: res.data.user});
        resolve(res.data.user)
      })
      .catch(() => {
        reject('error');
      });
     });
     
    },
    getCurrencies(context) {
      if (this.state.currencies.length === 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getCurrencies().then(res => {
            context.commit('updateCurrencies', {'currencies': res.data} );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          })
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(context.state.currencies)
        })
      }
    },
    getPaymentMethods(context) {
      if(this.state.payment_methods.length === 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getPaymentMethods().then(res => {
            context.commit('updatePaymentMethods', {payment_methods: res.data});
            resolve(res.data);
          }).catch(error => {
              reject(error);
          });
        });
      }
    },
     getPaymentTerms(context) {
      if(this.state.payment_terms.length === 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getPaymentTerms().then(res => {
            context.commit('updatePaymentTerms', {payment_terms: res.data});
            resolve(res.data);
          }).catch(error => {
              reject(error);
          });
        });
      }
    },
    getPaymentForms(context) {
      if(this.state.payment_forms.length === 0) {
        return new Promise((resolve, reject) => {
          UtilitiesService.getPaymentForms().then(res => {
            context.commit('updatePaymentForms', {payment_forms: res.data});
            resolve(res.data);
          }).catch(error => {
              reject(error);
          });
        });
      }
    },
    getConsecutives(context) {
      return new Promise((resolve, reject) => {
        UtilitiesService.getConsecutives().then(res => {
          context.commit('updateConsecutives', {consecutives: res.data});
          resolve(res.data);
        }).catch(error => {
            reject(error);
        });
      });
    },
    getExchangeRate(context) {
      return new Promise((resolve, reject) => {
        UtilitiesService.getExchangeRate().then(res => {
          context.commit('updateExchangeRate', {exchange_rate: res.data});
          resolve(res.data);
        }).catch(error => {
            reject(error);
        });
      });
    },
    getCurrentCurrency(context) {
      return new Promise((resolve, reject) => {
        resolve(context.state.current_currency);
      });
    },
    getNotifications(context) {
      return new Promise((response, reject) => {
        response([{'title': 'Documento rechazado', 'body': 'El documento 000000001 fue rechazado'}])
      })
    },
    getTemplatesEmail(context) {
      return new Promise((resolve, reject) => {
        UtilitiesService.getTemplatesEmail().then(res => {
          context.commit('updateTemplatesEmail', {templates_email: res.data});
          resolve(res.data);
        }).catch(error => {
            reject(error);
        });
      });
    },
    getTerms(context) {
      return new Promise((resolve, reject) => {
        UtilitiesService.getTerms().then(res => {
          context.commit('updateTerms', {terms: res.data});
          resolve(res.data);
        }).catch(error => {
            reject(error);
        });
      });
    }
  },
  getters: {
    selectedd_items(state) {
      return state.selected_items;
    },
    tokenAll(state) {
      return `Bearer ${state.token}`;
    },
    subtotal_invoice(state) {
      let subtotal = 0;
      state.selected_items.forEach(i => {
        subtotal += i.calculate_price ? parseFloat(i.calculate_price) * i.quantity : 0;
      });
      return subtotal;
    },
    tax_invoice(state) {
      let tax = 0;
      state.selected_items.forEach(i => {
        let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
        let discount = i.discount ? i.discount : 0;
        tax += ((price * i.quantity) - ((price * i.quantity) * discount / 100)) * i.tax_type.rate / 100;
      });
      return tax;
    },
    discount_invoice(state) {
      let total = 0;
      state.selected_items.forEach(i => {
        let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
        let discount = i.discount ? i.discount : 0;
        total += (price * i.quantity) * discount / 100;
      });
      return total;
    },
    total_invoice(state, getters) {
      return (getters.subtotal_invoice - getters.discount_invoice) + getters.tax_invoice;
    }
  }
})

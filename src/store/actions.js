/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

//For me
import UtilitiesService from '../services/utilities.service'
import UserService from '../services/user.service'



const actions = {

    // ////////////////////////////////////////////
    // SIDEBAR & UI UX
    // ////////////////////////////////////////////

    updateSidebarWidth({ commit }, width) {
        commit('UPDATE_SIDEBAR_WIDTH', width);
    },
    updateI18nLocale({ commit }, locale) {
        commit('UPDATE_I18N_LOCALE', locale);
    },
    toggleContentOverlay({ commit }) {
        commit('TOGGLE_CONTENT_OVERLAY');
    },
    updateTheme({ commit }, val) {
        commit('UPDATE_THEME', val);
    },
    updateUserRole({ commit }, val) {
        commit('UPDATE_USER_ROLE', val);
    },


    // ////////////////////////////////////////////
    // COMPONENT
    // //////////////////////////////////////////// 
    
    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
        commit('UPDATE_STARRED_PAGE', payload)
    },

    //  The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_MORE', list)
    },


    //For me
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
    },
    updateCurrentPageDatatable(context, payload) {
      context.commit('updateCurrentPageDatatable', payload)
    }
      
}

export default actions
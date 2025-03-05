/*=========================================================================================
  File Name: mutations.js
  Description: Vuex Store - mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


const mutations = {

    // ////////////////////////////////////////////
    // SIDEBAR & UI UX
    // ////////////////////////////////////////////

    UPDATE_SIDEBAR_WIDTH(state, width) {
        state.sidebarWidth = width;
    },
    UPDATE_SIDEBAR_ITEMS_MIN(state, val) {
        state.sidebarItemsMin = val;
    },
    TOGGLE_REDUCE_BUTTON(state, val) {
        state.reduceButton = val;
    },
    TOGGLE_CONTENT_OVERLAY(state, val) {
        state.bodyOverlay = val;
    },
    TOGGLE_IS_SIDEBAR_ACTIVE(state, value) {
        state.isSidebarActive = value;
    },
    UPDATE_THEME(state, val) {
        state.theme = val;
    },
    UPDATE_WINDOW_BREAKPOINT(state, val) {
        state.breakpoint = val;
    },
    UPDATE_PRIMARY_COLOR(state, val) {
        state.themePrimaryColor = val;  
    },
    UPDATE_USER_ROLE(state, val) {
        state.userRole = val
        localStorage.setItem('userRole', val)
    },
    UPDATE_STATUS_CHAT(state, value) {
        state.AppActiveUser.status = value;
    },


    // ////////////////////////////////////////////
    // COMPONENT
    // ////////////////////////////////////////////

    // VxAutoSuggest
    UPDATE_STARRED_PAGE(state, payload) {
        // find item index in search list state
        const index = state.navbarSearchAndPinList.data.findIndex((item) => item.index == payload.index)
        // update the main list
        state.navbarSearchAndPinList.data[index].highlightAction = payload.val;

        // if val is true add it to starred else remove
        if(payload.val) {
            state.starredPages.push(state.navbarSearchAndPinList.data[index])
        }else {
            // find item index from starred pages
            const index = state.starredPages.findIndex((item) => item.index == payload.index)
            // remove item using index
            state.starredPages.splice(index, 1);
        }
    },

    // The Navbar
    ARRANGE_STARRED_PAGES_LIMITED(state, list) {
        const starredPagesMore = state.starredPages.slice(10);
        state.starredPages = list.concat(starredPagesMore);
    },
    ARRANGE_STARRED_PAGES_MORE(state, list) {
        let downToUp = false
        let lastItemInStarredLimited = state.starredPages[10];
        const starredPagesLimited = state.starredPages.slice(0, 10);
        state.starredPages = starredPagesLimited.concat(list);

        state.starredPages.slice(0,10).map((i) => {
            if(list.indexOf(i) > -1) downToUp = true
        })
        if(!downToUp) {
            state.starredPages.splice(10, 0, lastItemInStarredLimited);
        }
    },

    //For me
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
    },
    updateCurrentPageDatatable(state, payload) {
        if (payload.section === 'clients') state.datatable_current_page.clients = payload.page
        if (payload.section === 'quotations') state.datatable_current_page.quotations = payload.page
        if (payload.section === 'recurrings') state.datatable_current_page.recurrings = payload.page
        if (payload.section === 'invoices') state.datatable_current_page.invoices = payload.page
        if (payload.section === 'tickets') state.datatable_current_page.tickets = payload.page
        if (payload.section === 'simples') state.datatable_current_page.simples = payload.page
        if (payload.section === 'providers') state.datatable_current_page.providers = payload.page
        if (payload.section === 'payments') state.datatable_current_page.payments = payload.page
        if (payload.section === 'companies') state.datatable_current_page.companies = payload.page
        if (payload.section === 'users') state.datatable_current_page.users = payload.page
        if (payload.section === 'all_companies') state.datatable_current_page.all_companies = payload.page
    }
      
}

export default mutations
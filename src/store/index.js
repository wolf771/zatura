import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import auth from './auth'
import clients from './clients'
import companies from './companies'
import configCompanies from './config-companies'
import emailConfigsCompanies from './config-companies/emailConfigs'
import emailReceptionConfig from './config-companies/emailReceptionConfig'
import haciendaConfigsCompanies from './config-companies/haciendaConfigs'
import templateEmailCompanies from './config-companies/templatesEmail'
import termsCompanies from './config-companies/terms'
import products from './products'
import invoicing from './invoicing'
import invoices from './invoices'
import tickets from './tickets'
import quotations from './quotations'
import paySidebar from './invoices/sidebars/pay-sidebar'
import ticketSidebar from './tickets/sidebars/pay-sidebar'
import quotationSidebar from './quotations/sidebars/pay-sidebar'
import documentDetail from './document-detail'
import multiAction from './multi-action'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    auth,
    clients,
    companies,
    configCompanies,
    emailConfigsCompanies,
    haciendaConfigsCompanies,
    templateEmailCompanies,
    termsCompanies,
    emailReceptionConfig,
    products,
    invoicing,
    invoices,
    paySidebar,
    ticketSidebar,
    tickets,
    quotationSidebar,
    quotations,
    documentDetail,
    multiAction,
  },
  strict: process.env.DEV,
})

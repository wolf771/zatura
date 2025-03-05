/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from '@/layouts/components/navbarSearchAndPinList'
import themeConfig from '@/../themeConfig.js'
import colors from '@/../themeConfig.js'

const state = {
    isSidebarActive: true,
    breakpoint: null,
    sidebarWidth: "default",
    reduceButton: themeConfig.sidebarCollapsed,
    bodyOverlay: false,
    sidebarItemsMin: false,
    theme: themeConfig.theme || 'light',
    navbarSearchAndPinList: navbarSearchAndPinList,
    AppActiveUser: {
        id: 0,
        name: 'John Doe',
        about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
        img: 'avatar-s-11.png',
        status: 'online',
    },

    themePrimaryColor: colors.primary,

    starredPages: navbarSearchAndPinList.data.filter((page) => page.highlightAction),
    userRole: null,



    //For me
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
      qt : 0
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
    terms: [],

    datatable_current_page: {
      clients: 1,
      quotations: 1,
      recurrings: 1,
      invoices: 1,
      tickets: 1,
      notes: 1,
      simples: 1,
      providers: 1,
      payments: 1,
      companies: 1,
      users: 1,
      all_companies: 1
    }
    
}



export default state
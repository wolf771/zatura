import axios from "axios";
import config from "../config";
import store from "../store";
// import Router from "vue-router";
// import Vue from "vue";

// Vue.use(Router);
// const router = new Router();
import router from "../router";

let http = axios.create({
  baseURL: config.url_api
});

// http.interceptors.request.use(
//   config => {
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );

http.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      logout();
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

function logout() {
  let defaultState = {
    token: null,
    countries: [],
    provinces: [],
    cantons: [],
    districts: [],
    identification_types: [
      { value: "01", text: "Cédula Física" },
      { value: "02", text: "Cédula Juridica" },
      { value: "03", text: "DIMEX" },
      { value: "04", text: "NITE" }
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
      qt: 0
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
      {
        title: "Documento aceptado",
        body:
          "El documento 000000001 fue rechazado por el ministerio de hacienda...",
        classes: "text-success"
      },
      {
        title: "Documento rechazado",
        body:
          "El documento 000000002 fue aceptado por el ministerio de hacienda...",
        classes: "text-danger"
      }
    ],
    templates_email: [],
    terms: []
  };

  localStorage.clear();
  localStorage.setItem("expire_token", true);

  store.commit("resetState", { defaultState: defaultState });
}

export const HTTP = http;

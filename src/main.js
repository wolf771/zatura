/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";

// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
import VeeValidate from "vee-validate";
import VueValidationEs from "vee-validate/dist/locale/es";
import Snotify from "vue-snotify";
import Paginate from "vuejs-paginate";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/es";
import "element-ui/lib/theme-chalk/index.css";
import TextInput from "@/components/TextInput.vue";
import VueCurrencyFilter from "vue-currency-filter";
import filters from "./filters";
import { Validator } from "vee-validate";
import attributesEs from "./lang/attributesEs";
import VueQRCodeComponent from "vue-qrcode-component";

Vue.component("qr-code", VueQRCodeComponent);

import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

Vue.use(Vuesax);

// // axios
// import axios from 'axios'
// Vue.prototype.$http = axios

// Theme Configurations
import "../themeConfig.js";

// Algolia - Instant Search
// import InstantSearch from 'vue-instantsearch';
// Vue.use(InstantSearch);

// Firebase
import "@/firebase/firebaseConfig";

// Auth0 Plugin
import AuthPlugin from "./plugins/auth";
Vue.use(AuthPlugin);

// ACL
import acl from "./acl/acl";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "./router";

// Vuex Store
import store from "./store/store";

// i18n
import i18n from "./i18n/i18n";

// Vuesax Admin Filters
import "./filters/filters";

// Clipboard
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// Tour
import VueTour from "vue-tour";
Vue.use(VueTour);
require("vue-tour/dist/vue-tour.css");

// // VeeValidate
// import VeeValidate from 'vee-validate';
// Vue.use(VeeValidate);

// Google Maps
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    // Add your API key here
    key: "YOUR_KEY",
    libraries: "places" // This is required if you use the Auto complete plug-in
  }
});

// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

//For me
Vue.component("paginate", Paginate);
Vue.use(ElementUI, { locale });

Vue.use(VueCurrencyFilter, {
  symbol: "₡",
  thousandsSeparator: ".",
  fractionCount: 2,
  fractionSeparator: ",",
  symbolPosition: "front",
  symbolSpacing: false
});

//Filters
Vue.filter("truncateText", filters.truncateText);
Vue.filter("moment", filters.moment);
Vue.filter("formatPrice", filters.formatPrice);
Vue.filter("currencyDisplay", {
  // model -> view
  // formats the value when updating the input element.
  read: function(val) {
    return "$" + val.toFixed(2);
  },
  // view -> model
  // formats the value when writing to the data.
  write: function(val, oldVal) {
    var number = +val.replace(/[^\d.]/g, "");
    return isNaN(number) ? 0 : parseFloat(number.toFixed(2));
  }
});

Vue.component("text-input", TextInput);

Vue.use(VeeValidate, {
  locale: "es",
  fieldsBagName: "vfields",
  dictionary: {
    es: VueValidationEs
  }
});

Validator.localize("es", attributesEs);

Vue.use(Snotify, {
  toast: {
    position: "rightTop",
    timeout: 2000,
    showProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  acl,
  render: h => h(App)
}).$mount("#app");

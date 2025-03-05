/*=========================================================================================
  File Name: getters.js
  Description: Vuex Store - getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
//import helpers from "../helpers/helpers";

const getters = {
  // COMPONENT
  // vx-autosuggest
  // starredPages: state => state.navbarSearchAndPinList.data.filter((page) => page.highlightAction),

  //For me
  selectedd_items(state) {
    return state.selected_items;
  },
  tokenAll(state) {
    return `Bearer ${state.token}`;
  },
  subtotal_invoice(state) {
    let subtotal = 0;
    state.selected_items.forEach(i => {
      subtotal += i.calculate_price
        ? parseFloat(i.calculate_price) * i.quantity
        : 0;
    });
    return subtotal;
  },
  tax_invoice(state) {
    let tax = 0;
    state.selected_items.forEach(i => {
      let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
      let discount = i.discount ? i.discount : 0;
      tax +=
        ((price * i.quantity - (price * i.quantity * discount) / 100) *
          i.tax_type.rate) /
        100;
    });
    // tax = helpers.truncateTwoDecimalWithoutRound(tax)
    // console.log(tax)
    return tax;
  },
  exonerated_invoice(state) {
    let exonerated = 0;
    state.selected_items.forEach(i => {
      let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
      let discount = i.discount ? i.discount : 0;

      if (
        i.exoneration_percentage &&
        parseFloat(i.exoneration_percentage) > 0
      ) {
        exonerated +=
          ((price * i.quantity - (price * i.quantity * discount) / 100) *
            i.exoneration_percentage) /
          100;
      }
    });
    return exonerated;
  },
  discount_invoice(state) {
    let total = 0;
    state.selected_items.forEach(i => {
      let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
      let discount = i.discount ? i.discount : 0;
      total += (price * i.quantity * discount) / 100;
    });
    return total;
  },
  iva_devuelto: (state, getters) => payment_form => {
    let devuelto = 0;
    if (payment_form === "02") {
      state.selected_items.forEach(i => {
        let price = i.calculate_price ? parseFloat(i.calculate_price) : 0;
        let discount = i.discount ? i.discount : 0;
        if (i.tax_type.code === "04") {
          devuelto +=
            ((price * i.quantity - (price * i.quantity * discount) / 100) *
              i.tax_type.rate) /
            100;
        }
      });
    }

    return devuelto;
  },
  total_invoice(state, getters) {
    return (
      getters.subtotal_invoice -
      getters.discount_invoice +
      getters.tax_invoice -
      getters.exonerated_invoice
    );
  }
};

export default getters;

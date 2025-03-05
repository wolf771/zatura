<template>
  <span>{{ calculated_price | currency({ symbol: symbol }) }}</span>
</template>

<script>
import { mapState,  } from 'vuex';

export default {
  name: 'calc-price',
  props: {
    price: {
      required: true,
      default: 0
    },
    currency: {
      required: true,
      default: 2
    },
    exchange_rate: {
      required: true,
      default: "1"
    },
    if_calculate: {
      default: false
    }
  },
  computed: {
    ...mapState(['current_currency']),
    calculated_price() {
      let price = this.price;
      
      let exchange_rate = parseFloat(this.exchange_rate);

      //Si if calculate para los reportes y balances
      if(this.if_calculate) {
        if(this.currency === this.current_currency.id) {
          return price;
        }
        if(this.current_currency.id === 1) {
          return price / exchange_rate;
        } else if(this.current_currency.id === 2) {
          return price * exchange_rate;
        }
      }

      return price;
    },
    symbol() {
      if(this.if_calculate) {
        if(this.current_currency.id === 2) {
          return '¢';
        }
        return '$';
      } else {
        if(this.currency === 2) {
          return '¢';
        }
        return '$';
      }
    }
  }
}
</script>

<style>

</style>

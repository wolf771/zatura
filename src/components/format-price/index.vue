<template>
  <span>
    {{ priceFormatted }}
  </span>
</template>

<script>
import { mapState } from 'vuex'
import { numberFormat } from '@/helpers/numbers'

export default {
  props: {
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState({
      current_currency: state => state.auth.company.current_currency,
      exchange_rate: state => state.auth.company.exchange_rate,
      number_decimals: state => state.auth.company.number_decimals,
    }),
    priceFormatted() {
      const isSameCurrency = this.currency === this.current_currency.id
      const price = isSameCurrency
        ? this.price
        : this.price * this.exchange_rate
      return (
        `${this.current_currency.symbol}` +
        numberFormat(price, this.number_decimals)
      )
    },
  },
  methods: {},
}
</script>

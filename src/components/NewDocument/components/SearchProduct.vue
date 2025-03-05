<template>
  <form @submit.prevent="onSubmit">
    <div>
      <b-input-group>
        <b-form-input
          v-model="term"
          type="text"
          @keyup="searchProduct"
        />
        <b-input-group-append>
          <b-button
            size="sm"
            text="Button"
            variant="success"
            type="button"
            @click="searchProduct"
          >
            <feather-icon
              icon="SearchIcon"
              size="12"
            /></b-button>
        </b-input-group-append>
      </b-input-group>

      <div
        v-if="showList"
        class="list"
      >
        <ul>
          <li
            v-for="product in products"
            :key="product.id"
            @click="selectProduct(product)"
          >
            {{ product.name }}
          </li>
        </ul>
      </div>

      <b-sidebar
        id="product-detail-invoice"
        width="25%"
        bg-variant="white"
        right
        backdrop
        shadow
      >
        <div v-if="product">
          <h2>{{ product.name }}</h2>
        </div>
      </b-sidebar>
    </div>
  </form>
</template>

<script>
import {
  BInputGroup,
  BInputGroupAppend,
  BButton,
  BFormInput,
  BSidebar,
  VBToggle,
} from 'bootstrap-vue'

import { mapState } from 'vuex'

export default {
  name: 'SearchProduct',
  components: {
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BButton,
    BSidebar,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      term: '',
      product: null,
      showList: false,
    }
  },
  computed: {
    ...mapState({
      products: state => state.invoicing.products,
    }),
  },
  methods: {
    async searchProduct() {
      console.log('eo')
      await this.$store.dispatch('invoicing/getProducts', {
        term: this.term,
      })
      this.showList = true
    },
    selectProduct(product) {
      this.product = product
      this.term = ''
      this.showList = false

      this.$store.dispatch('invoicing/addItem', {
        id: product.id,
        cabys_code: product.cabys_code,
        name: product.name,
        description: product.description,
        quantity: 1,
        unit: product.unit,
        price: product.price,
        discount: 0,
        taxes: product.taxes,
        have_exoneration: false,
        exoneration: {
          type: null,
          number: '',
          date: '',
          institution: '',
          percentage: 0,
        },
      })
    },
    onSubmit() {

    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  z-index: 1;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 16px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 8px;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>

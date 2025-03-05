<template>
  <form @submit.prevent="onSubmit">
    <div>
      <b-input-group>
        <b-form-input
          v-model="term"
          @keyup="searchClient"
        />
        <b-input-group-append>
          <b-button
            size="sm"
            text="Button"
            variant="success"
            type="button"
            @click="searchClient"
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
            v-for="client in clients"
            :key="client.id"
            @click="selectClient(client)"
          >
            {{ client.name }}
          </li>
        </ul>
      </div>

      <div v-if="client && !showList">
        <b-button
          v-b-toggle.client-detail-invoice
          variant="link"
          class="p-0 pt-1"
        >
          Ver detalle del cliente
        </b-button>
      </div>

      <b-sidebar
        id="client-detail-invoice"
        width="20%"
        bg-variant="white"
        right
        backdrop
        shadow
        title="Información del cliente"
      >
        <div v-if="client">
          <div class="px-2 pt-1 border-bottom border-top">
            <h2 class="text-capitalize p-0 m-0">
              {{ client.name }}
            </h2>
            <p class="text-muted m-0">
              <feather-icon
                icon="MailIcon"
                size="12"
              />
              {{ client.email }}
            </p>

            <p class="text-muted m-0 mb-2">
              <feather-icon
                icon="PhoneIcon"
                size="12"
              />
              {{ client.phone }}
            </p>
          </div>
          <div class="px-2 border-bottom">
            <h3 class="p-0 m-0 py-1">
              Balance: 0 USD
            </h3>
          </div>

          <div>
            <h4 class="px-2">
              Facturas pendientes
            </h4>
            <div
              v-for="invoice in client.invoices"
              :key="invoice.id"
            >
              <div class="px-2 border-bottom">
                <h3 class="p-0 m-0 py-1">
                  # {{ invoice.reference }}
                </h3>
                <p class="text-muted m-0">
                  {{ invoice.created_at }}
                </p>
                <p class="text-muted m-0">
                  {{ invoice.total }}
                </p>
              </div>
            </div>
          </div>
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
  name: 'SearchClient',
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
      client: null,
      showList: false,
    }
  },
  computed: {
    ...mapState({
      clients: state => state.invoicing.clients,
    }),
  },
  watch: {
    searchClient(value) {
      this.$store.dispatch('clients/searchTermChange', value)
    },
  },
  methods: {
    async searchClient() {
      await this.$store.dispatch('invoicing/getClients', {
        term: this.term,
      })
      this.showList = true
    },
    selectClient(client) {
      this.client = client
      this.term = client.name
      this.showList = false
      this.$emit('clientSelected', client)
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

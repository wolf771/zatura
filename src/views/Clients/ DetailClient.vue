<template>
  <div>
    <b-row>
      <b-col>
        <div
          class="float-right"
          style="margin-top: -20px"
        >
          <b-dropdown
            v-b-tooltip.hover.bottom="'Nuevo Documento'"
            split
            variant="primary"
            class="m-2"
          >
            <template #button-content>
              <feather-icon
                size="1.2x"
                icon="PlusIcon"
              /><a class="mt-0 mb-2 pt-0"> Nuevo</a>
            </template>
            <b-dropdown-item @click="goToNewDocument('invoice')">
              <feather-icon
                size="1.2x"
                icon="TagIcon"
                class="text-primary"
              /> Factura</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="goToNewDocument('ticket')">
              <feather-icon
                size="1.2x"
                icon="FileTextIcon"
                class="text-primary"
              />  Tiquete</b-dropdown-item>
            <b-dropdown-item @click="goToNewDocument('quotation')">
              <feather-icon
                size="1.2x"
                icon="FileIcon"
                class="text-primary"
              />  Cotización</b-dropdown-item>
            <b-dropdown-item @click="goToNewDocument('recurring-invoices')">
              <feather-icon
                size="1.2x"
                icon="FilePlusIcon"
                class="text-primary"
              /> Factura recurrente</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-row>
    <b-card>
      <InfoClient />
    </b-card>
    <b-card>
      <b-row>
        <b-col>
          <div>
            <b-tabs
              content-class="mt-2"
              justified
            >
              <b-tab>
                <template #title>
                  Facturas
                  <feather-icon
                    size="1x"
                    icon="TagIcon"
                  />
                </template>
                <InvoceClient />
              </b-tab>
              <b-tab>
                <template #title>
                  Cotizaciones
                  <feather-icon
                    size="1x"
                    icon="FileIcon"
                  />
                </template>
                <CotClient />
              </b-tab>
              <b-tab>
                <template #title>
                  Tiquetes
                  <feather-icon
                    size="1x"
                    icon="FileTextIcon"
                  />
                </template>
                <TickClient />
              </b-tab>
              <b-tab>
                <template #title>
                  Contactos
                  <feather-icon
                    size="1.1x"
                    icon="UsersIcon"
                  />
                </template>
                <ContactClient />
              </b-tab>
            </b-tabs>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import {
  BCard,
  BTab,
  BTabs,
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
  BCol,
  BRow,
} from 'bootstrap-vue'
import InfoClient from './components/InfoClient.vue'
import CotClient from './components/CotClient.vue'
import InvoceClient from './components/InvoceClient.vue'
import TickClient from './components/TickClient.vue'
import ContactClient from './components/ContactClient.vue'

export default {
  components: {
    BCard,
    BTab,
    BTabs,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
    BCol,
    BRow,
    InfoClient,
    CotClient,
    InvoceClient,
    TickClient,
    ContactClient,
  },
  data() {
    return {
      mostrar: false,
    }
  },
  methods: {
    desplegar() {
      if (this.mostrar === true) { this.mostrar = false } else { this.mostrar = true }
    },
    goToNewDocument(documentType) {
      this.$router.push({
        name: 'document',
        params: {
          type: documentType,
          action: 'new',
        },
        query: {
          clientId: this.$route.params.id,
        },
      })
    },
  },
}
</script>

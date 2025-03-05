<template>
  <div>
    <b-row>
      <b-col md="3">
        <b-card>
          <h4>Lista de {{ currentDocumentType }}</h4>
          <div>
            <b-list-group>
              <b-list-group-item
                v-for="doc in items"
                :key="doc.id"
                style="border-style:none"
                class="p-0"
                @click="selectDocument(doc)"
              >
                <div
                  :class="[
                    'p-1 border cursor-pointer',
                    { 'bg-light-success': document.id === doc.id },
                  ]"
                >
                  <h5 class="text-capitalize">
                    {{ doc.client.name }}
                  </h5>
                  {{ doc.reference }} | {{ dateFormat(doc.created_at) }} | {{ numberFormat(doc.total) }}
                  <h6
                    v-if="doc.currency_id === 1"
                    class="float-right mr-5"
                  >
                    ₡
                  </h6> <h6
                    v-else
                    class="float-right mr-5"
                  >
                    $
                  </h6>
                </div>
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-card>
      </b-col>
      <b-col md="9">
        <b-card v-if="document && company">
          <b-row class="text-right">
            <b-col>
              <b-button-group>
                <b-button
                  v-b-tooltip.hover.top="'Compartir'"
                  variant="outline-primary"
                  size="sm"
                >
                  <feather-icon
                    size="1.2x"
                    icon="Share2Icon"
                  />
                </b-button>
                <b-dropdown
                  v-b-tooltip.hover.top="'Ver XMLS'"
                  right
                  text="XMLS"
                  variant="outline-primary"
                  size="sm"
                >
                  <b-dropdown-item>XML Enviado</b-dropdown-item>
                  <b-dropdown-item>XML Respuesta</b-dropdown-item>
                </b-dropdown>
                <b-button
                  v-b-tooltip.hover.top="'Pagar'"
                  variant="outline-primary"
                  size="sm"
                >
                  <feather-icon
                    size="1.2x"
                    icon="DollarSignIcon"
                  />
                </b-button>
                <b-dropdown
                  v-b-tooltip.hover.top="'Imprimir'"
                  right
                  variant="outline-primary"
                  size="sm"
                >
                  <template #button-content>
                    <feather-icon
                      size="1.2x"
                      icon="PrinterIcon"
                    />
                  </template>
                  <b-dropdown-item>Imprimir normal</b-dropdown-item>
                  <b-dropdown-item>Imprimir POS</b-dropdown-item>
                </b-dropdown>
                <b-dropdown
                  v-b-tooltip.hover.top="'Enviar'"
                  right
                  variant="outline-primary"
                  size="sm"
                >
                  <template #button-content>
                    <feather-icon
                      size="1.2x"
                      icon="MailIcon"
                    />
                  </template>
                  <b-dropdown-item>Enviar por correo</b-dropdown-item>
                  <b-dropdown-item>Enviar recordatorio de pago</b-dropdown-item>
                </b-dropdown>

                <b-button
                  v-b-tooltip.hover.top="'Duplicar'"
                  variant="outline-primary"
                  size="sm"
                >
                  <feather-icon
                    size="1.2x"
                    icon="CopyIcon"
                  />
                </b-button>
                <b-button
                  v-b-tooltip.hover.top="'PDF'"
                  variant="outline-primary"
                  size="sm"
                >
                  <feather-icon
                    size="1.2x"
                    icon="FileTextIcon"
                  />
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>

          <!-- invoice -->

          <b-card>
            <b-row>
              <b-col md="6">
                <b-img
                  width="100"
                  height="100"
                  :src="company.logo"
                  class="mb-2"
                />
                <h4>{{ company.name }}</h4>
                <div>Actividad economica:</div>
                <div>Cedula:</div>
                <div>Telefono:</div>
                <div>Correo:</div>
                <div>Direccion:</div>
              </b-col>
              <b-col
                md="6"
                class="text-right"
              >
                <h1>{{ currentDocumentType }}</h1>
                <div># {{ document.reference }}</div>
                <div class="mt-2">
                  <qrcode-vue
                    foreground="#6e6b7b"
                    :value="'hola'"
                    :size="90"
                    level="H"
                  />
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <div>Facturar a: {{ document.client.name }}</div>
                <div>Cedula: {{ document.client.identification }}</div>
                <div>Telefono: {{ document.client.phone }}</div>
                <div>Correo: {{ document.client.email }}</div>
              </b-col>
              <b-col
                md="6"
                class="text-right"
              >
                <div>Fecha emision: {{ dateFormat(document.created_at) }}</div>
                <div>
                  Fecha vencimiento: {{ dateFormat(document.created_at) }}
                </div>
                <div>Metodo de pago: {{ document.payment_method.name }}</div>
                <div>Medio de pago: {{ document.payment_form.name }}</div>
              </b-col>
            </b-row>

            <b-row class="mt-5 mb-1">
              <b-col>
                <div>Consecutivo: {{ document.reference }}</div>
                <div>Clave: {{ document.key50digits }}</div>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div class="rTable">
                  <div class="rTableHeading">
                    <div class="rTableRow p-0">
                      <div
                        :class="'rTableHead detail_table_cabys'"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        Código Cabys
                      </div>
                      <div
                        class="rTableHead detail_table_name"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        Nombre
                      </div>
                      <div
                        class="rTableHead detail_table_quantity"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        Cantidad
                      </div>
                      <div
                        class="rTableHead detail_table_amount"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        Tarifa
                      </div>
                      <div
                        class="rTableHead detail_table_discount"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        DTO.(%)
                      </div>
                      <div
                        class="rTableHead detail_table_tax"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        TAX (%)
                      </div>
                      <div
                        class="rTableHead detail_table_total"
                        style="background:#ABB2B9; color:#4B4B4D;"
                      >
                        Total
                      </div>
                    </div>
                  </div>

                  <div
                    v-for="detail in document.transaction_details"
                    :key="detail.id"
                    class="rTableRow p-0"
                  >
                    <div :class="'rTableCell detail_table_cabys'">
                      Código Cabys
                    </div>
                    <div class="rTableCell detail_table_name">
                      {{ detail.name }}
                    </div>
                    <div class="rTableCell detail_table_quantity">
                      {{ detail.quantity }}
                    </div>
                    <div class="rTableCell detail_table_amount">
                      {{ numberFormat(detail.price) }}
                    </div>
                    <div class="rTableCell detail_table_discount">
                      {{ numberFormat(detail.discount) }}
                    </div>
                    <div class="rTableCell detail_table_tax">
                      {{ numberFormat(detail.tax) }}
                    </div>
                    <div class="rTableCell detail_table_total">
                      {{ numberFormat(detail.total) }}
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <div>Observaciones:</div>
              </b-col>
              <b-col
                md="6"
                class="text-right"
              >
                <div>Subtotal: {{ numberFormat(document.subtotal) }}</div>
                <div>Descuento: {{ numberFormat(document.discount) }}</div>
                <div>Impuesto: {{ numberFormat(document.tax) }}</div>
                <div>Total: {{ numberFormat(document.total) }}</div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col class="text-center">
                <p>
                  Autorizada mediante resolucion DGT-R-033-2019 del 20 de junio
                  de 2019 version 4.3
                </p>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BImg,
  BListGroup,
  BListGroupItem,
  BRow,
  BCol,
  BCard,
  BButton,
  BButtonGroup,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue'

import { mapState } from 'vuex'
// eslint-disable-next-line import/no-extraneous-dependencies
import numberMixins from '@/mixins/numberMixins'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'DocumentDetail',
  components: {
    BImg,
    BListGroup,
    BListGroupItem,
    BRow,
    BCol,
    BCard,
    BButton,
    BButtonGroup,
    BDropdown,
    BDropdownItem,
    QrcodeVue,
  },
  mixins: [numberMixins],
  data() {
    return {
      // ...
    }
  },
  computed: {
    ...mapState({
      company: state => state.auth.company,
      document: state => state.documentDetail.document,
      items: state => state.documentDetail.items,
    }),
    currentDocumentType() {
      const type = this.$route.params.type.toString()
      switch (type) {
        case 'invoice':
          return 'Factura'
        case 'nc':
          return 'Nota de crédito'
        case 'nd':
          return 'Nota de débito'
        case 'quotation':
          return 'Cotización'
        case 'ticket':
          return 'Tiquete'
        case 'recurring-invoices':
          return 'Factura Recurrente'
        default:
          return 'Documento'
      }
    },
  },
  mounted() {
    this.$store.dispatch('documentDetail/get', {
      id: this.$route.params.id,
      type: this.$route.params.type,
    })
    this.DocumentType()
  },
  methods: {
    selectDocument(document) {
      const type = this.$route.params.type.toString()
      if (type === 'invoice') {
        this.$store.dispatch('documentDetail/get', {
          id: document.id,
          type: 'invoice',
        })
      } else if (type === 'ticket') {
        this.$store.dispatch('documentDetail/get', {
          id: document.id,
          type: 'ticket',
        })
      } else if (type === 'quotation') {
        this.$store.dispatch('documentDetail/get', {
          id: document.id,
          type: 'quotation',
        })
      } else if (type === 'recurring-invoices') {
        this.$store.dispatch('documentDetail/get', {
          id: document.id,
          type: 'quotation',
        })
      }
    },
    DocumentType() {
      const type = this.$route.params.type.toString()
      if (type === 'invoice') {
        this.$store.dispatch('documentDetail/getInvoices', {
          id: this.$route.params.id,
          type: this.$route.params.type,
        })
      } else if (type === 'ticket') {
        this.$store.dispatch('documentDetail/getTickets', {
          id: this.$route.params.id,
          type: this.$route.params.type,
        })
      } else if (type === 'quotation') {
        this.$store.dispatch('documentDetail/getQuotations', {
          id: this.$route.params.id,
          type: this.$route.params.type,
        })
      } else if (type === 'recurring-invoices') {
        this.$store.dispatch('documentDetail/getQuotations', {
          id: this.$route.params.id,
          type: this.$route.params.type,
        })
      } else {
        console.log('no toma nada')
      }
    },
  },
}
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}

.detail_table_cabys {
  width: 15%;
}

.detail_table_name {
  width: 30%;
}

.detail_table_quantity {
  width: 10%;
}

.detail_table_amount {
  width: 10%;
}

.detail_table_discount {
  width: 10%;
}

.detail_table_tax {
  width: 10%;
}

.detail_table_total {
  width: 15%;
}
</style>

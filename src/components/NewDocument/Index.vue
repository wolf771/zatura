/* eslint-disable no-shadow */
<template>
  <b-card>
    <validation-observer
      v-if="!completed"
      ref="createDocument"
    >
      <b-form
        class="mt-2"
        @submit.prevent="createDocument"
      >
        <b-container>
          <b-row class="mb-2">
            <b-col md="6">
              <h2>
                {{ currentDocumentType }} #:
                <span>{{ currentConsecutive }}</span>
              </h2>
            </b-col>
            <b-col
              md="6"
              class="text-right aling-items-center d-flex justify-content-end"
            >
              <feather-icon
                size="1.4x"
                icon="CalendarIcon"
                class="mr-1 text-primary"
              />
              <h4 class="font-weight-bold">
                {{ currentDay }}
              </h4>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">
              <div class="d-flex align-items-center">
                <label class="p-0 m-0">Cliente</label>
                <!-- add new client -->
                <b-button
                  variant="link"
                  class="float-right btn-sm"
                  @click="onOpenNewClientModal()"
                >
                  <feather-icon
                    icon="PlusCircleIcon"
                    class="text-primary"
                  />
                  Nuevo cliente
                </b-button>
              </div>
              <search-client
                ref="searchClient"
                @clientSelected="clientSelected"
              />
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="3">
              <b-form-group
                label="Método de pago"
                label-for="document-payment-method"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Moneda"
                  rules="required"
                >
                  <b-form-select
                    id="document-payment-method"
                    v-model="doc.paymentMethod"
                    :options="paymentMethods"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="doc.paymentMethod === 2"
              md="3"
            >
              <b-form-group
                label="Plazo crédito"
                label-for="document-payment-term"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Plazo crédito"
                  rules="required"
                >
                  <b-form-select
                    id="document-payment-term"
                    v-model="doc.paymentTerm"
                    :options="paymentTerms"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group
                label="Modalidad de pago"
                label-for="document-payment-form"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Moneda"
                  rules="required"
                >
                  <b-form-select
                    id="document-payment-form"
                    v-model="doc.paymentForm"
                    :options="paymentForms"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group
                label="Moneda"
                label-for="document-currency"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Moneda"
                  rules="required"
                >
                  <b-form-select
                    id="document-currency"
                    v-model="doc.currency"
                    :options="currencies"
                    value-field="id"
                    text-field="name"
                    @change="changeCurrency"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group
                label="Actividad económica"
                label-for="document-economic-activity"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Actividad económica"
                  rules="required"
                >
                  <b-form-select
                    id="document-economic-activity"
                    v-model="doc.economicActivity"
                    :options="economicActivities"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col cols="3">
              <b-form-checkbox v-model="doc.is_recurring">
                <span v-b-tooltip.hover.top="'Se configura un intervalo en fechas para la recurrencia'"> Hacer recurrente</span>
              </b-form-checkbox>
            </b-col>
            <b-col>
              <b-form-checkbox v-model="doc.payment_reminder">
                <span
                  v-b-tooltip.hover.top="'Si marca esta opción se le emitira un recordatorio de pago al correo del cliente, esto se hara una vez de forma automatica un dia despues de vencida la factura.'"
                >
                  Enviar recordatorio de pago</span>
              </b-form-checkbox>
            </b-col>
          </b-row>

          <b-row
            v-if="doc.is_recurring"
            class="mt-2"
          >
            <b-col md="12">
              <h4>Datos para la recurrencia</h4>
            </b-col>
          </b-row>
          <b-row v-if="doc.is_recurring">
            <b-col md="3">
              <b-form-group
                label="Fecha inicio"
                label-for="document-recurring-start-date"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Fecha inicio"
                  rules="required"
                >
                  <b-form-datepicker
                    v-model="doc.recurring_start_date"
                    locale="es"
                    :date-format-options="{
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }"
                    :hide-header="true"
                    label-no-date-selected="Seleccione una fecha"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group
                label="Ciclos comunes"
                label-for="document-recurring-date"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Ciclos comunes"
                  rules="required"
                >
                  <b-form-select
                    id="document-recurring-cycle"
                    v-model="doc.common_cycle"
                    :options="commonCycles"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="doc.common_cycle === 1"
              md="3"
            >
              <b-form-group
                label="Tipo recurrencia"
                label-for="document-recurring-date"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Tipo recurrencia"
                  rules="required"
                >
                  <b-form-select
                    id="document-recurring-type"
                    v-model="doc.recurring_type"
                    :options="recurringTypes"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="doc.common_cycle === 1"
              md="3"
            >
              <b-form-group
                :label="`Se enviara cada ${periodicityLabel}`"
                label-for="row-exoneration-type"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Se enviara cada"
                  rules="required"
                >
                  <b-form-input v-model="doc.recurring_cycle" />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="4">
              <label>Buscar producto</label>
              <search-product />
            </b-col>
          </b-row>

          <b-row class="mt-1">
            <b-col>
              <div class="rTable">
                <div class="rTableHeading">
                  <div class="rTableRow p-0">
                    <!-- <div class="rTableHead table_name">
                      Act. Económica
                    </div>
                    <div :class="'rTableHead table_name'">Código Cabys</div> -->
                    <div class="rTableHead table_name">
                      Nombre
                    </div>
                    <div class="rTableHead table_quantity">
                      Cantidad
                    </div>
                    <div class="rTableHead table_amount">
                      Tarifa
                    </div>
                    <div class="rTableHead table_discount">
                      DTO.(%)
                    </div>
                    <div class="rTableHead table_tax">
                      Impuesto (%)
                    </div>
                    <div class="rTableHead table_total">
                      Total
                    </div>
                  </div>
                </div>

                <row
                  v-for="(item, index) in items"
                  :key="index"
                  :item="item"
                  :index="index"
                  :exoneration-types="exonerationTypes"
                  @addTax="onOpenTaxModal"
                />
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col class="pl-0 pt-2">
              <!-- add row -->
              <b-button
                variant="link"
                @click="addRow"
              >
                <feather-icon
                  icon="PlusCircleIcon"
                  style="margin-right: 5px"
                />
                Agregar item
              </b-button>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="7">
              <b-form-group
                label="Nota"
                label-for="document-note"
              >
                <b-form-textarea
                  id="document-note"
                  v-model="doc.comment"
                  rows="2"
                />
              </b-form-group>

              <b-form-group
                label="Terminos y condiciones"
                label-for="document-terms-and-conditions"
              >
                <!-- <b-form-textarea
                  id="document-terms-and-conditions"
                  v-model="doc.terms"
                  rows="2"
                /> -->
                <vue-editor
                  id="document-terms-and-conditions"
                  v-model="doc.terms"
                />

              </b-form-group>

              <!-- Checked emails for copied -->

              <div
                v-if="ccEmails.length > 0 && doc.client"
                class="mt-2 border p-1"
              >
                <h5>Enviar por correo electrónico a:</h5>

                <b-form-group v-slot="{ ariaDescribedby }">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="document.copy_emails"
                    rules="required"
                  >
                    <b-form-checkbox-group
                      v-model="doc.copy_emails"
                      :aria-describedby="ariaDescribedby"
                      :options="ccEmails"
                      value-field="email"
                      text-field="email"
                      class="mt-2"
                    />
                    <small
                      v-show="errors[0] && touched"
                      class="text-danger"
                    >{{
                      errors[0]
                    }}</small>
                  </validation-provider>
                </b-form-group>

              </div>
            </b-col>

            <b-col
              v-if="currency"
              md="3"
              offset-md="1"
            >
              <ul class="totals">
                <li class="d-flex justify-content-between">
                  <strong>Subtotal: </strong>
                  <span>{{ currency.symbol }} {{ numberFormat(subtotal) }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  <strong>Descuento: </strong>
                  <span>
                    {{ currency.symbol }} {{ numberFormat(discount) }}
                  </span>
                </li>
                <li class="d-flex justify-content-between">
                  <strong>Impuesto: </strong>
                  <span> {{ currency.symbol }} {{ numberFormat(tax) }} </span>
                </li>

                <li class="d-flex justify-content-between">
                  <strong>Total: </strong>
                  <span> {{ currency.symbol }} {{ numberFormat(total) }} </span>
                </li>
              </ul>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <div
                class="d-flex justify-content-center align-items-center py-5"
              >
                <b-button
                  type="button"
                  variant="primary"
                  @click="createDocument"
                >
                  <span v-if="!submitLoading">
                    Guardar</span>
                  <span v-if="submitLoading"><b-spinner
                    small
                    variant="light"
                    label="Spinning"
                  /></span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </validation-observer>
    <div v-if="completed">
      <b-row class="no-gutters justify-contente-center align-items-center">
        <b-col
          class="form-completed-container d-flex justify-contente-center align-items-center flex-column"
          md="12"
        >
          <img src="@/assets/images/pages/completed.png">
          <h4>¡{{ currentDocumentType }} se ha registrado con éxito!</h4>
          <button
            class="btn btn-primary collapsed mt-2"
            @click="callOnComplete"
          >Volver a {{ currentDocumentType }}</button>
        </b-col>
      </b-row>
    </div>
    <b-sidebar
      v-if="!completed"
      v-model="openNewTax"
      width="20%"
      bg-variant="white"
      right
      backdrop
      shadow
      title="Nuevo impuesto"
    >
      <div
        v-if="currentItem"
        class="p-2"
      >
        <h4>
          Agregar impuesto al artículo
          <span class="text-primary">{{ currentItem.name }}</span>
        </h4>

        <b-row class="mt-2">
          <b-col>
            <b-form-group
              label="Tipo de impuesto"
              label-for="product-tax_code"
            >
              <validation-provider
                #default="{ errors, touched }"
                name="Tipo de impuesto"
                rules="required"
              >
                <b-form-select
                  id="product-tax_code"
                  v-model="newTax.tax_code"
                  :options="taxCodes"
                  value-field="id"
                  text-field="name"
                />

                <small
                  v-show="errors[0] && touched"
                  class="text-danger"
                >{{
                  errors[0]
                }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group
              label="Tarifa impuesto"
              label-for="product-tax_type"
            >
              <validation-provider
                #default="{ errors, touched }"
                name="Tarifa impuesto"
                rules="required"
              >
                <b-form-select
                  id="product-tax_type"
                  v-model="newTax.tax_type"
                  :options="taxTypes"
                  value-field="id"
                  text-field="name"
                />

                <small
                  v-show="errors[0] && touched"
                  class="text-danger"
                >{{
                  errors[0]
                }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col>
            <b-button
              variant="primary"
              :disabled="!newTax.tax_code || !newTax.tax_type"
              @click="addTax"
            >
              Agregar
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-sidebar>
    <b-sidebar
      v-if="!completed"
      v-model="openNewClientModal"
      width="40%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <AddUpdateClient
        v-if="!completed"
        :item="null"
        @saved="savedClient"
      />
    </b-sidebar>
  </b-card>

</template>

<script>
import {
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BFormSelect,
  BCard,
  BFormTextarea,
  BSidebar,
  BFormCheckbox,
  BFormDatepicker,
  BSpinner,
  BFormCheckboxGroup,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters, mapState } from 'vuex'
// import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import numberMixins from '@/mixins/numberMixins'
// eslint-disable-next-line import/no-extraneous-dependencies
import { generateCustomProductId, successToast, handleErrors } from '@/helpers/utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import { pairDocumentTypes } from '@/constants'
import { VueEditor } from 'vue2-editor'
import Row from './components/Row.vue'

import SearchClient from './components/SearchClient.vue'
import SearchProduct from './components/SearchProduct.vue'

import AddUpdateClient from '../../views/Clients/components/AddUpdateClient.vue'

export default {
  components: {
    BCard,
    BContainer,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
    Row,
    SearchClient,
    SearchProduct,
    BFormTextarea,
    BSidebar,
    BFormCheckbox,
    BFormDatepicker,
    BFormCheckboxGroup,
    AddUpdateClient,
    VueEditor,
    BSpinner,

  },
  mixins: [numberMixins],
  props: {
    type: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    clientId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      openNewClientModal: false,
      currentDay: this.$dayjs().format('DD/MM/YYYY  - hh:mm A'),
      openNewTax: false,
      currentItem: null,
      completed: false,
      newTax: {
        tax_code: null,
        tax_type: null,
      },
      doc: {
        paymentMethod: 1,
        paymentForm: 1,
        paymentTerm: null,
        currency: 2,
        client: null,
        terms: null,
      },
      product: {
        id: null,
        unit: null,
        name: null,
        description: null,
        currency: null,
        price: null,
        tax_code: null,
        tax_type: null,
      },
    }
  },
  computed: {
    ...mapState({
      cabysCodes: state => state.app.cabysCodes,
      productCategories: state => state.app.initData.product_categories,
      units: state => state.app.initData.units,
      currencies: state => state.app.initData.currencies,
      taxCodes: state => state.app.initData.tax_codes,
      taxTypes: state => state.app.initData.tax_types,
      paymentMethods: state => state.app.initData.payment_methods,
      paymentForms: state => state.app.initData.payment_forms,
      paymentTerms: state => state.auth.paymentTerms,
      economicActivities: state => state.app.initData.economic_activities,
      items: state => state.invoicing.items,
      currency: state => state.invoicing.currency,
      submitLoading: state => state.invoicing.submitLoading,
      company: state => state.auth.company,
      exonerationTypes: state => state.app.initData.exoneration_types,
      commonCycles: state => state.app.initData.common_cycles,
      recurringTypes: state => state.app.initData.recurring_types,
      consecutives: state => state.auth.consecutives,
      term: state => state.invoicing.term,
      multiActionSidebarVisible: state => state.multiAction.multiActionSidebarVisible,
    }),
    ...mapGetters({
      subtotal: 'invoicing/subtotal',
      tax: 'invoicing/tax',
      discount: 'invoicing/discount',
      total: 'invoicing/total',
    }),
    periodicityLabel() {
      let periodicity = ''
      const recurringType = this.recurringTypes.find(
        item => item.id === this.doc.recurring_type,
      )
      if (recurringType && this.doc.recurring_cycle) {
        if (recurringType.name === 'dias' && this.doc.recurring_cycle === 1) {
          periodicity = 'dia'
        } else if (
          recurringType.name === 'semanas'
          && this.doc.recurring_cycle === 1
        ) {
          periodicity = 'semana'
        } else if (
          recurringType.name === 'meses'
          && this.doc.recurring_cycle === 1
        ) {
          periodicity = 'mes'
        } else if (
          recurringType.name === 'años'
          && this.doc.recurring_cycle === 1
        ) {
          periodicity = 'año'
        } else {
          periodicity = `${this.doc.recurring_cycle} ${recurringType.name}`
        }
      }

      return periodicity
    },
    currentConsecutive() {
      return this.type && this.consecutives && pairDocumentTypes
        ? this.consecutives[pairDocumentTypes[this.type]]
        : 0
    },
    ccEmails() {
      const ccs = this.doc.client ? [...this.doc.client.contacts] : []
      if (ccs.length <= 0) {
        ccs.push({
          name: 'principal',
          email: this.doc?.client?.email,
        })
      }
      return ccs
    },
    currentDocumentType() {
      switch (this.type) {
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
  watch: {
    company: {
      handler(val) {
        this.doc.currency = val?.current_currency?.id
        this.$store.dispatch('invoicing/updateCurrency', val.current_currency)
      },
    },
    term: {
      handler(val) {
        this.doc.terms = val?.body
      },
    },
  },
  mounted() {
    this.$store.dispatch('invoicing/updateCurrency', this.doc.currency)
    this.getTerms()
    if (this.clientId) this.searchClient(this.clientId)
  },
  methods: {
    // When clientId is passed as prop search client and set it
    async searchClient(clientId) {
      const client = await this.$store.dispatch('clients/getDetail', {
        id: clientId,
      })
      this.$refs.searchClient.selectClient(client)
    },
    savedClient(client) {
      console.log('clientttttttt', client)
      this.$refs.searchClient.selectClient(client)
      this.onOpenNewClientModal(false)
    },
    onOpenNewClientModal(open = true) {
      this.openNewClientModal = open
    },
    clientSelected(client) {
      console.log(client.contacts)
      this.doc.client = client
      this.doc.economicActivity = client.economic_activity_id
    },
    onOpenTaxModal(item) {
      console.log(item)
      this.currentItem = item
      this.openNewTax = true
    },
    addTax() {
      const item = {
        ...this.currentItem,
      }

      const taxes = item.taxes || []

      const newTax = {
        tax_code: this.taxCodes.find(tax => tax.id === this.newTax.tax_code),
        tax_type: this.taxTypes.find(tax => tax.id === this.newTax.tax_type),
      }

      taxes.push(newTax)
      console.log(newTax)

      console.log('item', item)
      this.$store.dispatch('invoicing/updateItem', {
        item: {
          ...item,
          taxes,
        },
        index: this.items.findIndex(i => i.id === this.currentItem.id),
      })
      this.openNewTax = false
    },
    addRow() {
      this.$store.dispatch('invoicing/addItem', {
        id: generateCustomProductId(),
        cabys_code: '',
        name: '',
        description: '',
        quantity: 1,
        unit: '',
        price: 0,
        discount: 0,
        taxes: [],
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
    changeCurrency() {
      const currency = this.currencies.find(
        // eslint-disable-next-line no-shadow
        currency => currency.id === this.doc.currency,
      )
      this.$store.dispatch('invoicing/updateCurrency', currency)
    },
    createDocument() {
      this.$refs.createDocument.validate().then(async success => {
        if (success) {
          const doc = {
            ...this.doc,
            client_id: this.doc.client.id,
            items: this.items.map(i => ({
              id: i.id,
              cabysCode: i.cabys_code,
              economicActivity: i.economic_activity,
              name: i.name,
              unitId: i.unit.id,
              unit: i.unit.symbol,
              quantity: i.quantity,
              price: i.price,
              discount: i.discount,
              taxes: i.taxes,
              haveExoneration: i.have_exoneration,
              exoneration: i.exoneration,
            })),
            subtotal: this.subtotal,
            tax: this.tax,
            discount: this.discount,
            total: this.total,
            currency: this.doc.currency,
            company: this.company,
            notifyEmails: this.doc.copy_emails,
            isRrecurring: null,
          }
          if (this.type === 'invoice') {
            this.$store.dispatch('invoicing/invoiceDocument', {
              ...doc,
              type: this.type,
            }).then(
              () => {
                this.completed = true
                this.$store.dispatch('multiAction/updateVisibility', false)
                successToast(`${this.currentDocumentType} se genero correctamente`)
              },
            ).catch(e => {
              handleErrors(e, true, 'Ha ocurrido un error al crear la factura')
            })
          } else if (this.type === 'ticket') {
            this.$store.dispatch('invoicing/ticketDocument', {
              ...doc,
              type: this.type,
            }).then(
              () => {
                this.completed = true
                this.$store.dispatch('multiAction/updateVisibility', false)
                successToast(`${this.currentDocumentType} se genero correctamente`)
              },
            ).catch(e => {
              handleErrors(e, true, 'Ha ocurrido un error al crear el tiquete')
            })
          } else if (this.type === 'quotation') {
            this.$store.dispatch('invoicing/quotationDocument', {
              ...doc,
              type: this.type,
            }).then(
              () => {
                this.completed = true
                this.$store.dispatch('multiAction/updateVisibility', false)
                successToast(`${this.currentDocumentType} se genero correctamente`)
              },
            ).catch(e => {
              handleErrors(e, true, 'Ha ocurrido un error al crear la cotización')
            })
          } else if (this.type === 'recurring-invoices') {
            this.$store.dispatch('invoicing/quotationDocument', {
              ...doc.push({ isRrecurring: true }),
              ...doc,
              type: this.type,
            }).then(
              () => {
                this.completed = true
                this.$store.dispatch('multiAction/updateVisibility', false)
                successToast(`${this.currentDocumentType} se genero correctamente`)
              },
            ).catch(e => {
              handleErrors(e, true, 'Ha ocurrido un error al crear la factura recurrente')
            })
          } else { return false }
        } else {
          console.log('Por favor revise los campos')
        }
        return null
      })
    },
    async fetchOptions(search, loading) {
      if (search) {
        loading(true)
        await this.$store.dispatch('app/getCabysCodes', {
          search,
        })
        loading(false)
        // return res
      }
    },
    getTerms() {
      this.$store.dispatch('invoicing/getTerm', {
        company_id: localStorage.getItem('zaturacom'),
        type: this.type,
      })
    },
    callOnComplete() {
      if (this.type === 'invoice') {
        this.$router.push({ name: 'invoices' })
      } else if (this.type === 'ticket') {
        this.$router.push({ name: 'tickets' })
      } else if (this.type === 'quotation') {
        this.$router.push({ name: 'quotations' })
      } else if (this.type === 'recurring-invoices') {
        this.$router.push({ name: 'recurring-invoices' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.totals {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    padding: 0.5rem;
    border-bottom: 1px solid #e9ecef;
  }
}
</style>

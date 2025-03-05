<template>
  <div class="row mx-0">
    <b-col
      xl="12"
    >
      <validation-observer ref="payDataValidation">
        <div class="row mx-0">
          <div class="col-xl-12">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h3 class="card-title">
                  <feather-icon
                    icon="DollarSignIcon"
                    size="1.5x"
                    class="text-primary"
                  />Pagar factura
                </h3>
              </div>

              <div class="card-body">
                <div class="row mx-0">
                  <b-col xl="12">
                    <h4>Documento: <span class="text-primary font-weight-bolder">{{ this.document.reference }}</span> </h4>
                  </b-col>
                  <b-col xl="12">
                    <b-form-group
                      label="Método de pago"
                      label-for="document-payment-method"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Método de pago"
                        rules="required"
                      >
                        <v-select
                          id="document-payment-method"
                          v-model="doc.paymentMethod"
                          :options="paymentMethods"
                          :reduce="paymentMethod => paymentMethod.id"
                          label="name"
                          searchable
                        >
                          <div slot="no-options">
                            No se encontraron barrios
                          </div>
                        </v-select>

                        <small
                          v-show="errors[0] && touched"
                          class="text-danger"
                        >
                          {{
                            errors[0]
                          }}
                        </small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col xl="12">
                    <b-form-group
                      label="Monto"
                      label-for="document-amount"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Monto"
                        rules="required"
                      >
                        <b-form-input
                          id="document-amount"
                          v-model="doc.amount"
                          name="document-amount"
                          type="text"
                        />
                        <small
                          v-show="errors[0] && touched"
                          class="text-danger"
                        >
                          {{
                            errors[0]
                          }}
                        </small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col xl="12">
                    <b-form-group
                      label="Fecha"
                      label-for="document-date"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Fecha"
                        rules="required"
                      >
                        <flat-pickr
                          v-model="doc.date"
                          class="form-control"
                          :config="config"
                        />
                        <small
                          v-show="errors[0] && touched"
                          class="text-danger"
                        >
                          {{
                            errors[0]
                          }}
                        </small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col xl="12">
                    <b-form-group
                      label="Descripción"
                      label-for="document-description"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Descripción"
                        rules="required"
                      >
                        <b-form-input
                          id="document-description"
                          v-model="doc.description"
                          name="document-description"
                        />
                        <small
                          v-show="errors[0] && touched"
                          class="text-danger"
                        >
                          {{
                            errors[0]
                          }}
                        </small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col xl="12">
                    <b-form-group
                      label="Referencia"
                      label-for="document-reference"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Referencia"
                        rules="required"
                      >
                        <b-form-input
                          id="document-reference"
                          v-model="doc.reference"
                          name="document-reference"
                        />
                        <small
                          v-show="errors[0] && touched"
                          class="text-danger"
                        >
                          {{
                            errors[0]
                          }}
                        </small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </div>
              </div>
            </b-card>
          </div>
        </div>
        <div class="col-xl-12 align-items-center justify-content-center d-flex text-right">
          <b-button
            type="text"
            variant="primary"
            @click="submit"
          >
            <span v-if="!submitLoading">
              <i class="fa fa-save" />
              Pagar
            </span>
            <span v-if="submitLoading">
              <b-spinner
                small
                variant="light"
                label="Spinning"
              />
            </span>
          </b-button>
        </div>
      </validation-observer>
    </b-col>
  </div>
</template>

<script>
import {
  BFormInput,
  BFormGroup,
  BCol,
  BButton,
  BCard,
  BSpinner,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Spanish } from 'flatpickr/dist/l10n/es.js'

export default {
  name: 'EmailConfigurationCompany',
  components: {
    BFormInput,
    BFormGroup,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BButton,
    BCard,
    BSpinner,
    vSelect,
    flatPickr,
  },
  props: {
    document: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      config: {
        locale: Spanish,
      },
    }
  },
  computed: {
    ...mapState({
      submitLoading: state => state.paySidebar.submitLoading,
      doc: state => state.paySidebar.doc,
      paymentMethods: state => state.app.initData.payment_methods,
    }),
  },
  created() {
    this.$store.dispatch('paySidebar/setInitialState')
  },
  methods: {
    submit() {
      this.$refs.payDataValidation.validate().then(valid => {
        if (valid) {
          console.log('Pasó la validación')
        }
      })
    },
  },
}
</script>

<style lang="scss">
.form-group {
  padding-top: 1em;
}
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>

<template>
  <b-row>
    <b-col
      v-if="!loading"
      md="12"
      sm="12"
    >
      <validation-observer ref="haciendaValidation">
        <b-row>
          <b-col md="6">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="ClipboardIcon"
                    size="1.5x"
                  />Consecutivos
                </h4>
              </div>
              <div class="card-body">
                <b-form-group
                  label="Consecutivo actual Facturas (FE)"
                  label-for="hacienda-cfe"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual Facturas (FE)"
                    rules="required"
                  >
                    <b-form-input
                      id="hacienda-cfe"
                      v-model="hacienda.cfe"
                      name="hacienda-cfe"
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
                <b-form-group
                  label="Consecutivo actual Tiquetes (TE)"
                  label-for="hacienda-cte"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual Tiquetes (TE)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-cte"
                      v-model="hacienda.cte"
                      name="hacienda-cte"
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
                <b-form-group
                  label="Consecutivo actual Notas de credio (NC)"
                  label-for="hacienda-cnc"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual Notas de credio (NC)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-cnc"
                      v-model="hacienda.cnc"
                      name="hacienda-cnc"
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
                <b-form-group
                  label="Consecutivo actual Notas de debito (ND)"
                  label-for="hacienda-cnd"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual Notas de debito (ND)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-cnd"
                      v-model="hacienda.cnd"
                      name="hacienda-cnd"
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
                <b-form-group
                  label="Consecutivo actual recepción Documentos aceptados (CCE)"
                  label-for="hacienda-ccce"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual recepción Documentos aceptados (CCE)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-ccce"
                      v-model="hacienda.ccce"
                      name="hacienda-ccce"
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
                <b-form-group
                  label="Consecutivo actual recepción Documentos aceptados parcialmente (CPCE)"
                  label-for="hacienda-cpce"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual recepción Documentos aceptados parcialmente (CPCE)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-cpce"
                      v-model="hacienda.cpce"
                      name="hacienda-cpce"
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
                <b-form-group
                  label="Consecutivo actual recepción Documentos rechazados (RCE)"
                  label-for="hacienda-crce"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual recepción Documentos rechazados (RCE)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-crce"
                      v-model="hacienda.crce"
                      name="hacienda-crce"
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
                <b-form-group
                  label="Consecutivo actual facturas de compra (Simplificado FEC)"
                  label-for="hacienda-fec"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Consecutivo actual facturas de compra (Simplificado FEC)"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="hacienda-fec"
                      v-model="hacienda.fec"
                      name="hacienda-fec"
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
              </div>
            </b-card>
          </b-col>

          <b-col md="6">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="KeyIcon"
                    size="1.5x"
                  />Datos de acceso
                </h4>
              </div>
              <div class="card-body">
                <b-form-group
                  label="Usuario"
                  label-for="hacienda-username"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Usuario"
                    rules="required"
                  >
                    <b-form-input
                      id="hacienda-username"
                      v-model="hacienda.username"
                      name="hacienda-username"
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

                <b-form-group
                  label="Clave"
                  label-for="hacienda-password"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Clave"
                    rules="required"
                  >
                    <b-form-input
                      id="hacienda-password"
                      v-model="hacienda.password"
                      name="hacienda-password"
                      type="password"
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

                <b-form-group
                  label="PIN llave criptografica"
                  label-for="hacienda-pin"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="PIN llave criptografica"
                    rules="required"
                  >
                    <b-form-input
                      id="hacienda-pin"
                      v-model="hacienda.pin"
                      name="hacienda-pin"
                      type="password"
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

                <b-form-group
                  label="Archivo llave criptografica"
                  label-for="hacienda-key"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Archivo llave criptografica"
                  >
                    <b-form-file
                      ref="hacienda-key"
                      v-model="hacienda.key"
                      name="hacienda-key"
                      browse-text="Examinar"
                      :rules="hacienda.id ? '' : 'required'"
                      @change="onChangeFile($event)"
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

                <b-form-group label-for="hacienda-type">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Modo"
                  >
                    <div class="d-flex">
                      <label class="m-0">Modo</label>
                      <div class="ml-2 d-flex align-items-center">
                        <h6
                          class="mr-1 m-0 font-weight-bolder"
                          :class="!hacienda.type ? 'text-primary' : ''"
                        >En producción</h6>
                        <b-form-checkbox
                          id="hacienda-type"
                          v-model="hacienda.type"
                          name="hacienda-type"
                          switch
                        />
                        <h6
                          class="ml-1 m-0 font-weight-bolder"
                          :class="hacienda.type ? 'text-primary' : ''"
                        >En pruebas</h6>
                      </div>
                    </div>
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
              </div>
            </b-card>
          </b-col>
          <b-col
            md="12"
            class="align-items-center justify-content-end d-flex text-right"
          >
            <b-button
              type="text"
              variant="primary"
              @click="submit"
            >
              <span v-if="!submitLoading"> <i class="fa fa-save" />
                Guardar</span>
              <span v-if="submitLoading"><b-spinner
                small
                variant="light"
                label="Spinning"
              /></span>
            </b-button>
          </b-col>
        </b-row>
      </validation-observer>
    </b-col>
    <b-col md="12">
      <div
        v-if="loading"
        class="d-flex flex-column justify-content-center align-items-center"
      >
        <b-spinner />
        <strong class="ml-1">Cargando...</strong>
      </div>
    </b-col>
  </b-row>
</template>
<script>
import {
  BFormInput,
  BFormGroup,
  BRow,
  BCol,
  BFormFile,
  BFormCheckbox,
  BButton,
  BCard,
  BSpinner,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import {
  handleErrors,
  successToast,
  generateFormData,
} from '../../../helpers/utils'

export default {
  name: 'HaciendaConfigurationCompany',
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BFormFile,
    BFormCheckbox,
    BButton,
    BCard,
    BSpinner,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      loading: state => state.haciendaConfigsCompanies.loading,
      submitLoading: state => state.haciendaConfigsCompanies.submitLoading,
      hacienda: state => state.haciendaConfigsCompanies.hacienda,
    }),
    id() {
      return this.$route.params.company_id
    },
  },
  watch: {},
  created() {
    this.getHaciendaConfigs()
  },
  methods: {
    async onChangeFile(e) {
      const file = e.target.files[0]
      this.hacienda.key = file
    },
    submit() {
      this.$refs.haciendaValidation.validate().then(valid => {
        if (valid) {
          const data = {
            hacienda: this.hacienda,
            company_id: this.id,
            id: this.hacienda.id,
            llave_criptografica: this.hacienda.key,
          }
          const formData = generateFormData(data)
          this.$store
            .dispatch('haciendaConfigsCompanies/submit', formData)
            .then(async () => {
              successToast()
            })
            .catch(e => {
              handleErrors(e)
            })
        }
      })
    },
    getHaciendaConfigs() {
      this.$store
        .dispatch('haciendaConfigsCompanies/get', {
          company_id: this.id,
        })
        .then(() => {})
    },
  },
}
</script>

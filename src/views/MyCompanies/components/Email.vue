<template>
  <div class="row">
    <b-col
      v-if="!loading"
      md="12"
    >
      <validation-observer ref="emailDataValidation">
        <div class="row">
          <div class="col-xl-12">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="AtSignIcon"
                    size="1.5x"
                  />Configuraciones servidor de email
                </h4>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-xl-12">
                    <b-form-group
                      class="text-center"
                      label-for="customEmailConfigCb"
                    >
                      <div class="d-flex">
                        <label
                          class="mr-2"
                        >¿Desea usar una configuración de correo electrónico personalizada?</label>
                        <validation-provider
                          name="¿Desea usar una configuración de correo electrónico personalizada?"
                        >
                          <b-form-checkbox
                            id="customEmailConfigCb"
                            v-model="customEmailConfigCb"
                            name="customEmailConfigCb"
                          />
                        </validation-provider>
                      </div>
                    </b-form-group>
                  </div>
                  <div class="col-xl-6">
                    <b-form-group
                      label="Nombre de usuario"
                      label-for="register-name"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Nombre de usuario"
                        :rules="`${!customEmailConfigCb ? '' : 'required|email'}`"
                      >
                        <b-form-input
                          id="emailData-username"
                          v-model="emailData.username"
                          name="emailData-username"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Contraseña"
                      label-for="register-password"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Contraseña"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-password"
                          v-model="emailData.password"
                          name="emailData-password"
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
                  </div>
                  <div class="col-xl-6">
                    <b-form-group
                      label="Correo emisor (From)"
                      label-for="register-fromEmail"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Correo emisor (From)"
                        :rules="`${!customEmailConfigCb ? '' : 'required|email'}`"
                      >
                        <b-form-input
                          id="emailData-fromEmail"
                          v-model="emailData.fromEmail"
                          name="emailData-fromEmail"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Nombre emisor (From)"
                      label-for="register-fromName"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Nombre emisor (From)"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-fromName"
                          v-model="emailData.fromName"
                          name="emailData-fromName"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Host"
                      label-for="registrar-host"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Host"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-host"
                          v-model="emailData.host"
                          name="emailData-host"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Puerto"
                      label-for="registrar-puerto"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Puerto"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-port"
                          v-model="emailData.port"
                          name="emailData-port"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Protocolo"
                      label-for="registrar-protocol"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Protocolo"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-protocol"
                          v-model="emailData.protocol"
                          name="emailData-protocol"
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
                  <div class="col-xl-6">
                    <b-form-group
                      label="Encriptación"
                      label-for="registrar-encryption"
                      :class="!customEmailConfigCb ? 'd-none' : ''"
                    >
                      <validation-provider
                        #default="{ errors, touched }"
                        name="Encriptación"
                        :rules="`${!customEmailConfigCb ? '' : 'required'}`"
                      >
                        <b-form-input
                          id="emailData-encryption"
                          v-model="emailData.encryption"
                          name="emailData-encryption"
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
                </div>
              </div>
            </b-card>
          </div>
        </div>
        <div
          v-if="customEmailConfigCb"
          class="col-md-12 align-items-center justify-content-end d-flex text-right"
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
        </div>
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
  </div>
</template>

<script>
import {
  BFormInput,
  BFormGroup,
  BCol,
  BButton,
  BCard,
  BFormCheckbox,
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
  name: 'EmailConfigurationCompany',
  components: {
    BFormInput,
    BFormGroup,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BButton,
    BCard,
    BFormCheckbox,
    BSpinner,
  },
  data() {
    return {
      customEmailConfigCb: false,
      emailLoading: false,
    }
  },
  computed: {
    ...mapState({
      loading: state => state.emailConfigsCompanies.loading,
      submitLoading: state => state.emailConfigsCompanies.submitLoading,
      emailData: state => state.emailConfigsCompanies.emailData,
    }),
    id() {
      return this.$route.params.company_id
    },
  },
  watch: {
    customEmailConfigCb: {
      handler() {
        this.$refs.emailDataValidation.reset()
      },
      deep: true,
    },
  },
  created() {
    this.getEmailConfigs()
  },
  methods: {
    submit() {
      this.$refs.emailDataValidation.validate().then(valid => {
        if (valid) {
          const data = {
            emailData: this.emailData,
            company_id: this.id,
            type: 'sender',
          }
          const formData = generateFormData(data)
          this.$store
            .dispatch('emailConfigsCompanies/submit', formData)
            .then(async () => {
              successToast()
            })
            .catch(e => {
              handleErrors(e)
            })
        }
      })
    },
    getEmailConfigs() {
      this.$store.dispatch('emailConfigsCompanies/get', {
        company_id: this.id,
      })
    },
  },
}
</script>

<style scoped>
.form-group {
  padding-top: 1em;
}

.logo {
  max-width: 100px;
  max-height: 700px;
  width: auto;
  height: auto;
  margin-bottom: 8px;
}
</style>

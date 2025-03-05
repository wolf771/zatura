<template>
  <b-row>
    <b-col
      v-if="!loading"
      md="12"
      sm="12"
    >
      <validation-observer ref="emailTemplatesValidation">
        <b-row>
          <b-col md="12">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="MailIcon"
                    size="1.5x"
                  />Plantillas para correos
                </h4>
              </div>
              <b-tabs
                pills
                card
                vertical
                @input="onChangeTab"
              >
                <b-tab
                  v-for="t in templates"
                  :key="t.id"
                  :title="t.name"
                >
                  <b-row>
                    <b-col md="10">
                      <b-form-group label="Asunto">
                        <validation-provider
                          #default="{ errors, touched }"
                          name="Asunto"
                          rules="required"
                        >
                          <b-form-input
                            v-model="template.subject"
                            name="template-subject"
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
                      <b-form-group label="Contenido">
                        <validation-provider
                          #default="{ errors, touched }"
                          name="Contenido"
                          rules="required"
                        >
                          <vue-editor v-model="template.body" />
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
                    <b-col md="2">
                      <h3>Variables</h3>
                      <b-button
                        class="mb-1"
                        type="text"
                        variant="primary"
                        @click="handleVariable('{customer_name}')"
                      >{customer_name}</b-button>
                      <b-button
                        class="mb-1"
                        type="text"
                        variant="primary"
                        @click="handleVariable('{reference}')"
                      >{reference}</b-button>
                      <b-button
                        class="mb-1"
                        type="text"
                        variant="primary"
                        @click="handleVariable('{expiration_date}')"
                      >{expiration_date}</b-button>
                      <b-button
                        class="mb-1"
                        type="text"
                        variant="primary"
                        @click="handleVariable('{company_name}')"
                      >{company_name}</b-button>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
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
        v-if="loading "
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
  BButton,
  BCard,
  BTabs,
  BTab,
  BSpinner,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import { VueEditor } from 'vue2-editor'
import {
  handleErrors,
  successToast,
  generateFormData,
} from '../../../helpers/utils'

export default {
  name: 'EmailTemplatesConfigurationCompany',
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BButton,
    BCard,
    BTabs,
    BTab,
    BSpinner,
    VueEditor,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      loading: state => state.templateEmailCompanies.loading,
      submitLoading: state => state.templateEmailCompanies.submitLoading,
      template: state => state.templateEmailCompanies.template,
      templates: state => state.templateEmailCompanies.templates,
    }),
    id() {
      return this.$route.params.company_id
    },
  },
  watch: {},
  created() {
    this.getTemplatesEmail()
  },
  methods: {
    submit() {
      this.$refs.emailTemplatesValidation.validate().then(valid => {
        if (valid) {
          const data = {
            company_id: this.id,
            template: this.template,
          }
          const formData = generateFormData(data)
          this.$store
            .dispatch('templateEmailCompanies/submit', formData)
            .then(async () => {
              successToast()
            })
            .catch(e => {
              handleErrors(e)
            })
        }
      })
    },
    onChangeTab(tabIndex) {
      this.$store.dispatch('templateEmailCompanies/setTemplateEmail', {
        tabIndex,
      })
    },
    getTemplatesEmail() {
      this.$store.dispatch('templateEmailCompanies/get', {
        company_id: this.id,
      })
    },
    async handleVariable(text) {
      await navigator.clipboard.writeText(text)
    },
  },
}
</script>

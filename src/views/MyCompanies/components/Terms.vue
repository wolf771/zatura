<template>
  <b-row>
    <b-col
      v-if="!loading"
      md="12"
      sm="12"
    >
      <validation-observer ref="termsValidation">
        <b-row>
          <b-col md="12">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="Edit2Icon"
                    size="1.5x"
                  />Términos y condiciones
                </h4>
              </div>
              <b-tabs
                pills
                card
                vertical
                @input="onChangedTab"
              >
                <b-tab
                  v-for="t in terms"
                  :key="t.id"
                  :title="t.name"
                >
                  <b-row>
                    <b-col md="12">
                      <b-form-group
                        label="Contenido"
                        label-for="template-password"
                      >
                        <validation-provider
                          #default="{ errors, touched }"
                          name="Contenido"
                          rules="required"
                        >
                          <vue-editor v-model="term.body" />
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
              type="button"
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
  name: 'TermsConfigurationCompany',
  components: {
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BButton,
    BCard,
    BTabs,
    BTab,
    VueEditor,
    BSpinner,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      loading: state => state.termsCompanies.loading,
      submitLoading: state => state.termsCompanies.submitLoading,
      term: state => state.termsCompanies.term,
      terms: state => state.termsCompanies.terms,
    }),
    id() {
      return this.$route.params.company_id
    },
  },
  watch: {},
  created() {
    this.getTerms()
  },
  methods: {
    submit() {
      this.$refs.termsValidation.validate().then(valid => {
        if (valid) {
          const data = {
            term: this.term,
            company_id: this.id,
          }
          const formData = generateFormData(data)
          this.$store
            .dispatch('termsCompanies/submit', formData)
            .then(async () => {
              successToast()
            })
            .catch(e => {
              handleErrors(e)
            })
        }
      })
    },
    getTerms() {
      this.$store.dispatch('termsCompanies/get', {
        company_id: this.id,
      })
    },
    onChangedTab(tabIndex) {
      this.$store.dispatch('termsCompanies/setTerm', {
        tabIndex,
      })
    },
  },
}
</script>

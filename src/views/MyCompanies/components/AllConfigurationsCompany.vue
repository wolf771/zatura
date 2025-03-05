<template>
  <div class="row">
    <div
      v-if="!companiesLoading && checkAuthUser()"
      class="col-md-12"
    >
      <validation-observer ref="configurationValidation">
        <div class="row">
          <div class="col-md-4">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="AlertCircleIcon"
                    size="1.5x"
                  />Detalle
                </h4>
              </div>

              <div class="card-body">
                <b-form-group
                  label="Nombre"
                  label-for="company-name"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Nombre"
                    rules="required"
                  >
                    <b-form-input
                      id="company-name"
                      v-model="company.name"
                      name="company-name"
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

                <b-form-group label-for="company-fantasy-name">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Nombre fantasía"
                  >
                    <label>
                      Nombre fantasía
                      <feather-icon
                        v-b-tooltip.hover
                        title="Si quiere colocar un nombre personalizado de su
                            negocio
                            diferente al registrado en hacienda y este salga en
                            sus
                            facturas llene este campo sino déjelo vacío."
                        icon="HelpCircleIcon"
                        size="1.5x"
                      />
                    </label>
                    <b-form-input
                      id="company-fantasy-name"
                      v-model="company.fantasy_name"
                      name="company-fantasy-name"
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
                  label="Tipo identificación"
                  label-for="company-identification-type"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Tipo identificación"
                    rules="required"
                  >
                    <b-form-select
                      id="company-identification-type"
                      v-model="company.identification_type"
                      :options="identificationTypes"
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
                  label="Identificación"
                  label-for="company-identification"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Identificación"
                    :rules="validateIdentificationLength(company.identification_type)"
                  >
                    <b-form-input
                      id="company-identification"
                      v-model="company.identification"
                      name="company-identification"
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
                  label="Email"
                  label-for="company-email"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Email"
                    rules="required|email"
                  >
                    <b-form-input
                      id="company-email"
                      v-model="company.email"
                      name="company-email"
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
                  label="Teléfono"
                  label-for="company-phone"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Teléfono"
                    rules="required|numeric"
                  >
                    <b-form-input
                      id="company-phone"
                      v-model="company.phone"
                      name="company-phone"
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
                <b-form-group label-for="company-logo">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Logo"
                  >
                    <div class="d-flex">
                      <label class="mr-1">Logo</label>
                      <small class="text-primary">Para cambiar el logo elige uno nuevo.</small>
                    </div>
                    <b-img
                      v-if="!company.logo_file"
                      :src="`${url_logo}/${company.logo}`"
                      style="width: 100px; height: 100px;display:block;object-fit:contain"
                      @error="handleImgError"
                    />
                    <b-img
                      v-if="company.logo_file"
                      :src="`${company.logo}`"
                      style="width: 100px; height: 100px;display:block;object-fit:contain"
                      @error="handleImgError"
                    />
                    <b-form-file
                      id="custom-file-input"
                      v-model="file"
                      class="custom-file-input"
                      plain
                    />
                    <label
                      class="custom-file-input-label"
                      for="custom-file-input"
                    >
                      <button
                        type="button"
                        class="btn btn-primary"
                      >Subir logo</button>
                    </label>
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
          </div>
          <div class="col-md-4">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="MapPinIcon"
                    size="1.5x"
                  />Ubicación
                </h4>
              </div>
              <div class="card-body">
                <b-form-group
                  label="Provincia"
                  label-for="company-province"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Provincia"
                    rules="required"
                  >
                    <v-select
                      id="company-province"
                      v-model="company.province"
                      :options="provinces"
                      :reduce="province => province.id"
                      label="name"
                      searchable
                      @input="onChangeProvince($event)"
                    >
                      <div slot="no-options">
                        No se encontraron provincias
                      </div>
                    </v-select>
                    <small
                      v-show="errors[0] "
                      class="text-danger"
                    >
                      {{
                        errors[0]
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>

                <b-form-group
                  label="Cantón"
                  label-for="company-canton"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Cantón"
                    rules="required"
                  >
                    <v-select
                      id="company-canton"
                      v-model="company.canton"
                      :options="cantons"
                      :reduce="canton => canton.number"
                      label="name"
                      searchable
                      @input="onChangeCanton($event)"
                    >
                      <div slot="no-options">
                        No se encontraron cantones
                      </div>
                    </v-select>

                    <small
                      v-show="errors[0] "
                      class="text-danger"
                    >
                      {{
                        errors[0]
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>

                <b-form-group
                  label="Distrito"
                  label-for="company-district"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Distrito"
                    rules="required"
                  >
                    <v-select
                      id="company-district"
                      v-model="company.district"
                      :options="districts"
                      :reduce="district => district.number"
                      label="name"
                      searchable
                      @input="onChangeDistrict($event)"
                    >
                      <div slot="no-options">
                        No se encontraron distritos
                      </div>
                    </v-select>

                    <small
                      v-show="errors[0] "
                      class="text-danger"
                    >
                      {{
                        errors[0]
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>

                <b-form-group
                  label="Barrio"
                  label-for="company-barrio"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Barrio"
                    rules="required"
                  >
                    <v-select
                      id="company-barrio"
                      v-model="company.barrio"
                      :options="barrios"
                      :reduce="barrio => barrio.id"
                      label="name"
                      searchable
                    >
                      <div slot="no-options">
                        No se encontraron barrios
                      </div>
                    </v-select>
                    <small
                      v-show="errors[0]"
                      class="text-danger"
                    >
                      {{
                        errors[0]
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>

                <b-form-group
                  label="Otras Señas"
                  label-for="company-other-signs"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Otras Señas"
                    rules="required"
                  >
                    <b-form-input
                      id="company-other-signs"
                      v-model="company.other_signs"
                      name="company-other-signs"
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
                  label="Actividad Económica"
                  label-for="company-economic_activity"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Actividad Económica"
                    rules="required"
                  >
                    <v-select
                      id="company-economic_activity"
                      v-model="company.economic_activity"
                      :options="economic_activities"
                      :reduce="economic_activity => economic_activity.id"
                      label="name"
                      searchable
                    >
                      <div slot="no-options">
                        No se encontraron actividades económicas
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
              </div>
            </b-card>
          </div>

          <!-- configuracion  -->
          <div class="col-md-4">
            <b-card class="card-form-config-companies">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <feather-icon
                    icon="SettingsIcon"
                    size="1.5x"
                  />Preferencias
                </h4>
              </div>

              <div class="card-body">
                <b-form-group label-for="other_configs-custom_quotation_name">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Nombre Cotización(preforma...)"
                    rules="required"
                  >
                    <label>
                      Nombre Cotización(preforma...)
                      <feather-icon
                        v-b-tooltip.hover
                        title="El nombre que aparecerá en todo el sistema y documentos para tus cotizaciones"
                        icon="HelpCircleIcon"
                        size="1.5x"
                      />
                    </label>
                    <b-form-input
                      id="other_configs-custom_quotation_name"
                      v-model="other_configs.custom_quotation_name"
                      name="other_configs-custom_quotation_name"
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

                <b-form-group label-for="other_configs-currency">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Moneda sistema"
                    rules="required"
                  >
                    <label>
                      Moneda sistema
                      <feather-icon
                        v-b-tooltip.hover
                        title="Es la moneda que mostrará el sistema en el dashboard y en los reportes"
                        icon="HelpCircleIcon"
                        size="1.5x"
                      />
                    </label>
                    <b-form-select
                      id="other_configs-currency"
                      v-model="other_configs.currency"
                      :options="currencies"
                      value-field="id"
                      text-field="name"
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

                <b-form-group label-for="other_configs-custom_quotation_name">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Modo POS"
                  >
                    <div class="d-flex">
                      <label class="m-0">
                        Modo POS
                        <feather-icon
                          v-b-tooltip.hover
                          title="Cuando el modo POS está activo habilita un buscador
                            de productos al momento de generar documentos que agiliza el
                            proceso pensado en puntos de venta"
                          icon="HelpCircleIcon"
                          size="1.5x"
                        />
                      </label>
                      <div class="ml-2 d-flex align-items-center">
                        <h6
                          class="mr-1 m-0 font-weight-bolder"
                          :class="!other_configs.mode_pos ? 'text-primary' : ''"
                        >NO</h6>
                        <b-form-checkbox
                          id="other_configs-mode_pos"
                          v-model="other_configs.mode_pos"
                          name="other_configs-mode_pos"
                          switch
                        />
                        <h6
                          class="ml-1 m-0 font-weight-bolder"
                          :class="other_configs.mode_pos ? 'text-primary' : ''"
                        >SI</h6>
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

                <b-form-group label-for="other_configs-currency_emit_doc">
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Moneda por defecto al emitir documentos"
                    rules="required"
                  >
                    <label>
                      Moneda por defecto al emitir documentos
                      <feather-icon
                        v-b-tooltip.hover
                        title="Con esta opción puedes elegir una moneda por defecto que aparezca preseleccionada al emitir documentos
                            o dejalo en preguntar para que siempre te
                            pregunte el tipo de moneda."
                        icon="HelpCircleIcon"
                        size="1.5x"
                      />
                    </label>
                    <b-form-select
                      id="other_configs-currency_emit_doc"
                      v-model="other_configs.currency_emit_doc"
                      :options="currencies_emit_docs"
                      value-field="id"
                      text-field="name"
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
                  v-if="user.user_role.name === 'admin' || user.user_role.name === 'superadmin'"
                  label-for="other_configs-plan_id"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Plan"
                    :rules="user.user_role.name === 'admin' || user.user_role.name === 'superadmin' ? 'required' : ''"
                  >
                    <label>
                      Plan
                      <feather-icon
                        v-b-tooltip.hover
                        title="Plan por el momento puede elegir solo recepción,
                            full facturación o Escuela."
                        icon="HelpCircleIcon"
                        size="1.5x"
                      />
                    </label>
                    <b-form-select
                      id="company-plan_id"
                      v-model="company.plan_id"
                      :options="plans"
                      value-field="id"
                      text-field="name"
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
                  v-if="user.user_role.name === 'admin' || user.user_role.name === 'superadmin'"
                  label-for="other_configs-stop_generate_xmls"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Apagar generación de XMLS Hacienda"
                  >
                    <div class="d-flex">
                      <label class="m-0">
                        Apagar generación de XMLS Hacienda
                        <feather-icon
                          v-b-tooltip.hover
                          title="Si pones esta opción en SI se generaran facturas pero sin que se generen xml de las mismas
                            y sin envió a hacienda"
                          icon="HelpCircleIcon"
                          size="1.5x"
                        />
                      </label>
                      <div class="ml-2 d-flex align-items-center">
                        <h6
                          class="mr-1 m-0 font-weight-bolder"
                          :class="!other_configs.stop_generate_xmls ? 'text-primary' : ''"
                        >NO</h6>
                        <b-form-checkbox
                          id="other_configs-stop_generate_xmls"
                          v-model="other_configs.stop_generate_xmls"
                          name="other_configs-stop_generate_xmls"
                          switch
                        />
                        <h6
                          class="ml-1 m-0 font-weight-bolder"
                          :class="other_configs.stop_generate_xmls ? 'text-primary' : ''"
                        >SI</h6>
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
          </div>
          <!-- end configuracion -->
        </div>
        <div class="col-md-12 align-items-center justify-content-end d-flex text-right">
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
    </div>
    <b-col md="12">
      <div
        v-if="companiesLoading || !checkAuthUser() "
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
  BFormSelect,
  BButton,
  BCard,
  BFormCheckbox,
  BFormFile,
  BImg,
  BSpinner,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import { isNull } from 'lodash'
import vSelect from 'vue-select'
import { Config } from '@config'
import {
  handleErrors,
  successToast,
  generateFormData,
} from '../../../helpers/utils'

const logoCompanyDefault = require('@/assets/images/logo/company_logo_default.png')

export default {
  name: 'AllConfigurationsCompany',
  components: {
    BFormInput,
    BFormGroup,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BFormSelect,
    BButton,
    BCard,
    BFormCheckbox,
    BFormFile,
    BImg,
    BSpinner,
    vSelect,
  },
  data() {
    return {
      config: {
        company_id: '',
        custom_quotation_name: '',
        currency: {
          id: '',
          symbol: '',
          name: '',
        },
        mode_pos: false,
        currency_emit_doc: 0,
      },
      fileList: [],
      // Config
      currencies_emit_docs: [
        { name: 'Preguntar', id: 0 },
        { name: 'Colones', id: 2 },
        { name: 'Dolares', id: 1 },
      ],
      permissions: [
        { text: 'Plan full', value: '1' },
        { text: 'Plan solo recepción', value: '2' },
        { text: 'Plan Escuelas', value: '3' },
        { text: 'Plan 100 anual', value: '4' },
      ],
      file: null,
      url_logo: Config.url_files,
    }
  },
  computed: {
    ...mapState({
      identificationTypes: state => state.app.identificationTypes,
      provinces: state => state.app.initData.provinces,
      countries: state => state.app.initData.countries,
      economic_activities: state => state.app.initData.economic_activities,
      plans: state => state.app.initData.plans,
      currencies: state => state.app.initData.currencies,
      cantons: state => state.app.cantons,
      districts: state => state.app.districts,
      barrios: state => state.app.barrios,
      user: state => state.auth.user,
      company: state => state.configCompanies.company,
      other_configs: state => state.configCompanies.other_configs,
      companiesLoading: state => state.configCompanies.loading,
      submitLoading: state => state.configCompanies.submitLoading,
    }),
    id() {
      return this.$route.params.company_id
    },
  },
  watch: {
    file: {
      handler(file) {
        if (!isNull(file)) {
          this.company.logo_file = file
          this.company.logo = file
          this.company.logo = window.URL.createObjectURL(file)
        }
      },
      deep: true,
    },
  },
  created() {
    this.getCompany()
  },
  methods: {
    async onChangeProvince(provinceNumber) {
      await this.$store.dispatch(
        'app/getCantonsByProvinceNumber',
        provinceNumber,
      )
      this.company.canton = null
      this.company.district = null
      this.company.barrio = null
    },
    async onChangeCanton(cantonNumber) {
      await this.$store.dispatch('app/getDistrictsByCantonNumber', {
        cantonNumber,
        provinceNumber: this.company.province,
      })
      this.company.district = null
      this.company.barrio = null
    },
    async onChangeDistrict(districtNumber) {
      await this.$store.dispatch('app/getBarriosByDistrictNumber', {
        districtNumber,
        provinceNumber: this.company.province,
        cantonNumber: this.company.canton,
      })
      this.company.barrio = null
    },
    validateIdentificationLength(type) {
      let rules = 'required'
      switch (type) {
        case '01':
          rules = 'required|integer|min:9|max:9'
          break
        case '02':
          rules = 'required|integer|min:10|max:10'
          break
        case '03':
          rules = 'required|integer|min:11|max:12'
          break
        case '04':
          rules = 'required|integer|min:10|max:10'
          break
        default:
          rules = 'required'
          break
      }
      return rules
    },
    checkAuthUser() {
      return !isNull(this.user)
    },
    submit() {
      this.$refs.configurationValidation.validate().then(valid => {
        if (valid) {
          const other_configs = { ...this.other_configs }
          const company = { ...this.company }
          delete company.logo_file
          other_configs.currency = this.currencies.find(
            currency => currency.id === other_configs.currency,
          )
          company.company_id = this.id
          company.canton = this.cantons.find(
            canton => canton.number === company.canton,
          ).id
          company.district = this.districts.find(
            district => district.number === company.district,
          ).id
          const data = {
            company,
            other_configs,
            logo_file: this.company.logo_file,
          }
          const formData = generateFormData(data)
          this.$store
            .dispatch('configCompanies/submit', formData)
            .then(async () => {
              successToast()
            })
            .catch(e => {
              handleErrors(e)
            })
        }
      })
    },
    handleImgError(e) {
      e.target.src = logoCompanyDefault
    },
    getCompany() {
      this.$store.dispatch('configCompanies/get', {
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

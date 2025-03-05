<template>
  <validation-observer ref="companyValidation">
    <b-row class="p-md-5 justify-content-center">
      <b-col
        md="6"
        sm="12"
      >
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

        <b-form-group
          label="Nombre fantasia"
          label-for="company-fantasy-name"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Nombre fantasia"
          >
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
      </b-col>
      <b-col>
        <b-form-group
          label="Provincia"
          label-for="company-province"
        >
          <validation-provider
            #default="{ errors, touched }"
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
          label="Cantón"
          label-for="company-canton"
        >
          <validation-provider
            #default="{ errors, touched }"
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
          label="Distrito"
          label-for="company-district"
        >
          <validation-provider
            #default="{ errors, touched }"
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
          label="Barrio"
          label-for="company-barrio"
        >
          <validation-provider
            #default="{ errors, touched }"
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
      </b-col>
    </b-row>
  </validation-observer>
</template>
<script>
import {
  BFormInput, BFormGroup, BRow, BCol, BFormSelect,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BFormSelect,
    vSelect,
  },
  props: {
    currentStep: { type: Object, default: () => {} },
  },
  data() {
    return {
      company: {
        name: '',
        fantasy_name: '',
        identification_type: '',
        identification: '',
        email: '',
        phone: '',
        logo: '',
        province: '',
        other_signs: '',
        economic_activity: '',
        canton: '',
        district: '',
        barrio: '',
      },
    }
  },
  computed: {
    ...mapState({
      identificationTypes: state => state.app.identificationTypes,
      provinces: state => state.app.initData.provinces,
      cantons: state => state.app.cantons,
      districts: state => state.app.districts,
      barrios: state => state.app.barrios,
      economic_activities: state => state.app.initData.economic_activities,
    }),
  },
  watch: {
    company: {
      handler() {
        this.$refs.companyValidation.validate().then(valid => {
          if (valid) {
            this.$store.commit('app/SET_REGISTER', { company: this.company })
            this.$emit('can-continue', { value: true })
          } else {
            this.$emit('can-continue', { value: false })
          }
        })
      },
      deep: true,
    },
    currentStep(val) {
      if (val.name === 'two') this.$emit('can-continue', { value: true })
    },
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
  },
}
</script>

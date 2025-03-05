<!-- eslint-disable vue/this-in-template -->
<template>
  <div v-if="countries.length > 0 && provinces.length > 0">
    <validation-observer ref="createClientForm">
      <b-form
        class="mt-2"
        @submit.prevent="createClient"
      >
        <b-container>
          <b-row>
            <b-col>
              <b-form-group
                label="Nombre"
                label-for="client-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Nombre"
                  rules="required"
                >
                  <b-form-input
                    id="client-name"
                    v-model="client.name"
                    :state="errors.length > 0 ? false : null"
                    name="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group
                label="Tipo identificación"
                label-for="client-identification-type"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Tipo identificación"
                  rules="required"
                >
                  <b-form-select
                    id="client-identification-type"
                    v-model="client.identification_type"
                    :options="identificationTypes"
                    value-field="value"
                    text-field="text"
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
                label="Identificación"
                label-for="client-identification"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Identificación"
                  rules="required"
                >
                  <b-form-input
                    id="client-identification"
                    v-model="client.identification"
                    :state="errors.length > 0 ? false : null"
                    name="client-identification"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group
                label="Email"
                label-for="client-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="client-email"
                    v-model="client.email"
                    :state="errors.length > 0 ? false : null"
                    name="client-email"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group
                label="Teléfono"
                label-for="client-phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Teléfono"
                  rules="required"
                >
                  <b-form-input
                    id="client-phone"
                    v-model="client.phone"
                    :state="errors.length > 0 ? false : null"
                    name="client-phone"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                label="País"
                label-for="client-country"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="País"
                  rules="required"
                >
                  <b-form-select
                    id="client-country"
                    v-model="client.country"
                    :options="countries"
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
              <div v-if="this.client.country === 60">
                <b-form-group
                  label="Provincia"
                  label-for="client-province"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Provincia"
                    rules="required"
                  >
                    <b-form-select
                      id="client-province"
                      v-model="client.province"
                      text-field="name"
                      value-field="id"
                      :options="provinces"
                      @change="onChangeProvince($event)"
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
                  label="Cantón"
                  label-for="client-canton"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Cantón"
                    rules="required"
                  >
                    <b-form-select
                      id="client-canton"
                      v-model="client.canton"
                      text-field="name"
                      value-field="number"
                      :options="cantons"
                      @change="onChangeCanton($event)"
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
                  label="Distrito"
                  label-for="client-district"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Distrito"
                    rules="required"
                  >
                    <b-form-select
                      id="client-district"
                      v-model="client.district"
                      text-field="name"
                      value-field="number"
                      :options="districts"
                      @change="onChangeDistrict($event)"
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
                  label="Barrio"
                  label-for="client-barrio"
                >
                  <validation-provider
                    #default="{ errors, touched }"
                    name="Barrio"
                    rules="required"
                  >
                    <b-form-select
                      id="client-barrio"
                      v-model="client.barrio"
                      :options="barrios"
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
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div
                class="d-flex justify-content-between align-items-center border-top mt-2 pt-2"
              >
                <h4>Contactos</h4>
                <b-button
                  variant="primary"
                  class="px-1"
                  @click="addContact"
                >
                  <feather-icon
                    size="1.2x"
                    icon="PlusIcon"
                  />
                </b-button>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              v-for="(c, index) in contacts"
              :key="index"
              md="6"
            >
              <b-card>
                <feather-icon
                  icon="XCircleIcon"
                  size="1.2x"
                  class="float-right text-danger cursor-pointer"
                  @click="removeContact(index)"
                />
                <b-form-group
                  label="Nombre"
                  label-for="client-code"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nombre"
                    :rules="contacts[index].email ? 'required' : ''"
                  >
                    <b-form-input
                      v-model="contacts[index].name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
                <b-form-group
                  label="Email"
                  label-for="client-email"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Email"
                    :rules="contacts[index].name ? 'required|email' : ''"
                  >
                    <b-form-input
                      v-model="contacts[index].email"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div
                class="d-flex justify-content-center border-top align-items-center py-5"
              >
                <b-button
                  type="submit"
                  variant="primary"
                >Guardar</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </validation-observer>
  </div>
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
  VBToggle,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

const clientInitialData = {
  id: null,
  name: null,
  identification_type: '01',
  identification: null,
  email: null,
  phone: null,
  province: 1,
  canton: '01',
  district: '01',
  barrio: 1,
  country: 60,
  contacts: [],
}

const contactsInitialData = [
  {
    name: null,
    email: null,
  },
]

export default {
  components: {
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
    BCard,
    FeatherIcon,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // eslint-disable-next-line prefer-object-spread
      client: Object.assign({}, clientInitialData),
      contacts: Object.assign([], contactsInitialData),
    }
  },
  computed: {
    ...mapState({
      identificationTypes: state => state.app.identificationTypes,
      countries: state => state.app.initData.countries,
      provinces: state => state.app.initData.provinces,
      cantons: state => state.app.cantons,
      districts: state => state.app.districts,
      barrios: state => state.app.barrios,
    }),
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          console.log(val, this.countries)
          this.client = { ...val }
          this.client.country = val.country_id
          this.contacts = val.contacts.length > 0
            ? val.contacts
            : Object.assign([], contactsInitialData)

          this.client.province = val.province.number
          this.client.canton = val.canton.number
          this.client.district = val.district.number
          this.client.barrio = val.barrio.id

          this.onChangeProvince(val.province.number)
          this.onChangeCanton(val.canton.number)
          this.onChangeDistrict(val.district.number)
        } else {
          this.client = { ...clientInitialData }
          this.contacts = Object.assign([], contactsInitialData)
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.loadSelect()
  },
  methods: {
    addContact() {
      this.contacts.push({
        name: null,
        email: null,
      })
    },
    removeContact(index) {
      this.contacts.splice(index, 1)
    },
    createClient() {
      this.$refs.createClientForm.validate().then(async success => {
        if (success) {
          const res = await this.$store.dispatch('clients/save', {
            ...this.client,
            contacts: this.contacts.filter(c => c.name && c.email),
          })
          // eslint-disable-next-line prefer-object-spread
          this.client = Object.assign({}, clientInitialData)
          this.contacts = Object.assign([], contactsInitialData)
          this.$refs.createClientForm.reset()
          this.$emit('saved', res)

          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Cliente guardado correctamente',
              icon: 'CheckCircleIcon',
              variant: 'success',
            },
          })
        }
      })
    },
    async fetchOptions(search, loading) {
      if (search) {
        loading(true)
        const res = await this.$store.dispatch('app/getCabysCodes', {
          search,
        })
        loading(false)
        this.options = res
        return res
      }
      return null
    },
    async onChangeProvince(provinceNumber) {
      await this.$store.dispatch(
        'app/getCantonsByProvinceNumber',
        provinceNumber,
      )
    },
    async onChangeCanton(cantonNumber) {
      await this.$store.dispatch(
        'app/getDistrictsByCantonNumber',
        {
          cantonNumber,
          provinceNumber: this.client.province,
        },
      )
    },
    async onChangeDistrict(districtNumber) {
      await this.$store.dispatch(
        'app/getBarriosByDistrictNumber',
        {
          districtNumber,
          provinceNumber: this.client.province,
          cantonNumber: this.client.canton,
        },
      )
    },
    loadSelect() {
      this.onChangeProvince(this.provinceNumber = 1)
      this.onChangeCanton(this.cantonNumber = '01')
      this.onChangeDistrict(this.districtNumber = '01')
    },
  },
}
</script>

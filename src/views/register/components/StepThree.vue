<template>
  <validation-observer ref="haciendaValidation">
    <b-row class="p-md-5 justify-content-center">
      <b-col
        md="6"
        sm="12"
      >
        <b-form-group
          label="Usuario"
          label-for="hacienda-username"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Usuario"
            :rules="`${required ? 'required' : ''}`"
          >
            <b-form-input
              id="hacienda-username"
              v-model="hacienda.username"
              name="hacienda-username"
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
          label="Clave"
          label-for="hacienda-password"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Clave"
            :rules="`${required ? 'required' : ''}`"
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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

        <b-form-group
          label="PIN llave criptografica"
          label-for="hacienda-pin"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="PIN llave criptografica"
            :rules="`${required ? 'required' : ''}`"
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
            >{{
              errors[0]
            }}</small>
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
              :rules="`${required ? 'required' : ''}`"
              @change="onChangeFile($event)"
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
      <b-col>
        <b-form-group
          label="Consecutivo actual Facturas (FE)"
          label-for="hacienda-cfe"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual Facturas (FE)"
            :rules="`${required ? 'required' : ''}`"
          >
            <b-form-input
              id="hacienda-cfe"
              v-model="hacienda.cfe"
              name="hacienda-cfe"
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
          label="Consecutivo actual Tiquetes (TE)"
          label-for="hacienda-cte"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual Tiquetes (TE)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-cte"
              v-model="hacienda.cte"
              name="hacienda-cte"
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
          label="Consecutivo actual Notas de credio (NC)"
          label-for="hacienda-cnc"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual Notas de credio (NC)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-cnc"
              v-model="hacienda.cnc"
              name="hacienda-cnc"
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
          label="Consecutivo actual Notas de debito (ND)"
          label-for="hacienda-cnd"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual Notas de debito (ND)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-cnd"
              v-model="hacienda.cnd"
              name="hacienda-cnd"
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
          label="Consecutivo actual recepción Documentos aceptados (CCE)"
          label-for="hacienda-ccce"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual recepción Documentos aceptados (CCE)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-ccce"
              v-model="hacienda.ccce"
              name="hacienda-ccce"
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
          label="Consecutivo actual recepción Documentos aceptados parcialmente (CPCE)"
          label-for="hacienda-ccpce"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual recepción Documentos aceptados parcialmente (CPCE)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-ccpce"
              v-model="hacienda.ccpce"
              name="hacienda-ccpce"
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
          label="Consecutivo actual recepción Documentos rechazados (RCE)"
          label-for="hacienda-crce"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual recepción Documentos rechazados (RCE)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-crce"
              v-model="hacienda.crce"
              name="hacienda-crce"
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
          label="Consecutivo actual facturas de compra (Simplificado FEC)"
          label-for="hacienda-cfec"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Consecutivo actual facturas de compra (Simplificado FEC)"
            :rules="`${required ? 'required|integer' : ''}`"
          >
            <b-form-input
              id="hacienda-cfec"
              v-model="hacienda.cfec"
              name="hacienda-cfec"
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
  </validation-observer>
</template>
<script>
import {
  BFormInput,
  BFormGroup,
  BRow,
  BCol,
  BFormFile,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import { isEqual } from 'lodash'

export default {
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BFormFile,
  },
  props: {
    currentStep: { type: Object, default: () => {} },
  },
  data() {
    return {
      hacienda: {
        username: '',
        password: '',
        pin: '',
        key: null,
        cfe: 0,
        cte: 0,
        cnc: 0,
        cnd: 0,
        ccce: 0,
        ccpce: 0,
        crce: 0,
        cfec: 0,
      },
      haciendaEmpty: {
        username: '',
        password: '',
        pin: '',
        key: null,
        cfe: 0,
        cte: 0,
        cnc: 0,
        cnd: 0,
        ccce: 0,
        ccpce: 0,
        crce: 0,
        cfec: 0,
      },
      required: false,
    }
  },
  computed: {
    ...mapState({
      identificationTypes: state => state.app.identificationTypes,
      provinces: state => state.app.initData.provinces,
      cantons: state => state.app.cantons,
      districts: state => state.app.districts,
      barrios: state => state.app.barrios,
    }),
  },
  watch: {
    hacienda: {
      handler() {
        if (!isEqual(this.hacienda, this.haciendaEmpty)) {
          this.required = true
          this.$refs.haciendaValidation.validate().then(valid => {
            if (valid && this.hacienda.key) {
              this.$store.commit('app/SET_REGISTER', { hacienda: this.hacienda, haciendaRequired: true })
              this.$emit('can-continue', { value: true })
            } else {
              this.$emit('can-continue', { value: false })
            }
          })
        } else {
          this.required = false
          this.$store.commit('app/SET_REGISTER', { hacienda: this.hacienda, haciendaRequired: false })
          this.$emit('can-continue', { value: true })
        }
      },
      deep: true,
    },
    currentStep(val) {
      if (val.name === 'three') {
        if (!isEqual(this.hacienda, this.haciendaEmpty)) {
          this.$emit('can-continue', { value: false })
        } else {
          this.$emit('can-continue', { value: true })
        }
      }
    },
  },
  methods: {
    async onChangeFile(e) {
      const file = e.target.files[0]
      this.hacienda.key = file
    },
  },
}
</script>

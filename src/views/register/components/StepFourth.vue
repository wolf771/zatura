<template>
  <b-row class="p-md-5 justify-content-center">
    <b-col
      md="6"
      sm="12"
    >
      <validation-observer ref="emailDataValidation">
        <b-form-group
          class="text-center"
          label-for="customEmailConfigCb"
        >
          <div class="d-flex "><label class="mr-2">¿Desea usar una configuración de correo electrónico personalizada?</label>
            <validation-provider name="¿Desea usar una configuración de correo electrónico personalizada?">
              <b-form-checkbox
                id="customEmailConfigCb"
                v-model="customEmailConfigCb"
                name="customEmailConfigCb"
              />
            </validation-provider></div>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>
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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>
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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

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
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

      </validation-observer>
    </b-col>
  </b-row>
</template>
<script>
import {
  BFormInput, BFormGroup, BRow, BCol, BFormCheckbox,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { setTimeout } from 'timers'

export default {
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BFormCheckbox,
  },
  props: {
    currentStep: { type: Object, default: () => {} },
  },
  data() {
    return {
      emailData: {
        username: '',
        fromEmail: '',
        password: '',
        fromName: '',
        host: '',
        port: '',
        protocol: '',
        encryption: '',
      },
      customEmailConfigCb: false,
    }
  },
  watch: {
    emailData: {
      handler() {
        this.$refs.emailDataValidation.validate().then(valid => {
          if (valid) {
            this.$store.commit('app/SET_REGISTER', { emailData: this.emailData, customEmailConfig: this.customEmailConfigCb })
            this.$emit('can-continue', { value: true })
          } else {
            this.$emit('can-continue', { value: false })
          }
        })
      },
      deep: true,
    },
    customEmailConfigCb: {
      handler(val) {
        this.$refs.emailDataValidation.reset()
        if (val) {
          setTimeout(() => {
            this.$emit('can-continue', { value: false })
          }, 1)
        } else {
          this.$store.commit('app/SET_REGISTER', { customEmailConfig: false })
          setTimeout(() => {
            this.$emit('can-continue', { value: true })
          }, 1)
        }
      },
      deep: true,
    },
    currentStep(val) {
      if (val.name === 'fourth') this.$emit('can-continue', { value: true })
    },
  },
  mounted() {
    setTimeout(() => {
      this.$emit('can-continue', { value: true })
    }, 1)
  },
}
</script>

<template>
  <b-row class="p-md-5 justify-content-center">
    <b-col
      md="6"
      sm="12"
    >
      <validation-observer ref="userValidation">
        <b-form-group
          label="Nombre y apellido"
          label-for="user-name"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Nombre y apellido"
            rules="required"
          >
            <b-form-input
              id="user-name"
              v-model="user.name"
              name="user-name"
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
          label="Email"
          label-for="login-email"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Email"
            rules="required|email"
          >
            <b-form-input
              id="user-email"
              v-model="user.email"
              name="user-email"
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
          label-for="login-password"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Contraseña"
            rules="required"
          >
            <b-form-input
              id="user-password"
              v-model="user.password"
              name="user-password"
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
      </validation-observer>
    </b-col>
  </b-row>
</template>
<script>
import {
  BFormInput, BFormGroup, BRow, BCol,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    currentStep: { type: Object, default: () => {} },
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
      },
    }
  },
  watch: {
    user: {
      handler() {
        this.$refs.userValidation.validate().then(valid => {
          if (valid) {
            this.$store.commit('app/SET_REGISTER', { user: this.user })
            this.$emit('can-continue', { value: true })
          } else {
            this.$emit('can-continue', { value: false })
          }
        })
      },
      deep: true,
    },
    currentStep(val) {
      if (val.name === 'first') this.$emit('can-continue', { value: true })
    },
  },
  mounted() {
  },
}
</script>

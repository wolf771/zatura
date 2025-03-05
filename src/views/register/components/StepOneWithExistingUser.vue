<template>
  <b-row class="p-md-5 justify-content-center">
    <b-col
      md="6"
      sm="12"
    >
      <validation-observer ref="userValidation">
        <b-form-group
          label="¿Desea agregar usuario existente?"
          label-for="existingUserCb"
        >
          <validation-provider name="¿Desea agregar usuario existente?">
            <b-form-checkbox
              id="existingUserCb"
              v-model="existingUserCb"
              name="existingUserCb"
            />
          </validation-provider>
        </b-form-group>

        <b-form-group
          label="Usuario"
          label-for="user-id"
          :class="!existingUserCb ? 'd-none' : ''"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Usuario"
            :rules="`${!existingUserCb ? '' : 'required'}`"
          >

            <v-select
              id="user-id"
              v-model="user.id"
              :options="users"
              :reduce="user => user.id"
              label="name"
              searchable
            >
              <div slot="no-options">
                No se encontraron usuarios
              </div>
            </v-select>
            <small
              v-show="errors[0] && touched"
              class="text-danger"
            >{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>

        <b-form-group
          v-if="!existingUserCb"
          label="Nombre y apellido"
          label-for="user-name"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Nombre y apellido"
            :rules="`${existingUserCb ? '' : 'required'}`"
          >
            <b-form-input
              id="user-name"
              v-model="user.name"
              name="user-name"
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
          v-if="!existingUserCb"
          label="Email"
          label-for="login-email"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Email"
            :rules="`${existingUserCb ? '' : 'required|email'}`"
          >
            <b-form-input
              id="user-email"
              v-model="user.email"
              name="user-email"
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
          v-if="!existingUserCb"
          label="Contraseña"
          label-for="login-password"
        >
          <validation-provider
            #default="{ errors, touched }"
            name="Contraseña"
            :rules="`${existingUserCb ? '' : 'required'}`"
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
            >
              {{
                errors[0]
              }}
            </small>
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
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import store from '@/store'

export default {
  components: {
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    BFormCheckbox,
    ValidationObserver,
    ValidationProvider,
    vSelect,
  },
  props: {
    currentStep: { type: Object, default: () => {} },
  },
  data() {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
      },
      existingUserCb: false,
      componentKey: 0,
      emptyUser: {
        id: '',
        name: '',
        email: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapState({
      users: state => state.app.users,
    }),
  },
  watch: {
    user: {
      handler() {
        this.$refs.userValidation.validate().then(valid => {
          if (valid) {
            this.$store.commit('app/SET_REGISTER', { user: this.user, existingUser: this.existingUserCb })
            this.$emit('can-continue', { value: true })
          } else {
            this.$emit('can-continue', { value: false })
          }
        })
      },
      deep: true,
    },
    existingUserCb: {
      handler() {
        this.$refs.userValidation.reset()
        this.user = { ...this.emptyUser }
        setTimeout(() => {
          this.$emit('can-continue', { value: false })
        }, 1)
      },
      deep: true,
    },
    currentStep(val) {
      if (val.name === 'first') this.$emit('can-continue', { value: true })
    },
  },
  mounted() {
    store.dispatch('app/getUsers')
  },
  methods: {
    forceRerender() {
      this.componentKey += 1
    },
    getOptionKey(option) {
      if (typeof option === 'object' && option.id) {
        return option.id
      }
      try {
        return JSON.stringify(option)
      } catch (e) {
        return console.warn(
          '[vue-select warn]: Could not stringify option '
          + 'to generate unique key. Please provide \'getOptionKey\' prop '
          + 'to return a unique key for each option.\n'
          + 'https://vue-select.org/api/props.html#getoptionkey',
        )
      }
    },
    getOptionLabel(option) {
      if (typeof option === 'object') {
        if (Object.prototype.hasOwnProperty.call(option, 'name')) {
          return console.warn(
            '[vue-select warn]: Label key "option.name" does not'
          + ` exist in options object ${JSON.stringify(option)}.\n`
          + 'https://vue-select.org/api/props.html#getoptionlabel',
          )
        }
        return option.name
      }
      return option
    },
  },
}
</script>

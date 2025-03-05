<template>
  <div>
    <div v-if="!completed">
      <div
        :class="!isSideView ? 'pt-5' : ''"
        class="text-center"
      >
        <b-link
          v-if="!isSideView"
          :to="{ name: 'login' }"
        >
          <img
            style="width: 120px"
            src="@/assets/images/logo/logo.png"
            alt
          >
        </b-link>

        <h2
          v-if="!isSideView"
          class="text-center pt-3 w-100"
        >
          Regístrate
        </h2>
        <h2
          v-if="isSideView"
          class="text-center pt-1 w-100"
        >
          Registrar nueva empresa
        </h2>
      </div>

      <div :class="!isSideView ? 'p-3' : '' ">
        <b-row :class="isSideView ? 'justify-content-center align-items-center no-gutters' :'' ">
          <b-col
            md="6"
            :offset-md="!isSideView ? 3 : 0"
            :class="isSideView ? 'col-xl-12 col-md-12' : ''"
          >
            <horizontal-stepper
              ref="horizontalStepper"
              :steps="demoSteps"
              locale="es"
              @completed-step="completeStep"
              @active-step="isStepActive"
              @stepper-finished="alert"
              @clicking-back="backStep"
            />
          </b-col>
        </b-row>
      </div>
    </div>
    <div v-if="completed">
      <b-row class="no-gutters justify-contente-center align-items-center">
        <b-col
          class="form-completed-container d-flex justify-contente-center align-items-center flex-column"
          md="12"
        >
          <img src="@/assets/images/pages/completed.png">
          <h4>¡La compañía se ha registrado con éxito!</h4>
          <button
            class="btn btn-primary collapsed mt-2"
            @click="callOnComplete"
          >Volver a mis compañías</button>
        </b-col>
      </b-row>
    </div>
    <div v-if="registerLoading">
      <b-row class="no-gutters justify-contente-center align-items-center">
        <b-col
          class="form-completed-container d-flex justify-contente-center align-items-center flex-column"
          md="12"
        >
          <b-spinner
            large
            variant="primary"
            label="Spinning"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import HorizontalStepper from 'vue-stepper'

// This components will have the content for each stepper step.
import {
  BRow, BCol, BLink, BSpinner,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import StepOne from './components/StepOne.vue'
import StepTwo from './components/StepTwo.vue'
import StepThree from './components/StepThree.vue'
import StepFourth from './components/StepFourth.vue'
import StepOneWithExistingUserVue from './components/StepOneWithExistingUser.vue'
import { generateFormData, handleErrors } from '../../helpers/utils'

export default {
  components: {
    HorizontalStepper,
    BRow,
    BCol,
    BLink,
    BSpinner,
  },
  props: {
    isSideView: Boolean,
    onComplete: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      demoSteps: this.isSideView
        ? [
          {
            icon: 'person',
            name: 'first',
            title: 'Crear usuario',
            component: StepOneWithExistingUserVue,
            completed: false,
          },
          {
            icon: 'store',
            name: 'two',
            title: 'Datos compañia',
            component: StepTwo,
            completed: false,
          },
          {
            icon: 'settings',
            name: 'three',
            title: 'Datos hacienda (Opcional)',
            component: StepThree,
            completed: false,
          },
          {
            icon: 'email',
            name: 'fourth',
            title: 'Configuración de correo electrónico',
            component: StepFourth,
            completed: false,
          },
        ]
        : [
          {
            icon: 'person',
            name: 'first',
            title: 'Crear usuario',
            component: StepOne,
            completed: false,
          },
          {
            icon: 'store',
            name: 'two',
            title: 'Datos compañia',
            component: StepTwo,
            completed: false,
          },
          {
            icon: 'settings',
            name: 'three',
            title: 'Datos hacienda (Opcional)',
            component: StepThree,
            completed: false,
          },
        ],
      completed: false,
      submit: false,
    }
  },
  computed: {
    ...mapState({
      register: state => state.app.register,
      registerLoading: state => state.app.registerLoading,
      user: state => state.auth.user,
      provinces: state => state.app.initData.provinces,
      cantons: state => state.app.cantons,
      districts: state => state.app.districts,
    }),
  },
  methods: {
    backStep() {
    },
    // Executed when @completed-step event is triggered
    completeStep(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          // eslint-disable-next-line no-param-reassign
          step.completed = true
        }
      })
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            // eslint-disable-next-line no-param-reassign
            step.completed = false
          }
          if (step.name === 'three') {
            try {
              setTimeout(() => {
                this.$refs.horizontalStepper.canContinue = true
              }, 10)
            // eslint-disable-next-line no-empty
            } catch (e) {
            }
          }
        }
      })
    },
    // Executed when @stepper-finished event is triggered
    alert() {
      const register = { ...this.register }
      if (!this.submit) {
        const companyCanton = this.cantons.find(
          canton => canton.number === register.company.canton,
        )
        if (companyCanton) {
          register.company.canton = companyCanton.id
        }
        const companyDistrict = this.districts.find(
          district => district.number === register.company.district,
        )
        if (companyDistrict) {
          register.company.district = companyDistrict.id
        }
      }
      this.submit = true
      const data = {
        ...register,
        llave_criptografica: this.register.haciendaRequired
          ? this.register.hacienda.key
          : '',
        haciendaRequired: this.register.haciendaRequired,
        existingUser: this.register.existingUser,
        customEmailConfig: this.register.customEmailConfig,
        emailStepRequired: !!this.isSideView,
        userId: !this.isSideView ? false : this.user.id,
      }
      const formData = generateFormData(data)
      this.$store
        .dispatch('app/register', formData)
        .then(async () => {
          if (!this.isSideView) {
            await this.$store.dispatch('auth/login', {
              email: this.register.user.email,
              password: this.register.user.password,
            })
            this.$router.push({ name: 'home' })
          } else {
            this.completed = true
          }
        })
        .catch(e => {
          handleErrors(e)
          this.$refs.horizontalStepper.canContinue = true
        })
    },
    callOnComplete() {
      this.$emit('onComplete')
    },
  },
}
</script>

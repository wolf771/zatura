<template>
 <div class="bg-login-new h-screen flex w-full bg-img" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img height="200px" src="@/assets/logo.png" alt="logo" class="mx-auto">
                        </div>
                        <div element-loading-text="Procesando..." v-loading="loading" class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="p-8">
                              <form @submit.prevent="passwordReset()">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Cambiar Contraseña</h4>
                                    <p>Recupera tu contraseña.</p>
                                </div>
                                <vs-input
                                    v-validate="'required|email|min:3'"
                                    data-vv-validate-on="blur"
                                    name="email"
                                    icon="icon icon-user"
                                    icon-pack="feather"
                                    label-placeholder="Email"
                                    v-model="email"
                                    class="w-full no-icon-border"/>
                                <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                                <vs-input
                                    data-vv-validate-on="blur"
                                    v-validate="'required|min:6|max:30'"
                                    type="password"
                                    name="password"
                                    icon="icon icon-lock"
                                    icon-pack="feather"
                                    label-placeholder="Nueva contraseña"
                                    v-model="password"
                                    class="w-full mt-6 no-icon-border" ref="password"/>
                                <span class="text-danger text-sm">{{ errors.first('password') }}</span>


                                <vs-input
                                  data-vv-validate-on="blur"
                                  v-validate="'required|min:6|max:30|confirmed:password'"
                                  type="password"
                                  name="password_confirmed"
                                  icon="icon icon-lock"
                                  icon-pack="feather"
                                  label-placeholder="Confirmar contraseña"
                                  v-model="password_confirmed"
                                  class="w-full mt-6 no-icon-border" data-vv-as="password"/>
                                <span class="text-danger text-sm">{{ errors.first('password_confirmed') }}</span>

                                <div class="flex flex-wrap justify-between my-5">
                                    <!-- <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox> -->
                                    <!-- <router-link to="/pages/forgot-password">Forgot Password?</router-link> -->
                                </div>
                                <!-- <vs-button  type="border" @click="registerUser">Register</vs-button> -->
                                <div style="text-align: center;">
                                    <vs-button :disabled="!isCompleted">Cambiar Contraseña</vs-button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>


 </template>

<script>
import userService from '@/services/user.service'

export default {
  name: 'password_reset',
  data() {
    return {
      email: "",
      password: "",
      password_confirmed: "",
      loading: false
    }
  },
  computed: {
    isCompleted:  function() {
      return this.password && this.email;
    },
    token() {
      return this.$route.params.token;
    }
  },
  methods: {
    passwordReset() {
      this.$validator.validate().then(valid => {
      if (valid) {
      this.loading = true;
        userService.passwordReset(this.email, this.password, this.token)
        .then((res) => {
          if(res.data.success) {
            /*this.$notify({
              type: 'success',
              title: "Tu contraseña se cambio correctamente, ya puedes iniciar sesion con tu correo y nueva clave."
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: "Tu contraseña se cambio correctamente, ya puedes iniciar sesion con tu correo y nueva clave.",
              type: 'success'
            });
            this.$router.push({name: 'login'})
          } else {
            /*this.$notify({
              type: 'error',
              title: "No se logro cambiar tu contraseña."
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: "No se logro cambiar tu contraseña.",
              type: 'error'
            });
          }
          this.loading = false;
        })
        .catch(() => {
          /*this.$notify({
            type: 'error',
            title: "No se logro cambiar tu contraseña."
          });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "No se logro cambiar tu contraseña.",
            type: 'error'
          });
          this.loading = false;
        });
      }
      })
    }
    
  },
  mounted() {
    let session = localStorage.getItem('token')
    if(session) {
      this.$router.push({name: 'dashboard'})
    }
  }
    
}
</script>

<style scoped>
  .bg-login-new{
    display: flex;
    align-items: center;
    background-image: url('../assets/fondologin.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
  }
  .container-logo {
    text-align: center;
  }
  .container-logo .logo {
    width: 120px;
  }
</style>

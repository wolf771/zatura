<template>
  <div class="bg-login-new h-screen flex w-full bg-img" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div
              class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center"
            >
              <img
                height="200px"
                src="@/assets/logo.png"
                alt="login"
                class="mx-auto"
              />
            </div>
            <div
              id="login-loading"
              class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg"
            >
              <div class="p-8">
                <form @submit.prevent="login()">
                  <div class="vx-card__title mb-8">
                    <h4 class="mb-4">Login</h4>
                    <p>Bienvenido, por favor ingresa a tu cuenta</p>
                  </div>
                  <vs-input
                    v-validate="'required|email|min:4'"
                    data-vv-validate-on="blur"
                    name="email"
                    icon="icon icon-user"
                    icon-pack="feather"
                    label-placeholder="Email"
                    v-model="email"
                    class="w-full no-icon-border"
                  />
                  <span class="text-danger text-sm">{{
                    errors.first("email")
                  }}</span>

                  <vs-input
                    data-vv-validate-on="blur"
                    v-validate="'required|min:6|max:30'"
                    type="password"
                    name="password"
                    icon="icon icon-lock"
                    icon-pack="feather"
                    label-placeholder="clave"
                    v-model="password"
                    class="w-full mt-6 no-icon-border"
                  />
                  <span class="text-danger text-sm">{{
                    errors.first("password")
                  }}</span>

                  <div class="flex flex-wrap justify-end my-5">
                    <!-- <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox> -->
                    <router-link to="/password/email"
                      >¿Olvidaste tu contraseña?</router-link
                    >
                  </div>
                  <!-- <vs-button  type="border" @click="registerUser">Register</vs-button> -->
                  <div style="text-align: center;">
                    <vs-button button="submit" :disabled="!isCompleted">
                      <i class="fa fa-sign-in-alt"></i>
                      Entrar
                    </vs-button>
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
import userService from "@/services/user.service";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  computed: {
    isCompleted: function() {
      return this.password && this.email;
    }
  },
  methods: {
    login() {
      this.$vs.loading({
        color: "rgb(118, 0, 228)",
        container: "#login-loading",
        scale: 1,
        type: "material",
        text: "Iniciando sesión"
      });

      userService
        .authenticate(this.email, this.password)
        .then(user => {
          this.$vs.loading.close("#login-loading > .con-vs-loading");
          localStorage.setItem("user", JSON.stringify(user.data.user));
          localStorage.setItem("token", user.data.user.token);
          this.$store.commit("updateToken", { token: user.data.user.token });
          this.$store.commit("updateUser", { user: user.data.user });

          this.$store.dispatch("getUser", user.data.user.token).then(res => {
            let currency = JSON.parse(
              res.company_default.general_configurations.currency
            );
            this.$CurrencyFilter.setConfig({
              symbol: currency.symbol,
              thousandsSeparator: ".",
              fractionCount: 2,
              fractionSeparator: ",",
              symbolPosition: "front",
              symbolSpacing: false
            });

            this.$store.commit("updateCompanyDefault", {
              company_default: res.company_default
            });
            this.$store.commit("updateGeneralConfigurations", {
              general_configurations: res.company_default.general_configurations
            });
            this.$store.commit("updateCurrentCurrency", {
              current_currency: currency
            });
            localStorage.setItem(
              "company_default",
              JSON.stringify(res.company_default)
            );

            setTimeout(() => {
              this.loading = false;
              this.$router.push({ name: "dashboard" });
            }, 500);
          });
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error.response.data.error,
            type: "error"
          });
          this.$vs.loading.close("#login-loading > .con-vs-loading");
        });
    }
  },
  mounted() {
    let session = localStorage.getItem("token");
    if (session) {
      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>

<style scoped>
.bg-login-new {
  display: flex;
  align-items: center;
  background-image: url("../../assets/fondologin.jpg");
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

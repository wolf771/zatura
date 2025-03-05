<template>
  <div class="row">
    <div
      class="col-md-12"
      v-loading="loading"
      element-loading-text="Guardando datos..."
    >
      <form @submit.prevent="store()" enctype="multipart/form-data">
        <div class="row">
          <div class="col-md-12">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Configuraciones servidor de email</h4>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Protocolo</label>
                      <el-select
                        placeholder=""
                        v-model="email.email_protocol"
                        value-key="id"
                        name="protocol"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="protocol in email_protocols"
                          :key="protocol.id"
                          :label="protocol.name"
                          :value="protocol"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('protocol')" class="error">
                        {{ errors.first("protocol") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Cifrado</label>
                      <el-input
                        v-model="email.encryption"
                        name="encryption"
                        class="form-control"
                      />
                      <label v-show="errors.has('encryption')" class="error">
                        {{ errors.first("encryption") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Host</label>
                      <el-input
                        v-model="email.host"
                        v-validate="'required'"
                        name="host"
                        class="form-control"
                      />
                      <label v-show="errors.has('host')" class="error">
                        {{ errors.first("host") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Puerto</label>
                      <el-input
                        v-model="email.port"
                        v-validate="'required'"
                        name="port"
                        class="form-control"
                      />
                      <label v-show="errors.has('port')" class="error">
                        {{ errors.first("port") }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Username</label>
                      <el-input
                        v-model="email.username"
                        v-validate="'required'"
                        name="username"
                        class="form-control"
                      />
                      <label v-show="errors.has('username')" class="error">
                        {{ errors.first("username") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Password</label>
                      <el-input
                        v-model="email.password"
                        v-validate="'required'"
                        name="password"
                        class="form-control"
                        show-password
                      />
                      <label v-show="errors.has('password')" class="error">
                        {{ errors.first("password") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>De la dirección</label>
                      <el-input
                        v-model="email.from_email"
                        v-validate="'required'"
                        name="from_email"
                        class="form-control"
                      />
                      <label v-show="errors.has('from_email')" class="error">
                        {{ errors.first("from_email") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>De nombre</label>
                      <el-input
                        v-model="email.from_name"
                        v-validate="'required'"
                        name="from_name"
                        class="from-control"
                      />
                      <label v-show="errors.has('from_name')" class="error">
                        {{ errors.first("from_name") }}
                      </label>
                    </div>
                  </div>

                  <div class="col-md-12 text-center mt-5">
                    <vs-button type="gradient" button="submit">
                      <i class="fa fa-save"></i>
                      Guardar
                    </vs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import configurationsService from "@/services/configurations.service";
import utilitiesService from "@/services/utilities.service";

import { mapState, mapActions } from "vuex";
export default {
  name: "config-email",
  data() {
    return {
      email: {
        id: "",
        company_id: "",
        email_protocol: "",
        encryption: "",
        host: "",
        port: "",
        username: "",
        password: "",
        from_email: "",
        from_name: ""
      },
      email_protocols: [],
      loading: false
    };
  },
  computed: {},
  methods: {
    store() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.email.company_id = this.$route.params.company_id;
          this.loading = true;
          if (this.email.id != null) {
            configurationsService
              .updateConfigurationEmail(this.email)
              .then(res => {
                /*this.$notify({
                      title: res.data.message,
                      type: 'success'
                    })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success"
                });
                this.loading = false;
                //this.$router.push({name: 'companies'})
              })
              .catch(error => {
                /*this.$notify({
                      title: error.message,
                      type: 'error'
                    })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.loading = false;
              });
          } else {
            configurationsService
              .storeConfigurationEmail(this.email)
              .then(res => {
                /*this.$notify({
                      title: res.data.message,
                      type: 'success'
                    })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success"
                });
                this.loading = false;
                //this.$router.push({name: 'companies'})
              })
              .catch(error => {
                /*this.$notify({
                      title: error.message,
                      type: 'error'
                    })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.loading = false;
              });
          }
        } else {
          /*this.$notify({
            title: 'Faltan datos',
            type: 'error'
          })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "Faltan datos",
            type: "error"
          });
          this.loading = false;
        }
      });
    },
    getConfigurationEmail() {
      configurationsService
        .getConfigurationEmail(this.$route.params.company_id)
        .then(res => {
          this.email = res.data;
        })
        .catch(error => {
          /*this.$notify({
          title: error.message,
          type: 'error'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: error.message,
            type: "error"
          });
        });
    },
    getEmailProtocols() {
      utilitiesService
        .getEmailProtocols()
        .then(res => {
          this.email_protocols = res.data;
        })
        .catch(error => {
          /*this.$notify({
          title: error.message,
          type: 'error'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: error.message,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getConfigurationEmail();
    this.getEmailProtocols();
  }
};
</script>

<style scoped></style>

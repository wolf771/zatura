<template>
<div class="row">
  <div class="col-md-12 px-10 py-5 text-right">
    <div class="text-left">
      <span v-loading="loading_test" element-loading-text="Comprobando..."></span>
    </div>
    <vs-button @click.prevent="testCryptographyKey()" class="mr-5">
      <i class="fa fa-key"></i>
      Probar Llave y PIN
    </vs-button>
    <vs-button @click.prevent="testAccessHacienda()">
      <i class="fa fa-wifi"></i>
      Probar Acceso Hacienda
    </vs-button>
  </div>
  <div class="col-md-12">
    <form @submit.prevent="store()" enctype="multipart/form-data">
      <div class="row">
          <div class="col-md-6">
            <div class="card vx-card">
              <div class="card-header card-header-success card-header-icon">
                <div class="card-icon">
                  <i class="material-icons">more_horiz</i>
                </div>
                <h4 class="card-title">Consecutivos</h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>Consecutivo actual FACTURAS</label>
                  <el-input-number v-model="config.cfe" v-validate="'required'" name="cfe" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('cfe')" class="error">
                    {{ errors.first('cfe') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual NOTAS DE CREDITO</label>
                  <el-input-number v-model="config.cnc" v-validate="'required'" name="cnc" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('cnc')" class="error">
                    {{ errors.first('cnc') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual NOTAS DE DEBITO</label>
                  <el-input-number v-model="config.cnd" v-validate="'required'" name="cnd" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('cnd')" class="error">
                    {{ errors.first('cnd') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual TIQUTES ELECTRONICOS</label>
                  <el-input-number v-model="config.cte" v-validate="'required'" name="cte" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('cte')" class="error">
                    {{ errors.first('cte') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual DOCUMENTOS ACEPTADOS</label>
                  <el-input-number v-model="config.ccce" v-validate="'required'" name="ccce" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('ccce')" class="error">
                    {{ errors.first('ccce') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual DOCUMENTOS PARCIALMENTE ACEPTADOS</label>
                  <el-input-number v-model="config.ccpce" v-validate="'required'" name="ccpce" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('ccpce')" class="error">
                    {{ errors.first('ccpce') }}
                  </label>
                </div>

                 <div class="form-group">
                  <label>Consecutivo actual DOCUMENTOS RECHAZADOS</label>
                  <el-input-number v-model="config.crce" v-validate="'required'" name="crce" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('crce')" class="error">
                    {{ errors.first('crce') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Consecutivo actual FEC (Simplificado)</label>
                  <el-input-number v-model="config.fec" v-validate="'required'" name="crce" :min="0" :max="9999999999" class="form-control" :controls="false"></el-input-number>
                  <label v-show="errors.has('crce')" class="error">
                    {{ errors.first('crce') }}
                  </label>
                </div>

              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card">
              <div class="card-header card-header-success card-header-icon">
                <div class="card-icon">
                  <i class="material-icons">lock</i>
                </div>
                <h4 class="card-title">Datos Acceso</h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>Usuario acceso</label>
                  <el-input v-model="config.username" v-validate="'required'" name="username" />
                  <label v-show="errors.has('username')" class="error">
                    {{ errors.first('username') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Clave acceso</label>
                  <el-input v-model="config.password" v-validate="'required'" name="password" />
                  <label v-show="errors.has('password')" class="error">
                    {{ errors.first('password') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>PIN llave criptografica</label>
                  <el-input v-model="config.pin" v-validate="'required'" name="pin" />
                  <label v-show="errors.has('pin')" class="error">
                    {{ errors.first('pin') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Email recibir notificaciones de rechazo</label>
                  <el-input v-model="config.email_rejection" name="email_rejection"/>
                  <label v-show="errors.has('email_rejection')" class="error">
                    {{ errors.first('email_rejection') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Archivo llave criptografica</label>
                  <el-upload
                    action="#"
                    :on-change="fileSelect"
                    v-model="config.file_key" name="file_key"
                    class="upload-demo"
                    ref="file_key"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                    <div slot="tip" >Solo archivos .p12</div>
                  </el-upload>
                  <label v-show="errors.has('file_key')" class="error">
                    {{ errors.first('file_key') }}
                  </label>
                </div>

                 <div class="form-group">
                  <label>Modo</label>
                  <el-switch
                    v-model="config.test"
                    name="test"
                    active-text="En pruebas"
                    inactive-text="En producción">
                  </el-switch>
                  <label v-show="errors.has('test')" class="error">
                    {{ errors.first('test') }}
                  </label>
                </div>

              </div>
            </div>
          </div>
               
          <div class="col-md-12 text-center">
            <button type="submit" class="btn btn-lg btn-success">
              <i class="fa fa-save"></i>
              Guardar
            </button>
          </div>

        </div>
    </form>
  </div>
</div>
</template>

<script>
import configurationService from '../../services/configurations.service';
export default {
  data() {
    return {
      config: {
        company_id: "",
        cfe: 0,
        cnc: 0,
        cnd: 0,
        cte: 0,
        ccce: 0,
        ccpce: 0,
        crce: 0,
        fec: 0,
        username: "",
        password: "",
        pin: "",
        email_rejection: "",
        file_key: "",
        test: true
      },
      loading_test: false
    }
  },
  methods: {
    testCryptographyKey() {
      this.loading_test = true
      let company_id = this.$route.params.company_id;
      configurationService.testCryptographyKey(company_id)
      .then(res => {
        /*this.$notify({
          type: 'info',
          title: res.data
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: res.data,
          type: 'info'
        });
        this.loading_test = false
      })
      .catch(() => {
        /*this.$notify({
          title: 'No se logro probar la llave',
          type: 'error'
        });*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: 'No se logro probar la llave',
          type: 'error'
        });
        this.loading_test = false
      })
    },
    testAccessHacienda() {
      this.loading_test = true
      let company_id = this.$route.params.company_id;
      configurationService.testAccessHacienda(company_id)
      .then(res => {
        if(res.data.token) {
            /*this.$notify({
            type: 'info',
            title: 'Hacceso a hacienda correcto'
          })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'Hacceso a hacienda correcto',
            type: 'info'
          });
        } else {
          /*this.$notify({
            title: 'Acceso negado a hacienda',
            type: 'error'
          });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'Acceso negado a hacienda',
            type: 'error'
          });
        }
        this.loading_test = false
      })
      .catch(() => {
        /*this.$notify({
          title: 'No se logro probar el acceso',
          type: 'error'
        });*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: 'No se logro probar el acceso',
          type: 'error'
        });
        this.loading_test = false
      })
    },
    store() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.config.company_id = this.$route.params.company_id;
          let formData = new FormData();
          Object.keys(this.config).forEach(key => formData.append(key, this.config[key]));
          configurationService.storeConfiguration(formData)
          .then(res => {
            //this.$snotify.success('Configuración guardada correctamente');
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Configuración guardada correctamente',
              type: 'success'
            });
            this.$router.push({name: 'companies'})
          })
          .catch(() => {
            alert('error')
          })
        } else {
         /*this.$notify({
              title: 'faltan datos',
              type: 'error'
            });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'faltan datos',
            type: 'error'
          });
        }
      });  
    },
    fileSelect(file) {
      this.config.file_key = file.raw;
    },
    getConfiguration() {
      let company_id = this.$route.params.company_id;
      configurationService.getConfigurations(company_id)
      .then(res => {
        if(res.data.configurations) {
          this.config =  res.data.configurations;
          this.config.test =  this.config.test == 1 ? true : false;
        }
      })
      .catch(() => {
        alert('error')
      });
    }
  },
  created() {
    this.getConfiguration();
  }
}
</script>

<style scoped>
  .el-input-number {
    width: 100% !important;
  }
  .el-input-number .el-input__inner {
    text-align: left !important;
  }
  .el-switch {
    display: block;
  }
</style>

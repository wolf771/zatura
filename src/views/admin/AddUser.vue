<template>
  <div class="row">
    <div class="col-md-12">
      <form @submit.prevent="storeUser()">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Nuevo Usuario</h4>
              </div>

              <div class="card-body">
                <div>
                  <label>Nombre</label>
                  <el-input name="name" v-model="user.name" v-validate="'required'"></el-input>
                  <label v-show="errors.has('name')" class="error">
                    {{ errors.first('name') }}
                  </label>
                </div>

                <div>
                  <label>Correo</label>
                  <el-input name="email" v-model="user.email" v-validate="'required'"></el-input>
                  <label v-show="errors.has('email')" class="error">
                    {{ errors.first('email') }}
                  </label>
                </div>

                <div>
                  <label>Clave</label>
                  <el-input name="password" v-model="user.password" v-validate="'required'"></el-input>
                  <label v-show="errors.has('password')" class="error">
                    {{ errors.first('password') }}
                  </label>
                </div>

                <div class="text-center mt-">
                  <button class="btn btn-success">
                    <i class="fa fa-save"></i>
                    Guardar
                  </button>
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
import userService from '@/services/user.service'

export default {
  name: 'add-user',
  data() {
    return {
      loading: false,
      user: {
        name: "",
        email: "",
        password: ""
      }
    }
  },
  methods: {
    storeUser() {
      this.$validator.validate().then(valid => {
        if (valid) {
          userService.storeUser(this.user)
          .then(res => {
            if(res.data.success) {
              /*this.$notify({
                type: 'success',
                title: res.data.message
              })*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              });
            } else {              
              /*this.$notify({
                type: 'error',
                title: res.data.message
              })*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
            this.$router.push({name: 'users'})
          })
          .catch(error => {
            /*this.$notify({
              type: 'error',
              title: res.data.message
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          })
        }
      })
    }
  }
}
</script>

<style>

</style>

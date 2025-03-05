<template>
  <div class="row">
    <div class="col-md-12">
      <form @submit.prevent="assignCompany()">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Asignar compañia a usuario</h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>Seleccionar Usuario</label>
                  <el-select @change="getAllCompanies()" placeholder="" v-model="assign.user" value-key="id" name="user" v-validate="'required'" filterable class="form-control">
                    <el-option
                      v-for="user in users"
                      :key="user.id"
                      :label="user.name"
                      :value="user">
                    </el-option>
                  </el-select>
                  <label v-show="errors.has('user')" class="error">
                    {{ errors.first('user') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>Seleccionar Compañia</label>
                  <el-select placeholder="" v-model="assign.company" value-key="id" name="company" v-validate="'required'" filterable class="form-control">
                    <el-option
                      v-for="company in companies"
                      :key="company.id"
                      :label="company.name"
                      :value="company">
                    </el-option>
                  </el-select>
                  <label v-show="errors.has('company')" class="error">
                    {{ errors.first('company') }}
                  </label>
                </div>

                <div class="text-center mt-">
                  <vs-button type="gradient" button="submit">
                    <i class="fa fa-save"></i>
                    Asignar
                  </vs-button>
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
import companiesService from '@/services/companies.service'


export default {
  name: 'assign-company',
  data() {
    return {
      loading: false,
      users: [],
      companies: [],
      assign: {
        user: "",
        company: "",
      }
    }
  },
  methods: {
    assignCompany() {
      this.$validator.validate().then(valid => {
        if (valid) {
          userService.assignUser(this.assign)
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
            this.$router.push({name: 'all-companies'})
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
    },
    getUsersAssignCompany(search = {}) {
      userService.getUsersAssignCompany(0, search)
      .then(res => {
        this.users = res.data.sort(function(a,b){
            return a.name.localeCompare(b.name);
        })
      })
    },
    getAllCompanies() {
      companiesService.getAllCompaniesNotAssignUser(this.assign.user.id)
      .then(res => {
        this.companies = res.data.sort(function(a,b){
            return a.name.localeCompare(b.name);
        })
      })
    }
  },
  created() {
    this.getUsersAssignCompany();
  }
}
</script>

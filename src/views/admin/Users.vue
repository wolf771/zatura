<template>
<div class="row">
  <div class="col-md-12">
    <div class="card vx-card">
      <div class="card-body" v-loading="loading">
        <div class="d-flex justify-content-between">
          <div>
            <registers-per-page @changeNumPerPage="changeNumPerPage"></registers-per-page>

            <!-- <h4 class="font-weight-bold">Lista de usuarios</h4> -->
            <search-filter @executeSearch="search" :options="[]"></search-filter>
          </div>
          <vs-button type="gradient" @click="newUser()">
            <i class="fa fa-user-plus"></i>
            Nuevo Usuario
          </vs-button>
        </div>

        <div id="data-list-list-view" class="data-list-container mt-5" v-if="users.length">

          <vs-table ref="table" :max-items="perPage" :data="users">
            <template slot="thead">
              <vs-th sort-key="name">Nombre</vs-th>
              <vs-th sort-key="email">Email</vs-th>
              <vs-th>Administrador</vs-th>
              <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
              <tbody>
                <vs-tr :data="item" :key="item.id" v-for="(item, indextr) in data">
                  <vs-td>{{ item.name }}</vs-td>
                  <vs-td>{{ item.email }}</vs-td>
                  <vs-td>{{ item.admin.name }}</vs-td>
                  <vs-td>
                    <el-dropdown @command="itemAction">
                     
                      <i class="fa fa-cogs text-primary"></i>

                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{action: 'edit', data: item}" class="text-success">
                          <i class="fa fa-edit"></i>
                          Editar
                        </el-dropdown-item>
                        <el-dropdown-item :command="{action: 'delete', id: item.id}" class="text-danger">
                          <i class="fa fa-times"></i>
                          Eliminar
                        </el-dropdown-item>
                        <el-dropdown-item :command="{action: 'companies', id: item.id}" class="text-primary">
                          <i class="fa fa-eye"></i>
                          Ver Compañias
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>
        </div>

        <div class="col-md-12 text-center" v-if="!loading && users.length == 0">
          <p>No hay usuarios.</p>
        </div>

      </div>
    </div>
  </div>

  <vs-popup :active.sync="new_user" title="Nuevo usuario">
    <form @submit.prevent="storeUser('new_user')" data-vv-scope="new_user">
      <div class="card vx-card">

        <div class="card-body">
          <div>
            <label>Nombre</label>
            <el-input name="name" v-model="user.name" v-validate="'required'"></el-input>
            <label v-show="errors.has('new_user.name')" class="error">
              {{ errors.first('new_user.name') }}
            </label>
          </div>

          <div>
            <label>Correo</label>
            <el-input name="email" v-model="user.email" v-validate="'required'"></el-input>
            <label v-show="errors.has('new_user.email')" class="error">
              {{ errors.first('new_user.email') }}
            </label>
          </div>

          <div>
            <label>Clave</label>
            <el-input name="password" v-model="user.password" v-validate="'required'"></el-input>
            <label v-show="errors.has('new_user.password')" class="error">
              {{ errors.first('new_user.password') }}
            </label>
          </div>

          <div class="text-center mt-2">
            <vs-button button="submit" type="gradient">
              <i class="fa fa-save"></i>
              Guardar
            </vs-button>
          </div>
        </div>
      </div>
    </form>
  </vs-popup>

  <vs-popup :active.sync="edit_user" title="Editar usuario">
    <form @submit.prevent="updateUser('edit_user')" data-vv-scope="edit_user">
      <div class="card vx-card">

        <div class="card-body">
          <div>
            <label>Nombre</label>
            <el-input name="name" v-model="user.name" v-validate="'required'"></el-input>
            <label v-show="errors.has('edit_user.name')" class="error">
              {{ errors.first('edit_user.name') }}
            </label>
          </div>

          <div class="mt-2">
            <label>Correo</label>
            <el-input name="email" v-model="user.email" v-validate="'required'"></el-input>
            <label v-show="errors.has('edit_user.email')" class="error">
              {{ errors.first('edit_user.email') }}
            </label>
          </div>

          <div class="mt-2">
            <label>Clave</label>
            <el-input name="password" v-model="user.password"></el-input>
          </div>

          <div class="text-center mt-2">
            <vs-button button="submit" type="gradient">
              <i class="fa fa-save"></i>
              Editar
            </vs-button>
          </div>
        </div>
      </div>
    </form>
  </vs-popup>

</div>
</template>

<script>
import userService from '@/services/user.service';
import SearchFilter from '@/components/SearchFilter.vue';
import RegistersPerPage from '@/components/RegistersPerPage';
import { mapState } from 'vuex'

export default {
  name: 'users',
  components: {
    SearchFilter,
    RegistersPerPage
  },
  data() {
    return {
      users: [],
      loading: true,
      pageCount : 1,
      searchData: {},
      perPage: 10,
      page: 1,

      new_user: false,
      edit_user: false,
      user: {
        name: "",
        email: "",
        password: ""
      }
    }
  },
  computed: {
    ...mapState([
      'datatable_current_page'
    ])
  },
  methods: {
    storeUser(scope) {
      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          userService.storeUser(this.user)
          .then(res => {
            if(res.data.success) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              });
              this.users.push(res.data.data)
              this.new_user = false
              this.user = JSON.parse(JSON.stringify(this.$options.data().user))
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
          })
          .catch(error => {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          })
        }
      })
    },
    updateUser(scope) {
      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          userService.updateUser(this.user)
          .then(res => {
            if(res.data.success) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              });
              const index = this.users.findIndex(i => i.id == res.data.data.id)
              this.users[index] = res.data.data
              this.users = JSON.parse(JSON.stringify(this.users))
              this.edit_user = false
              this.user = JSON.parse(JSON.stringify(this.$options.data().user))
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
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
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num
      this.searchData = searchData
      this.getUsers(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage
      this.getUsers(1, this.searchData);
    },
    getUsers(page = 1, search = {}) {
      userService.getUsers(page, search).then(res => {
        this.users = res.data.data
        this.loading = false;
        this.pageCount = res.data.last_page;
        this.page = res.data.current_page
      }).catch(error => {
        this.loading = false;
      })
    },
    newUser() {
      this.new_user = true
    },
    deleteUser(user_id) {
      userService.deleteUser(user_id)
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
          let index = this.users.findIndex(function(user) {
            return user.id === user_id;
          });
          this.users.splice(index, 1)
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
      })
      .catch(error => {
        /*this.$notify({
          type: 'error',
          title: 'Ocurrio un problema'
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: 'Ocurrio un problema',
          type: 'error'
        });
      })
    },
    itemAction(command) {
      if(command.action === 'edit') {
        this.user = JSON.parse(JSON.stringify(command.data))
        this.edit_user = true
      } else if(command.action === 'delete') {
         this.$confirm('¿ Deseas eliminar el usuario ?', 'Eliminar Usuario', {
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            center: true
          }).then(() => {

            this.deleteUser(command.id);

          }).catch(() => {
            this.loading = false;
            this.$message({
              type: 'info',
              message: 'Acción cancelada'
            });
          });
      } else if(command.action === 'companies') {
        this.$router.push({'name': 'companies-user', params: {user_id: command.id}})
      }
    },
    goPage(numPage) {
      this.$store.dispatch('updateCurrentPageDatatable', { page: numPage, section: 'users' })
      this.getUsers(numPage, this.searchData);
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal)
    },
    new_user(newVal) {
      if (!newVal) {
        this.errors.clear()
      }
    },
    edit_user(newVal) {
      if (!newVal) {
        this.errors.clear()
      }
    }
  },
  created() {
    this.getUsers(this.datatable_current_page.users);
  }
}
</script>


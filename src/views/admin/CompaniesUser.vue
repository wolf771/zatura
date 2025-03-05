<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between">
            <h4 class="font-weight-bold">
              Lista de compañias usuario:
              <span class="text-primary">{{ user.name }}</span>
            </h4>
          </div>
          <hr />

          <div id="data-list-list-view" class="data-list-container mt-5" v-if="!loading && companies.length">
            <vs-table ref="table" :max-items="perPage" :data="companies">
              <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th sort-key="name">Nombre</vs-th>
                <vs-th sort-key="category">Email</vs-th>
                <vs-th sort-key="order_status">Identificación</vs-th>
                <vs-th sort-key="name">Teléfono</vs-th>
                <vs-th sort-key="name">Documentos emitidos x año</vs-th>
                <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{data}">
                <tbody>
                  <vs-tr :data="company"  v-for="(company, index) in data">
                    <vs-td>{{ index + 1 }}</vs-td>
                    <vs-td>
                      {{ company.name }}
                    </vs-td>
                    <vs-td>
                      {{ company.email }}
                    </vs-td>
                    <vs-td>{{ company.identification }}</vs-td>
                    <vs-td>{{ company.phone }}</vs-td>
                    <vs-td>
                      {{ company.year_num_documents }}
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="actionList">
                        <el-button size="small" type="text" round>
                          <i class="fa fa-cogs text-primary"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <!-- <el-dropdown-item :command="{action: 'config-hacienda', company}">
                            Config Hacienda
                          </el-dropdown-item> -->
                          <el-dropdown-item
                            :command="{ action: 'unlink-company', company }"
                          >
                            Desvincular
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>

          <div
            class="col-md-12 text-center"
            v-if="!loading && companies.length == 0"
          >
            <p>No hay Compañias</p>
          </div>

          <div class="col-md-12 text-center" v-if="!loading && pageCount > 10">
            <template>
              <paginate
                :pageCount="pageCount"
                :pageRange="3"
                :marginPages="2"
                :clickHandler="goPage"
                :prevText="'«'"
                :nextText="'»'"
                :containerClass="'pagination justify-content-center'"
                :pageClass="'page-company'"
              >
              </paginate>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/services/user.service";
import companiesService from "@/services/companies.service";

export default {
  name: "companies-user",
  data() {
    return {
      user: "",
      companies: [],
      loading: true,
      pageCount: 1,
      perPage: 10,
    };
  },
  methods: {
    getCompaniesUser(page = 1) {
      let user_id = this.$route.params.user_id;
      userService
        .getCompaniesUser(user_id)
        .then(res => {
          this.companies = res.data.companies;
          this.user = res.data.user;
          this.loading = false;
          this.pageCount = 1;
          this.page = res.data.current_page
        })
        .catch(error => {
          this.loading = false;
        });
    },
    goPage(numPage) {
      this.getCompaniesUser(numPage);
    },
    actionList(command) {
      if (command.action === "select-company") {
        companiesService
          .selectCompany(command.company)
          .then(res => {
            this.companies = res.data.companies;
            this.$store.commit("updateUser", { user: res.data.user });
            //this.$snotify.success(`La compañia ${command.company.name} esta activa`);
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: `La compañia ${command.company.name} esta activa`,
              type: "success"
            });
          })
          .catch(() => {
            //this.$snotify.error('Ocurrio un error');
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: "Ocurrio un error",
              type: "error"
            });
          });
      } else if (command.action === "config-hacienda") {
        this.$router.push({
          name: "config-hacienda",
          params: { company_id: command.company.id }
        });
      } else if (command.action === "unlink-company") {
        this.$confirm(
          "¿ Deseas desvincular la compañia del usuario ?",
          "Desvincular Compañia",
          {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          }
        )
          .then(() => {
            this.deleteCompanyUser(command.company.pivot);
          })
          .catch(() => {
            this.loading = false;
            this.$message({
              type: "info",
              message: "Acción cancelada"
            });
          });
      }
    },
    deleteCompanyUser(company_user) {
      companiesService
        .deleteCompanyUser(company_user)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              type: "success",
              title: res.data.message
            });
            let index = this.companies.findIndex(function(company) {
              return company.pivot.company_id === company_user.company_id;
            });
            this.companies.splice(index, 1);
          } else {
            this.$notify({
              type: "error",
              title: res.data.message
            });
          }
        })
        .catch(error => {
          this.$notify({
            type: "error",
            title: "Ocurrio un problema"
          });
        });
    }
  },
  created() {
    this.getCompaniesUser();
  }
};
</script>

<style></style>

<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>

              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>
            <vs-button type="gradient" v-if="user.rol === 'admin'" @click="newCompany()">
              <i class="fa fa-user-plus"></i>
              Nueva Compañia
            </vs-button>
          </div>
          <hr />

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            element-loading-text="Seleccionando..."
            element-loading-background="rgba(0, 0, 0, 0.8)"
            v-loading="loadingSelectCompany"
            v-if="!loading && companies.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="companies">
              <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th sort-key="name">Nombre</vs-th>
                <vs-th sort-key="category">Email</vs-th>
                <vs-th sort-key="order_status">Identificación</vs-th>
                <vs-th sort-key>Teléfono</vs-th>
                <vs-th sort-key>Estado</vs-th>
                <vs-th v-if="user.email == 'valery@zaturacr.com'">
                  Administrador
                </vs-th>
                <vs-th>
                  Documentos emitidos x año
                </vs-th>
                <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :state="company.id === company_default.id ? 'success' : ''"
                    :data="company"
                    :key="company.id"
                    v-for="(company, index) in data"
                  >
                    <vs-td>{{ index + 1 }}</vs-td>
                    <vs-td>
                      {{ company.name }}
                    </vs-td>
                    <vs-td>
                      {{ company.email }}
                    </vs-td>
                    <vs-td>{{ company.identification }}</vs-td>
                    <vs-td>{{ company.phone }}</vs-td>
                    <vs-td
                      ><span v-html="statusCompany(company.active)"></span
                    ></vs-td>
                    <vs-td v-if="user.email == 'valery@zaturacr.com'">
                      {{ company.user.name }}
                    </vs-td>
                    <vs-td>
                      {{ company.year_num_documents }}
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="actionList">
                        <i class="fa fa-cogs text-primary"></i>

                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :command="{ action: 'select-company', company }"
                          >
                            Seleccionar
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="user.rol === 'admin'"
                            :command="{ action: 'config-hacienda', company }"
                          >
                            Config Hacienda
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{ action: 'config-generals', company }"
                          >
                            Configuraciones
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{ action: 'delete-company', company }"
                          >
                            Eliminar
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              action: 'activate-deactivate-company',
                              company
                            }"
                          >
                            {{ company.active ? "Desactivar" : "Activar" }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
            <div
              class="mt-4 text-center zatura-pagination"
              v-if="pageCount > 1"
            >
              <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
            </div>
          </div>

          <div
            class="col-md-12 text-center"
            v-if="!loading && companies.length == 0"
          >
            <p>No hay Compañias</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import companiesService from "@/services/companies.service";
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";

export default {
  name: "companies",
  data() {
    return {
      companies: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1,
      loadingSelectCompany: false
    };
  },
  components: {
    SearchFilter,
    RegistersPerPage
  },
  computed: {
    ...mapState(["user", "company_default", "datatable_current_page"])
  },
  methods: {
    statusCompany(active) {
      let element = "";
      if (active) {
        return `<span class="text-success font-weight-bold">Activa</span>`;
      } else {
        return `<span class="text-danger font-weight-bold">Inactiva</span>`;
      }
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getCompanies(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getCompanies(1, this.searchData);
    },
    getCompanies(page = 1, search = {}) {
      companiesService
        .getAllCompanies(page, search)
        .then(res => {
          this.companies = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
          if (error.response.status == 401) {
            // localStorage.clear();
            // this.$router.push('login');
          }
        });
    },
    newCompany() {
      this.$router.push("new-company");
    },
    goPage(numPage) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: numPage,
        section: "all_companies"
      });
      this.getCompanies(numPage, this.searchData);
    },
    actionList(command) {
      if (command.action === "select-company") {
        this.loadingSelectCompany = true;

        const user_id_login = JSON.parse(localStorage.getItem("user")).id;
        const datos = {
          company_id: command.company.id,
          user_id: user_id_login
        };

        companiesService
          .selectCompany(datos)
          .then(res => {
            //this.companies = res.data.companies;

            let defaultState = {
              countries: [],
              provinces: [],
              cantons: [],
              districts: [],
              identification_types: [
                { value: "01", text: "Cédula Física" },
                { value: "02", text: "Cédula Juridica" },
                { value: "03", text: "DIMEX" },
                { value: "04", text: "NITE" }
              ],
              categories: [],
              units: [],
              tax_types: [],
              user: "",
              currencies: [],
              selected_items: [
                {
                  uid: 1,
                  id: 0,
                  name: "",
                  price: 0,
                  calculate_price: 0,
                  quantity: 1,
                  discount: 0,
                  tax_type: {
                    id: 1,
                    rate: 0
                  },
                  currency: {
                    id: 2,
                    symbol: "₡"
                  }
                }
              ],
              payment_methods: [],
              payment_terms: [],
              payment_forms: [],
              consecutives: {
                fe: 0,
                nc: 0,
                nd: 0,
                te: 0,
                cce: 0,
                cpce: 0,
                rce: 0,
                qt: 0
              },
              current_currency: {
                id: 1,
                symbol: "$",
                name: ""
              },
              company_default: {},
              general_configurations: {},
              notifications: [
                {
                  title: "Documento aceptado",
                  body:
                    "El documento 000000001 fue rechazado por el ministerio de hacienda...",
                  classes: "text-success"
                },
                {
                  title: "Documento rechazado",
                  body:
                    "El documento 000000002 fue aceptado por el ministerio de hacienda...",
                  classes: "text-danger"
                }
              ],
              templates_email: [],
              terms: []
            };

            this.$store.commit("resetState", { defaultState: defaultState });

            //this.companies = res.data.companies;
            let currency = JSON.parse(
              res.data.company.general_configurations.currency
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
              company_default: res.data.company
            });
            this.$store.commit("updateGeneralConfigurations", {
              general_configurations: res.data.company.general_configurations
            });
            this.$store.commit("updateCurrentCurrency", {
              current_currency: currency
            });
            this.$store.commit("updateUser", { user: res.data.user });
            this.$snotify.success(
              `La compañia ${command.company.name} esta activa`
            );
            localStorage.removeItem("company_default");
            localStorage.setItem(
              "company_default",
              JSON.stringify(res.data.company)
            );

            this.loadingSelectCompany = false;
          })
          .catch(() => {
            this.loadingSelectCompany = false;
            //this.$snotify.error('Ocurrio un error');
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: "Ocurrio un error",
              type: "error"
            });
          });
      } else if (command.action === "config-generals") {
        this.$router.push({
          name: "main-configurations",
          params: { company_id: command.company.id }
        });
      } else if (command.action === "config-hacienda") {
        this.$router.push({
          name: "config-hacienda",
          params: { company_id: command.company.id }
        });
      } else if (command.action === "delete-company") {
        this.$confirm("¿ Deseas eliminar la compañia ?", "Eliminar Compañia", {
          confirmButtonText: "Si, continuar",
          cancelButtonText: "Cancelar",
          type: "warning",
          center: true
        })
          .then(() => {
            this.deleteCompany(command.company.id);
          })
          .catch(() => {
            this.loading = false;
            this.$message({
              type: "info",
              message: "Acción cancelada"
            });
          });
      } else if (command.action === "activate-deactivate-company") {
        const action = !!command.company.active ? "Desactivar" : "Activar";

        this.$confirm(
          `¿ Deseas ${action} la compañia ?`,
          `${action} Compañia`,
          {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          }
        )
          .then(() => {
            this.activateDeactivateCompany(command.company.id);
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
    deleteCompany(company_id) {
      companiesService
        .deleteCompany(company_id)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              type: "success",
              title: res.data.message
            });
            let index = this.companies.findIndex(function(company) {
              return company.id === company_id;
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
    },
    activateDeactivateCompany(company_id) {
      companiesService
        .activateDeactivateCompany({
          company_id: company_id
        })
        .then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$notify({
              type: "success",
              title: res.data.message
            });
            let index = this.companies.findIndex(function(company) {
              return company.id === company_id;
            });
            this.companies[index].active = res.data.data.active;
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
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getCompanies(this.datatable_current_page.all_companies);
  }
};
</script>

<style></style>

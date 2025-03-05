<template>
  <div
    class="row"
    v-loading="loadingDownloadFiles"
    element-loading-text="Generando ZIP con todos los archivos xml y pdfs de la compañia, esto puede tardar unos minutos dependiendo de la cantidad de documentos..."
  >
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>
              <!-- <h4 class="font-weight-bold">Lista de compañias</h4> -->
              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>
            <!-- <button class="btn btn-info btn-rounded" v-if="user.rol === 'admin'" @click="newCompany()">
            <i class="fa fa-user-plus"></i>
            Nueva Compañia
          </button> -->
          </div>

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
                    :state="
                      company.company_id === company_default.id ? 'success' : ''
                    "
                    :data="company"
                    :key="company.id"
                    v-for="(company, index) in data"
                  >
                    <vs-td>{{ index + 1 }}</vs-td>
                    <vs-td>
                      {{ company.company.name }}
                    </vs-td>
                    <vs-td>
                      {{ company.company.email }}
                    </vs-td>
                    <!-- <td>{{ company.id === company_default.id ? 'SI' : 'NO' }}</td> -->
                    <vs-td>{{ company.company.identification }}</vs-td>
                    <vs-td>{{ company.company.phone }}</vs-td>
                    <vs-td v-if="user.email === 'valery@zaturacr.com'">
                      {{ company.user.name }}
                    </vs-td>
                    <vs-td>
                      {{ company.company.year_num_documents }}
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="actionList" trigger="click">
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
                            :command="{ action: 'download-files', company }"
                          >
                            Descargar xmls y pdfs
                          </el-dropdown-item>
                          <!-- <el-dropdown-item v-if="user.rol === 'admin'" :command="{action: 'config-email', company}">
                            Config Email
                          </el-dropdown-item> -->
                          <!-- <el-dropdown-item :command="{action: 'template-email', company}">
                            Plantillas correos
                          </el-dropdown-item> -->
                          <!-- <el-dropdown-item v-if="user.rol === 'admin'" :command="{action: 'edit-company', company}">
                            Editar
                          </el-dropdown-item> -->
                          <!-- <el-dropdown-item :command="{action: 'terms', company}">
                            Terminos y condiciones
                          </el-dropdown-item> -->
                          <!-- <el-dropdown-item :command="{action: 'taxes', company}">
                            IVA
                          </el-dropdown-item> -->
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
      loadingSelectCompany: false,
      loadingDownloadFiles: false
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
      this.loading = true;
      companiesService
        .getCompanies(page, search)
        .then(res => {
          this.companies = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    newCompany() {
      this.$router.push("new-company");
    },
    goPage(numPage) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: numPage,
        section: "companies"
      });
      this.getCompanies(numPage);
    },
    async actionList(command) {
      if (command.action === "select-company") {
        this.loadingSelectCompany = true;
        companiesService
          .selectCompany(command.company)
          .then(res => {
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
              `La compañia ${command.company.company.name} esta activa`
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
      } else if (command.action === "config-hacienda") {
        this.$router.push({
          name: "config-hacienda",
          params: { company_id: command.company.company.id }
        });
      } else if (command.action === "config-generals") {
        this.$router.push({
          name: "main-configurations",
          params: { company_id: command.company.company.id }
        });
      } else if (command.action === "download-files") {
        try {
          this.loadingDownloadFiles = true;
          const { data: res } = await companiesService.downloadAllFiles(
            command.company.company.id
          );
          this.loadingDownloadFiles = false;
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Todos_los_archivos_${command.company.company.name}.zip`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.log(error);
          this.loadingDownloadFiles = false;
        }
      }
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getCompanies(this.datatable_current_page.companies);
  }
};
</script>

<style></style>

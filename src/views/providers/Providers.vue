<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- <h4 class="font-weight-bold text-primary">Lista de proveedores</h4> -->
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>
              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>
            <!-- <vs-button @click="newProvider()">
            <i class="fa fa-user-plus"></i>
            Nuevo Proveedor
          </vs-button> -->
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Nombre</vs-th>
                <vs-th>Email</vs-th>
                <vs-th>Identificación</vs-th>
                <vs-th>Teléfono</vs-th>
                <vs-th>Balance</vs-th>
                <vs-th>Status</vs-th>
                <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="indextr"
                    v-for="(item, indextr) in data"
                  >
                    <vs-td>{{ indextr + 1 }}</vs-td>
                    <vs-td>
                      <router-link
                        :to="{ name: 'client-detail', params: { id: item.id } }"
                        class="btn btn-link"
                      >
                        {{ item.name | truncateText(0, 25) }}
                      </router-link>
                    </vs-td>
                    <vs-td>{{ item.email | truncateText(0, 25) }}</vs-td>
                    <vs-td>{{ item.identification }}</vs-td>
                    <vs-td>{{ item.phone }}</vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.balance"
                        :currency="current_currency.id"
                        :exchange_rate="1"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>
                      <span
                        :class="[
                          'badge',
                          {
                            'badge-success': item.active,
                            'badge-warning': !item.active
                          }
                        ]"
                      >
                        {{ item.active ? "Activo" : "Inactivo" }}
                      </span>
                    </vs-td>
                    <vs-td class="text-center">
                      <el-dropdown @command="listAction">
                        <!-- <el-button type="primary" size="small"> -->

                        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                        <!-- </el-button> -->
                        <i class="fa fa-cogs text-primary"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :class="[
                              {
                                'text-success': !item.active,
                                'text-warning': item.active
                              }
                            ]"
                            :command="{
                              command: 'status',
                              payload: { id: item.id, active: item.active }
                            }"
                          >
                            <i
                              :class="{
                                'fas fa-user-check': !item.active,
                                'fas fa-user-slash': item.active
                              }"
                            ></i>
                            {{ !item.active ? "Activar" : "Desactivar" }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="!item.has_documents"
                            class="text-danger"
                            :command="{
                              command: 'delete',
                              payload: { id: item.id }
                            }"
                          >
                            <i class="fa fa-times"></i>
                            Eliminar
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>

          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>

          <div class="col-md-12 text-center" v-if="items.length == 0">
            <p>No hay Proveedores</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import providersService from "@/services/providers.service";
import loading from "@/components/Loading.vue";
import CalcPrice from "@/components/CalcPrice.vue";
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";

export default {
  name: "providers",
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1
    };
  },
  computed: {
    ...mapState(["current_currency", "datatable_current_page"])
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getProviders(1, false, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getProviders(1, false, this.searchData);
    },
    getProviders(page = 1, generic, search) {
      this.loading = true;
      providersService
        .getProviders(page, generic, search)
        .then(res => {
          this.items = res.data.data.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          if (error.response.status == 401) {
            // localStorage.clear();
          }
        });
    },
    newProvider() {
      this.$router.push("new-provider");
    },
    goPage(numPage) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: page,
        section: "providers"
      });
      this.getProviders(numPage, false, this.searchData);
    },
    listAction(command) {
      switch (command.command) {
        case "status":
          /*this.$notify({
          type: 'info',
          title: 'Se esta mejorando esta accion'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "Se esta mejorando esta accion",
            type: "info"
          });
          //   let active = command.payload.active;
          //      this.$confirm(`¿ Deseas ${active ? 'Desactivar' : 'Activar'} el providere ?`, `${active ? 'Desactivar' : 'Activar'} Proveedor`, {
          //       confirmButtonText: 'Si, continuar',
          //       cancelButtonText: 'Cancelar',
          //       type: 'warning',
          //       center: true
          //     }).then(() => {
          //       this.loading = true;
          //       let index = this.items.findIndex(i => i.id === command.payload.id);

          //       providersService.activeDeactiveProvider(command.payload.id)
          //       .then(() => {
          //         this.items[index].active = !active;
          //         this.loading = false;
          //         this.$message({
          //           type: 'success',
          //           message: `Proveedor ${ active ? 'Desactivado': 'Activado'}`
          //         });
          //       })
          //       .catch(() => {
          //         this.loading = false;
          //         this.$message({
          //           type: 'error',
          //           message: 'Ocurrio un problema'
          //         });
          //       });
          //     }).catch(() => {
          //       this.loading = false;
          //       this.$message({
          //         type: 'info',
          //         message: 'Acción cancelada'
          //       });
          //     });
          break;
        case "delete":
          /*this.$notify({
            type: 'info',
            title: 'Se esta mejorando esta accion'
          })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "Se esta mejorando esta accion",
            type: "info"
          });
          //     this.$confirm('¿ Deseas eliminar el providere ?', 'Eliminar Proveedor', {
          //       confirmButtonText: 'Si, continuar',
          //       cancelButtonText: 'Cancelar',
          //       type: 'warning',
          //       center: true
          //     }).then(() => {
          //       this.loading = true;
          //       let index = this.items.findIndex(i => i.id === command.payload.id);
          //       providersService.deleteProvider(command.payload.id)
          //       .then(() => {
          //         this.loading = false;
          //         this.items.splice(index, 1);
          //         this.$message({
          //           type: 'success',
          //           message: 'Proveedor eliminado'
          //         });
          //       })
          //       .catch(() => {
          //         this.loading = false;
          //         this.$message({
          //           type: 'error',
          //           message: 'Ocurrio un problema'
          //         });
          //       });
          //     }).catch(() => {
          //       this.loading = false;
          //       this.$message({
          //         type: 'info',
          //         message: 'Acción cancelada'
          //       });
          //     });
          break;
      }
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getProviders(this.datatable_current_page.providers);
  },
  components: {
    loading,
    CalcPrice,
    SearchFilter,
    RegistersPerPage
  }
};
</script>

<style></style>

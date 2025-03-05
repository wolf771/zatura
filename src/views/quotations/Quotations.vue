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
              <!-- <h4 class="font-weight-bold">Lista de {{$store.state.general_configurations.custom_quotation_name }}</h4> -->
              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>

            <vs-button type="gradient" @click="newQuotation()">
              <i class="fa fa-user-plus"></i>
              Nueva
              {{ $store.state.general_configurations.custom_quotation_name }}
            </vs-button>
          </div>

      
          <div id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
          <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                 <vs-th>Número</vs-th>
                  <vs-th>Cliente</vs-th>
                  <vs-th>Subtotal</vs-th>
                  <vs-th>Descuento</vs-th>
                  <vs-th>IVA</vs-th>
                  <vs-th>Total</vs-th>
                  <vs-th>Fecha</vs-th>
                  <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="indextr"
                    v-for="(item, indextr) in data"
                  >
                    <vs-td>
                       <router-link
                      class="link"
                      :to="{
                        name: 'detail-transaction',
                        params: { type: 'quotation', id: item.id }
                      }"
                    >
                      {{ item.reference }}
                    </router-link>
                    </vs-td>

                    <vs-td>
                      <router-link
                      v-if="!item.client.deleted_at"
                      class="link"
                      :to="{
                        name: 'client-detail',
                        params: { id: item.client.id }
                      }"
                    >
                      {{ item.client.name }}
                    </router-link>
                    <span v-else>
                      {{ item.client.name }}
                    </span>
                    </vs-td>

                    <vs-td>
                      {{ item.currency.symbol }} {{ item.subtotal }}
                    </vs-td>

                  <vs-td>{{ item.currency.symbol }} {{ item.discount }}</vs-td>
                  <vs-td>{{ item.currency.symbol }} {{ item.tax }}</vs-td>
                  <vs-td>{{ item.currency.symbol }} {{ item.total }}</vs-td>
                  <vs-td>{{ item.created_at | moment("DD/MM/YYYY") }}</vs-td>
                  <vs-td>
                    <el-dropdown @command="listAction">
                      <i class="fa fa-cogs text-primary"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          :command="{
                            command: 'edit',
                            payload: { id: item.id }
                          }"
                          class="text-success"
                        >
                          <i class="fa fa-edit"></i>
                          Editar
                        </el-dropdown-item>
                        <el-dropdown-item
                          :command="{
                            command: 'to-invoice',
                            payload: { id: item.id }
                          }"
                          class="text-info"
                        >
                          <i class="fa fa-file-import"></i>
                          Convertir en factura
                        </el-dropdown-item>
                        <el-dropdown-item
                          :command="{
                            command: 'clone',
                            payload: { id: item.id }
                          }"
                          class="text-primary"
                        >
                          <i class="fa fa-clone"></i>
                          Clonar
                        </el-dropdown-item>
                        <el-dropdown-item
                          :command="{
                            command: 'delete',
                            payload: { id: item.id }
                          }"
                          class="text-danger"
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

            <div
              class="mt-4 text-center zatura-pagination"
              v-if="pageCount > 1"
            >
              <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
            </div>
          </div>

          <div
            class="col-md-12 text-center"
            v-if="!loading && items.length == 0"
          >
            <p>No hay Cotizaciones</p>
          </div>

          <!-- <div class="col-md-12 text-center" v-if="!loading && pageCount > 1">
            <template>
              <paginate
                :pageCount="pageCount"
                :pageRange="3"
                :marginPages="2"
                :clickHandler="goPage"
                :prevText="'«'"
                :nextText="'»'"
                :containerClass="'pagination justify-content-center'"
                :pageClass="'page-link bg-primary text-white'"
              >
              </paginate>
            </template>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quotationsService from "@/services/quotations.service";
import CalcPrice from "@/components/CalcPrice.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import { mapState } from 'vuex'

export default {
  name: "quotations",
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 1,
      perPage: 10,
      searchData: {},
      page: 1
    };
  },
  computed: {
    ...mapState([
      'datatable_current_page'
    ])
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getQuotations(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getQuotations(1, this.searchData);
    },
    newQuotation() {
      this.$router.push({ name: "new-quotation" });
    },
    getQuotations(page = 1, search = {}) {
      this.loading = true;
      quotationsService
        .getQuotations(page, search)
        .then(res => {
          this.items = res.data.data;
          this.pageCount = res.data.last_page;
          this.loading = false;
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
    },
    goPage(numPage) {
      this.$store.dispatch('updateCurrentPageDatatable', { page: numPage, section: 'quotations'})
      this.getQuotations(numPage, this.searchData);
    },
    listAction(command) {
      switch (command.command) {
        case "edit":
          this.$router.push({
            name: "edit-quotation",
            params: {
              document_type: "edit-quotation",
              document_id: command.payload.id
            }
          });
          break;
        case "to-invoice":
          this.$confirm("¿ Deseas convertir a factura ?", "Convertir", {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          })
            .then(() => {
              this.loading = true;
              quotationsService
                .quotationToInvoice(command.payload.id)
                .then(res => {
                  this.loading = false;
                  if (res.data.success) {
                    this.$message({
                      showClose: true,
                      message: "Cotización convertida correctamente",
                      type: "success"
                    });
                    this.$router.push({
                      name: "detail-transaction",
                      params: { type: "invoice", id: res.data.item.id }
                    });
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.message,
                      type: "error"
                    });
                  }
                })
                .catch(error => {
                  this.loading = false;
                  this.$message({
                    type: "error",
                    message: error.message
                  });
                });
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                type: "info",
                message: "Acción cancelada"
              });
            });
          break;
        case "clone":
          this.$router.push({
            name: "new-clone",
            params: {
              document_type: "quotation",
              document_id: command.payload.id
            }
          });
          break;
        case "delete":
          this.$confirm(
            "¿ Deseas eliminar la cotización ?",
            "Eliminar Cotización",
            {
              confirmButtonText: "Si, continuar",
              cancelButtonText: "Cancelar",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.deleteQuotation(command.payload.id);
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                type: "info",
                message: "Acción cancelada"
              });
            });
          break;
      }
    },
    deleteQuotation(id) {
      quotationsService
        .deleteQuotation(id)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              type: "success",
              title: res.data.message
            });
            let index = this.items.findIndex(function(item) {
              return item.id === id;
            });
            this.items.splice(index, 1);
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
  components: {
    CalcPrice,
    SearchFilter,
    RegistersPerPage
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getQuotations(this.datatable_current_page.quotations);
  }
};
</script>

<style></style>

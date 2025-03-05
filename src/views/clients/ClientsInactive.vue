<template>
	<div class="card-body" v-loading="loading">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <!-- <h4 class="font-weight-bold text-primary">Lista de clientes</h4> -->
        <registers-per-page
          @changeNumPerPage="changeNumPerPage"
        ></registers-per-page>
        <search-filter
          @executeSearch="search"
          :options="[]"
        ></search-filter>
      </div>
    </div>

    <div
      id="data-list-list-view"
      class="data-list-container mt-5"
      v-if="items.length"
    >
      <vs-table ref="table" :max-items="perPage" :data="items">
        <template slot="thead">
          <vs-th sort-key="name">#</vs-th>
          <vs-th sort-key="name">Nombre</vs-th>
          <vs-th sort-key="category">Email</vs-th>
          <vs-th sort-key="popularity">Identificación</vs-th>
          <vs-th sort-key="order_status">Balance</vs-th>
          <vs-th sort-key="price">Status</vs-th>
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
                {{ indextr + 1 }}
              </vs-td>

              <vs-td>
                <router-link
                  :to="{ name: 'client-detail', params: { id: item.id } }"
                  class="btn btn-link"
                >
                  {{ item.name | truncateText(0, 25) }}
                </router-link>
              </vs-td>

              <vs-td>
                {{ item.email | truncateText(0, 25) }}
              </vs-td>

              <vs-td>
                {{ item.identification }}
              </vs-td>

              <vs-td>
                <calc-price
                  :price="item.balance"
                  :currency="current_currency.id"
                  :exchange_rate="1"
                >
                </calc-price>
              </vs-td>

              <vs-td>
                <vs-chip
                  :color="getStatusColor(item.active)"
                  class="product-order-status"
                  >{{ item.active ? "Activo" : "Inactivo" }}</vs-chip
                >
              </vs-td>

              <vs-td class="whitespace-no-wrap">
                <el-dropdown @command="listAction">
                  <!-- <el-button type="primary" size="small"> -->

                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                  <!-- </el-button> -->
                  <i class="fa fa-cogs text-primary"></i>
                  <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item :class="[{'text-success': !item.active, 'text-warning': item.active}]" :command="{command: 'status', payload:{id: item.id, active: item.active}}">
                     <i :class="{'fas fa-user-check': !item.active, 'fas fa-user-slash': item.active}"></i>
                     {{ !item.active ? 'Activar' : 'Desactivar' }}
                    </el-dropdown-item> -->

                    <el-dropdown-item
                      v-if="item.balance > 0"
                      class="text-primary"
                      :command="{
                        command: 'state-account',
                        payload: item
                      }"
                    >
                      <i class="fa fa-file"></i>
                      Enviar estado de cuenta
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="!item.active"
                      class="text-secondary"
                      :command="{
                        command: 'change-active',
                        payload: item.id
                      }"
                    >
                      <i class="fa fa-check-circle"></i>
                      Activar
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

      <div
        class="mt-4 text-center zatura-pagination"
        v-if="pageCount > 1"
      >
        <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
      </div>
    </div>

    <div class="col-md-12 text-center" v-if="items.length == 0">
      <p>No hay clientes inactivos</p>
    </div>
  </div>
</template>

<script>
import clientsService from "@/services/clients.service";
import loading from "@/components/Loading.vue";
import CalcPrice from "@/components/CalcPrice.vue";
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
//JRA modal nuevo cliente
import helpers from "@/helpers/helpers";
import Modal from "@/components/Modal.vue";
import ClientsInactive from "@/views/clients/ClientsInactive"

export default {
	props: ['current_currency'],
  name: "clients",
  data() {
    return {
      stateAccountModal: false,
      state_account: {
        client: {},
        pending_total: 0,
        pending_payment_invoices: []
      },
      loading_pending_payment_invoices: false,
      loading_send_state_account: false,
      items: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1
    };
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getClients(1, false, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getClients(1, false, this.searchData);
    },
    async getClients(page = 1, generic, search) {
      this.loading = true;
      const { data:res } = await clientsService.getOnlyClients(page, generic, search, 'inactive');
      this.items = res.data
      this.loading = false;
      this.pageCount = res.last_page;
      this.page = res.current_page;
    },
    goPage(numPage) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: numPage,
        section: "clients"
      });
      this.getClients(numPage, false, this.searchData);
    },
    async listAction(command) {
      switch (command.command) {
        case "state-account":
          this.state_account = {
            client: {},
            pending_total: 0,
            pending_payment_invoices: []
          };
          const client = command.payload;
          this.loading_pending_payment_invoices = true;
          this.stateAccountModal = true;
          this.state_account.client = client;
          try {
            const {
              data: res
            } = await clientsService.getPendingPaymentInvoices(client.id);
            this.state_account.pending_total = res.data.pending_total;
            this.state_account.pending_payment_invoices =
              res.data.pending_invoices;
          } catch (error) {}
          this.loading_pending_payment_invoices = false;
        break;

        case "change-active":
        	this.$emit('activeClient', {
            client_id: command.payload,
            status: 1
          })
          setTimeout(() => {
          	const index = this.items.findIndex(i => i.id == command.payload)
          	this.items.splice(index, 1)
          }, 1000)
          
        break;

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
          //      this.$confirm(`¿ Deseas ${active ? 'Desactivar' : 'Activar'} el cliente ?`, `${active ? 'Desactivar' : 'Activar'} Cliente`, {
          //       confirmButtonText: 'Si, continuar',
          //       cancelButtonText: 'Cancelar',
          //       type: 'warning',
          //       center: true
          //     }).then(() => {
          //       this.loading = true;
          //       let index = this.items.findIndex(i => i.id === command.payload.id);

          //       clientsService.activeDeactiveClient(command.payload.id)
          //       .then(() => {
          //         this.items[index].active = !active;
          //         this.loading = false;
          //         this.$message({
          //           type: 'success',
          //           message: `Cliente ${ active ? 'Desactivado': 'Activado'}`
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
          this.$confirm("¿ Deseas eliminar el cliente ?", "Eliminar Cliente", {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          })
            .then(() => {
              this.loading = true;
              let index = this.items.findIndex(
                i => i.id === command.payload.id
              );
              clientsService
                .deleteClient(command.payload.id)
                .then(() => {
                  this.loading = false;
                  this.items.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "Cliente eliminado"
                  });
                })
                .catch(() => {
                  this.loading = false;
                  this.$message({
                    type: "error",
                    message: "Ocurrio un problema"
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
      }
    },
    getStatusColor(status) {
      if (status) return "success";
      if (!status) return "warning";
      return "primary";
    },
    async sendPendingPaymentInvoicesClient(client_id) {
      try {
        this.loading_send_state_account = true;
        const {
          data: res
        } = await clientsService.sendPendingPaymentInvoicesClient(
          this.state_account.client.id
        );
        this.$message({
          type: "success",
          message: "Estado de cuenta enviado al cliente correctamente."
        });
      } catch (error) {
        this.$message({
          type: "success",
          message: error.message
        });
      }
      this.loading_send_state_account = false;
      this.stateAccountModal = false;
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  mounted() {
    this.getClients(1);
  },
  components: {
    loading,
    CalcPrice,
    SearchFilter,
    RegistersPerPage,
    Modal,
    ClientsInactive
  }
};
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}

.width-popup {
  width: 1000px !important;
}
</style>
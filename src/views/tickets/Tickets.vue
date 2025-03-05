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
              <!-- <h4 class="font-weight-bold">Lista de tiquetes electronicos</h4> -->
              <search-filter @executeSearch="search"></search-filter>
            </div>
            <vs-button
              type="gradient"
              @click="newTicket()"
            >
              <i class="fa fa-plus"></i>
              Nuevo tiquete
            </vs-button>
          </div>
          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th>Número</vs-th>
                <vs-th>Cliente</vs-th>
                <vs-th>Total</vs-th>
                <vs-th>Fecha</vs-th>
                <vs-th>Hacienda</vs-th>
                <vs-th>Acciones</vs-th>
              </template>
              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr v-for="item in items" :key="item.id">
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'ticket', id: item.id }
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
                      <calc-price
                        :price="item.total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>

                    <vs-td>{{ item.created_at | moment("DD/MM/YYYY") }}</vs-td>
                    <vs-td>
                      <status-hacienda
                        :status="item.hacienda"
                      ></status-hacienda>
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="listAction">
                        <i class="fa fa-cogs text-primary"></i>

                        <el-dropdown-menu slot="dropdown">
                          <!-- <el-dropdown-item :command="{command: 'pay', payload: {}}" class="text-info">
                          <i class="fa fa-money"></i>
                          Pagar
                        </el-dropdown-item> -->
                          <el-dropdown-item
                            :command="{
                              command: 'nc',
                              payload: { id: item.id }
                            }"
                            class="text-danger"
                          >
                            <i class="fa fa-minus-circle"></i>
                            Nota de crédito
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              command: 'nd',
                              payload: { id: item.id }
                            }"
                            class="text-success"
                          >
                            <i class="fa fa-plus-circle"></i>
                            Nota de débito
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

          <div
            class="col-md-12 text-center"
            v-if="!loading && items.length == 0"
          >
            <p>No hay Tiquetes Electronicos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ticketsService from "../../services/tickets.service";
import CalcPrice from "@/components/CalcPrice.vue";
import StatusHacienda from "@/components/StatusHacienda.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import { mapState } from "vuex";

export default {
  name: "tickets",
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
    ...mapState(["datatable_current_page"])
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getTickets(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getTickets(1, this.searchData);
    },
    newTicket() {
      this.$router.push({ name: "new-ticket" });
    },
    getTickets(page = 1) {
      ticketsService
        .getTickets(page, this.searchData)
        .then(res => {
          this.loading = false;
          this.items = res.data.data;
          this.pageCount = res.data.last_page;
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
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: numPage,
        section: "tickets"
      });
      this.getTickets(numPage, this.searchData);
    },
    listAction(command) {
      switch (command.command) {
        case "pay":
          alert("Pagar");
          break;
        case "nc":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nc",
              document_type: "ticket",
              document_id: command.payload.id
            }
          });
          break;
        case "nd":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nd",
              document_type: "ticket",
              document_id: command.payload.id
            }
          });
          break;
        case "clone":
          this.$router.push({
            name: "new-clone",
            params: {
              document_type: "ticket",
              document_id: command.payload.id
            }
          });
          break;
      }
    }
  },
  components: {
    CalcPrice,
    StatusHacienda,
    SearchFilter,
    RegistersPerPage
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getTickets(this.datatable_current_page.tickets);
  }
};
</script>

<style></style>

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
              <!-- <h4 class="font-weight-bold">Lista de simplificados</h4> -->
              <search-filter
                :perPage="perPage"
                :options="optionsFilter"
                @executeSearch="search"
              ></search-filter>
            </div>

            <vs-button type="gradient" @click="newSimple()">
              <i class="fa fa-plus"></i>
              Nuevo simplificado
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
                <!-- <vs-th>Monto pagado</vs-th>
                <vs-th>Estado</vs-th> -->
                <vs-th>Fecha</vs-th>
                <vs-th>Hacienda</vs-th>
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
                          params: { type: 'simple', id: item.id }
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
                        :exchange_rate="1"
                      ></calc-price>
                    </vs-td>
                    <!-- <vs-td>
                    <calc-price :price="item.payment_amount" :currency="item.currency_id" :exchange_rate="1"></calc-price> 
                  </vs-td>
                  <vs-td>
                    <status-payment :total="item.total" :payment_amount="item.payment_amount" :hacienda="item.hacienda">
                    </status-payment>
                  </vs-td> -->
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
                          <!-- <el-dropdown-item v-if="item.total > item.payment_amount" :command="{command: 'pay', payload: {item: item}}" class="text-info">
                          <i class="fa fa-money-bill-alt"></i>
                          Pagar
                        </el-dropdown-item> -->
                          <!-- <el-dropdown-item :command="{command: 'nc', payload: {id: item.id}}" class="text-danger">
                          <i class="fa fa-minus-circle"></i>
                          Nota de crédito
                        </el-dropdown-item>
                        <el-dropdown-item :command="{command: 'nd', payload: {id: item.id}}" class="text-success">
                          <i class="fa fa-plus-circle"></i>
                          Nota de débito
                        </el-dropdown-item> -->
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
            <p>No hay Simplificados</p>
          </div>
        </div>
      </div>
    </div>
    <payment-modal
      @paymentExecuted="updateItem"
      @closeModal="closeModal()"
      :data="data_modal"
      :vis="payment_modal_visible"
    ></payment-modal>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import simplesService from "@/services/simples.service";
import PaymentModal from "@/components/PaymentModal.vue";
import StatusPayment from "@/components/StatusPayment.vue";
import StatusHacienda from "@/components/StatusHacienda.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import { mapState } from "vuex";

export default {
  name: "simples",
  data() {
    return {
      items: [],
      loading: false,
      payment_modal_visible: false,
      data_modal: {},
      searchData: {},
      pageCount: 0,
      perPage: 10,
      page: 1,
      optionsFilter: [
        { label: "Aceptado", value: "aceptado" },
        { label: "Rechazado", value: "rechazado" },
        { label: "Pagado", value: "pagado" },
        { label: "No Pagado", value: "no-pagado" }
      ]
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
      this.getSimples(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getSimples(1, this.searchData);
    },
    goPage(page) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: page,
        section: "simples"
      });
      this.getSimples(page, this.searchData);
    },
    updateItem(item) {
      this.payment_modal_visible = false;
      let i = this.items.find(i => i.id === item.paymentable_id);
      let index = this.items.indexOf(i);
      this.items[index].payment_amount =
        this.items[index].payment_amount + parseFloat(item.amount);
      this.payment_modal_visible = false;
    },
    payout(total, payment_amount) {
      return total > payment_amount ? false : true;
    },
    newSimple() {
      this.$router.push({ name: "new-simple" });
    },
    getSimples(page = 1, search = {}) {
      this.loading = true;
      simplesService
        .getSimples(page, search)
        .then(res => {
          this.items = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
          /*this.$notify({
          title: 'Problema',
          message: error.message,
          type: 'error',
        });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: error.message,
            type: "error"
          });
        });
    },
    closeModal(data) {
      this.payment_modal_visible = false;
    },
    listAction(command) {
      switch (command.command) {
        case "pay":
          this.payment_modal_visible = true;
          this.data_modal = command.payload;
          break;
        case "nc":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nc",
              document_type: "simple",
              document_id: command.payload.id
            }
          });
          break;
        case "nd":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nd",
              document_type: "simple",
              document_id: command.payload.id
            }
          });
          break;
        case "clone":
          this.$router.push({
            name: "new-clone",
            params: {
              document_type: "simple",
              document_id: command.payload.id
            }
          });
          break;
      }
    }
  },
  components: {
    CalcPrice,
    PaymentModal,
    StatusPayment,
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
    this.getSimples(this.datatable_current_page.simples);
  }
};
</script>

<style></style>

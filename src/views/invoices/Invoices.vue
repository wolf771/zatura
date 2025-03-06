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
              <!-- <h4 class="font-weight-bold">Lista de facturas</h4> -->
              <search-filter
                :perPage="perPage"
                :options="optionsFilter"
                @executeSearch="search"
              ></search-filter>
            </div>

            <vs-button type="gradient" @click="newInvoice()">
              <i class="fa fa-plus"></i>
              Nueva factura
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
                <vs-th>Monto pagado</vs-th>
                <vs-th>Estado</vs-th>
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
                          params: { type: 'invoice', id: item.id }
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
                    <vs-td>
                      <calc-price
                        :price="item.payment_amount"
                        :currency="item.currency_id"
                        :exchange_rate="1"
                      ></calc-price>
                    </vs-td>
                    <vs-td class="d-flex position-relative">
                      <div>
                        <status-payment
                          :total="item.total"
                          :payment_amount="item.payment_amount"
                          :hacienda="item.hacienda"
                          :note_totals="item.note_totals"
                        >
                        </status-payment>
                      </div>
                      <br />
                      <div
                        style="padding-top:8px"
                        v-if="
                          item.payment_amount < item.total &&
                            item.note_totals.ncs.nc_total < item.total
                        "
                      >
                        <small
                          class="text-danger"
                          v-if="item.expiration_date.substr(0, 10) < today"
                        >
                          Vencida hace {{ item.days_expiration }}
                          {{ item.days_expiration > 1 ? "dias" : "dia" }}
                        </small>
                        <small
                          class="text-warning"
                          v-if="item.expiration_date.substr(0, 10) == today"
                        >
                          Vence hoy
                        </small>
                      </div>
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
                          <el-dropdown-item
                            v-if="item.total > item.payment_amount"
                            :command="{
                              command: 'pay',
                              payload: { item: item }
                            }"
                            class="text-info"
                          >
                            <i class="fa fa-money-bill-alt"></i>
                            Pagar
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="
                              invoiceExpiration(item.expiration_date) &&
                                item.payment_amount < item.total
                            "
                            :command="{
                              command: 'rp',
                              payload: { item: item }
                            }"
                            class="text-warning"
                          >
                            <i class="fa fa-envelope-open-text"></i>
                            Recordatorio de pago
                            {{
                              item.number_sent_remember_payment > 0
                                ? "(" + item.number_sent_remember_payment + ")"
                                : ""
                            }}
                          </el-dropdown-item>
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
                          <el-dropdown-item
                            :command="{
                              command: 'recurring',
                              payload: { id: item.id }
                            }"
                            class="text-primary"
                          >
                            <i class="fa fa-clone"></i>
                            Hacer recurrente
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              command: 'send-email',
                              payload: { item: item }
                            }"
                            class="text-primary"
                          >
                            <i class="fa fa-envelope"></i>
                            Enviar por correo
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
            <p>No hay Facturas</p>
          </div>
        </div>
      </div>
    </div>
    <payment-modal
      @paymentExecuted="updateItem"
      @closeModal="closeModal"
      :data="data_modal"
      :vis="payment_modal_visible"
    ></payment-modal>
    <payment-remember-modal
      @closeModal="closeModal"
      :dataEmail="data_modal"
      :visible="show_modal_payment_remember"
    ></payment-remember-modal>
    <send-email-modal
      @emailSent="closeSendEmailModal"
      :vis="show_send_email"
      :dataEmail="dataModalSendEmail"
      @closeModal="closeSendEmailModal"
      :loading="emailSending"
      :status="emailStatus"
    ></send-email-modal>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import invoicesService from "@/services/invoices.service";
import PaymentModal from "@/components/PaymentModal.vue";
import PaymentRememberModal from "@/components/PaymentRememberModal.vue";
import SendEmailModal from "@/components/SendEmailModal.vue";
import StatusPayment from "@/components/StatusPayment.vue";
import StatusHacienda from "@/components/StatusHacienda.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import momentjs from "moment";
import { mapState } from "vuex";

export default {
  name: "invoices",
  data() {
    return {
      today: "",
      items: [],
      loading: false,
      payment_modal_visible: false,
      show_modal_payment_remember: false,
      show_send_email: false,
      emailSending: false,
      emailStatus: '',
      data_modal: {},
      searchData: {},
      currentPage: 1,
      pageCount: 0,
      perPage: 10,
      page: 1,
      dataModalSendEmail: {
        email: "",
        subject: "",
        body: "",
        files: [],
        type: "",
        document: ""
      },
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
    invoiceExpiration(expiration_date) {
      let expiration_date_format = this.$options.filters.moment(
        expiration_date,
        "YYYY-MM-DD"
      );
      if (expiration_date_format <= momentjs().format("YYYY-MM-DD")) {
        return true;
      } else {
        return false;
      }
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getInvoices(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getInvoices(1, this.searchData);
    },
    goPage(page) {
      this.currentPage = page;
      this.getInvoices(page, this.searchData);
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: page,
        section: "invoices"
      });
    },
    updateItem(item) {
      this.payment_modal_visible = false;
      let i = this.items.find(i => i.id === item.paymentable_id);
      let index = this.items.indexOf(i);
      this.items[index].payment_amount =
        this.items[index].payment_amount + parseFloat(item.amount);
      this.items[index].due = item.due;
      this.payment_modal_visible = false;
    },
    payout(total, payment_amount) {
      return total > payment_amount ? false : true;
    },
    newInvoice() {
      this.$router.push({ name: "new-invoice" });
    },
    getInvoices(page = 1, search = {}) {
      this.loading = true;
      invoicesService
        .getInvoices(page, search)
        .then(res => {
          this.items = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: error.message,
            type: "error"
          });
        });
    },
    closeModal(data) {
      this.payment_modal_visible = false;
      this.show_modal_payment_remember = false;
      this.show_send_email = false;
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
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "nd":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nd",
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "clone":
          this.$router.push({
            name: "new-clone",
            params: {
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "recurring":
          this.$router.push({
            name: "new-recurring",
            params: {
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        //recordatorio de pago
        case "rp":
          this.show_modal_payment_remember = true;
          this.data_modal = command.payload;
          break;
        case "send-email":
          this.sendEmail(command.payload.item);
          break;
      }
    },
    sendEmail(transaction) {
      this.show_send_email = true;
      this.dataModalSendEmail = {
        email: transaction.client.email,
        subject: `Factura #${transaction.reference}`,
        body: `Estimado/a ${transaction.client.name}, adjunto a este correo encontrará la factura #${transaction.reference}.`,
        files: [],
        type: 'invoice',
        document: transaction
      };
    },
    closeSendEmailModal() {
      this.show_send_email = false;
    },
    async sendEmailHandler() {
      this.emailSending = true;
      this.emailStatus = 'Conectando con servidor de correo...';

      // Simular una llamada a la API de envío de correo
      setTimeout(() => {
        this.emailStatus = 'Enviando tu correo...';
        setTimeout(() => {
          this.emailStatus = 'Enviado';
          this.emailSending = false;
          this.closeSendEmailModal();
        }, 2000);
      }, 2000);
    }
  },
  components: {
    CalcPrice,
    PaymentModal,
    StatusPayment,
    StatusHacienda,
    SearchFilter,
    RegistersPerPage,
    PaymentRememberModal,
    SendEmailModal
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getInvoices(this.datatable_current_page.invoices);
    this.today = momentjs().format("YYYY-MM-DD");
  }
};
</script>

<style></style>
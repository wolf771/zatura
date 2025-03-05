<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body">
          <div
            class="px-5"
            style="height:60px"
            v-show="loading || loading_excel"
          >
            <div
              v-loading="loading"
              element-loading-text="Preparando tu reporte..."
            ></div>
            <div
              style="width:100%"
              v-loading="loading_excel"
              element-loading-text="Preparando excel..."
            ></div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- <h4 class="font-weight-bold">Reporte de tiquetes</h4> -->
              <el-date-picker
                @change="changeRangeDates"
                v-model="rangeDates"
                type="daterange"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                range-separator="|"
                start-placeholder="Fecha inicial"
                end-placeholder="Fecha final"
              >
              </el-date-picker>
              <search-filter
                class="ml-1"
                @executeSearch="search"
              ></search-filter>
            </div>

            <!-- <vs-button @click.prevent="downloadExcel()">
            <i class="fa fa-file-excel mr-1"></i>
            Exportar Excel
          </vs-button> -->
            <download-excel
              class="vs-component vs-button vs-button-primary vs-button-filled"
              :data="json_data"
              name="reporte_tiquetes.xls"
              :title="title_report"
              :fetch="downloadExcel"
            >
              <i class="fa fa-file-excel mr-1"></i>
              Exportar Excel
            </download-excel>
          </div>

          <div class="row p-10 text-center">
            <div class="col">
              <div class="font-weight-bold">{{ quantity_docs }}</div>
              <div class="text-primary">Cantidad</div>
            </div>
            <div class="col">
              <div class="font-weight-bold">
                {{ subtotal_amount | currency }}
              </div>
              <div class="text-primary">Subtotal Ventas</div>
            </div>
            <div class="col">
              <div class="font-weight-bold">
                {{ discount_amount | currency }}
              </div>
              <div class="text-primary">Descuentos</div>
            </div>
            <div class="col">
              <div class="font-weight-bold">{{ tax_amount | currency }}</div>
              <div class="text-primary">IVA</div>
            </div>
            <div class="col">
              <div class="font-weight-bold">
                {{ iva_devuelto_amount | currency }}
              </div>
              <div class="text-primary">IVA Devuelto</div>
            </div>
            <div class="col">
              <div class="font-weight-bold">
                {{
                  (subtotal_amount -
                    discount_amount +
                    tax_amount -
                    iva_devuelto_amount)
                    | currency
                }}
              </div>
              <div class="text-primary">Total Neto</div>
            </div>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th sort-key="reference">Consecutivo</vs-th>
                <vs-th>Cliente</vs-th>
                <vs-th>Cédula Cliente</vs-th>
                <vs-th sort-key="created_at">Fecha</vs-th>
                <vs-th>NC</vs-th>
                <vs-th>ND</vs-th>
                <vs-th>Subtotal</vs-th>
                <vs-th>Descuento</vs-th>
                <vs-th>IVA</vs-th>
                <vs-th>Iva Devuelto</vs-th>
                <vs-th>Total</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="item.id"
                    v-for="(item, index) in data"
                  >
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
                        class="link"
                        :to="{
                          name: 'client-detail',
                          params: { id: item.client.id }
                        }"
                      >
                        {{ item.client.name | truncateText(0, 25) }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      {{ item.client.identification }}
                    </vs-td>
                    <vs-td>{{ item.created_at | moment("DD/MM/YYYY") }}</vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.note_totals.ncs.nc_total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.note_totals.nds.nd_total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="
                          item.subtotal +
                            item.note_totals.nds.nd_subtotal -
                            item.note_totals.ncs.nc_subtotal
                        "
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="
                          item.discount +
                            item.note_totals.nds.nd_discount -
                            item.note_totals.ncs.nc_discount
                        "
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="
                          item.tax +
                            item.note_totals.nds.nd_tax -
                            item.note_totals.ncs.nc_tax
                        "
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="
                          item.iva_devuelto +
                            item.note_totals.nds.nd_iva_devuelto -
                            item.note_totals.ncs.nc_iva_devuelto
                        "
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="
                          item.total -
                            item.iva_devuelto +
                            (item.note_totals.nds.nd_total -
                              item.note_totals.nds.nd_iva_devuelto) -
                            (item.note_totals.ncs.nc_total -
                              item.note_totals.ncs.nc_iva_devuelto)
                        "
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>

          <div
            class="col-md-12 text-center"
            v-if="!loading && items.length == 0"
          >
            <p>No hay tiquetes</p>
          </div>
          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import StatusPayment from "@/components/StatusPayment.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import reportsService from "@/services/reports.service";
import helpers from "@/helpers/helpers";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "report-Tickets",
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
      rangeDates: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        moment()
          .endOf("month")
          .format("YYYY-MM-DD")
      ],
      json_data: [],
      loading_excel: false,
      subtotal_amount: 0,
      tax_amount: 0,
      discount_amount: 0,
      iva_devuelto_amount: 0,
      quantity_docs: 0,
      checkedDefaultOptions: ["rechazado"],
      title_report: ""
    };
  },
  computed: {
    ...mapState(["current_currency", "company_default"])
  },
  methods: {
    search(search) {
      this.searchData = search;
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.getReportTickets(1, this.searchData);
    },
    changeRangeDates() {
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.getReportTickets(1, this.searchData, this.rangeDates);
    },
    goPage(page) {
      this.getReportTickets(page, this.searchData);
    },
    async downloadExcel() {
      let search = this.searchData;
      let exist_registers = true;
      this.skip = 0;
      this.json_data = [];
      this.loading_excel = true;
      let dates = this.rangeDates;

      this.title_report = [
        `${this.company_default.name}`,
        "Reporte de tiquetes",
        `Fechas: desde ${moment(dates[0]).format("DD-MM-YYYY")} hasta ${moment(
          dates[1]
        ).format("DD-MM-YYYY")}`,
        `Moneda: ${this.current_currency.name}`
      ];

      try {
        while (exist_registers) {
          search.skip = this.skip;
          let report_data = await this.getSkipRegisters(1, search);
          let items = report_data;

          if (items.length > 0) {
            this.skip = this.skip + 100;
          } else {
            exist_registers = false;
          }
        }
        this.loading_excel = false;

        let tax = this.tax_amount;
        let iva_devuelto = this.iva_devuelto_amount;
        let discount = this.discount_amount;
        let subtotal = this.subtotal_amount;
        let total =
          this.subtotal_amount -
          this.discount_amount +
          this.tax_amount -
          this.iva_devuelto_amount;

        this.json_data.push({
          "": "",
          "": "",
          "": "",
          "": "",
          ND: "Totales",
          subtotal: `${helpers.formatPrice(subtotal)}`,
          descuento: `${helpers.formatPrice(discount)}`,
          IVA: `${helpers.formatPrice(tax)}`,
          "IVA Devuelto": `${helpers.formatPrice(iva_devuelto)}`,
          total: `${helpers.formatPrice(total)}`
        });

        return this.json_data;
      } catch (error) {
        this.loading_excel = false;
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
      }
    },
    getReportTickets(page = 1, search = {}) {
      this.loading = true;
      this.searchData = search;
      this.searchData.rangeDates = this.rangeDates.join(",");

      reportsService
        .getReportTickets(page, search)
        .then(res => {
          this.loading = false;
          this.pageCount = res.data.documents.last_page;
          this.page = res.data.documents.current_page;
          this.items = res.data.documents.data;
          this.subtotal_amount = res.data.subtotal_amount;
          this.tax_amount = res.data.tax_amount;
          this.discount_amount = res.data.discount_amount;
          this.iva_devuelto_amount = res.data.iva_devuelto_amount;
          this.quantity_docs = res.data.documents.total;
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
    async getSkipRegisters(page, search) {
      try {
        let datos = await reportsService.getReportTicketsSkip(page, search);
        let items = datos.data;
        items.forEach(i => {
          let el = {
            consecutivo: `${i.reference}`,
            "consecutivo hacienda": `# ${i.key50digits.substring(21, 41)}`,
            cliente: i.client.name,
            "cedula cliente": i.client.identification,
            fecha: moment(i.created_at).format("DD-MM-YYYY"),
            NC: helpers
              .calculated_price_no_symbol(
                i.note_totals.ncs.nc_total,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            ND: helpers
              .calculated_price_no_symbol(
                i.note_totals.nds.nd_total,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            subtotal: helpers
              .calculated_price_no_symbol(
                i.subtotal +
                  i.note_totals.nds.nd_subtotal -
                  i.note_totals.ncs.nc_subtotal,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            descuento: helpers
              .calculated_price_no_symbol(
                i.discount +
                  i.note_totals.nds.nd_discount -
                  i.note_totals.ncs.nc_discount,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            IVA: helpers
              .calculated_price_no_symbol(
                i.tax + i.note_totals.nds.nd_tax - i.note_totals.ncs.nc_tax,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            "IVA Devuelto": helpers
              .calculated_price_no_symbol(
                i.iva_devuelto +
                  i.note_totals.nds.nd_iva_devuelto -
                  i.note_totals.ncs.nc_iva_devuelto,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            total: helpers
              .calculated_price_no_symbol(
                i.total -
                  i.iva_devuelto +
                  (i.note_totals.nds.nd_total -
                    i.note_totals.nds.nd_iva_devuelto) -
                  (i.note_totals.ncs.nc_total -
                    i.note_totals.ncs.nc_iva_devuelto),
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", ".")
          };
          this.json_data.push(el);
        });
        return items;
      } catch (error) {
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
      }
    }
  },
  components: {
    CalcPrice,
    StatusPayment,
    SearchFilter
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getReportTickets();
  }
};
</script>

<style scoped></style>

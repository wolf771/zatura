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
              <!-- <h4 class="font-weight-bold">Reporte de facturas</h4> -->
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

              <el-select
                placeholder=""
                v-model="filter"
                name="client"
                v-validate="'required'"
                style="width: 80px"
                @change="filterChange"
              >
                <el-option label="Todo" value="all"></el-option>
                <el-option label="NCS" value="ncs"></el-option>
                <el-option label="NDS" value="nds"></el-option>
              </el-select>

              <search-filter
                class="ml-1"
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>

            <!-- <vs-button @click.prevent="downloadExcel()">
            <i class="fa fa-file-excel mr-1"></i>
            Exportar Excel
          </vs-button> -->
            <download-excel
              class="vs-component vs-button vs-button-primary vs-button-filled"
              :data="json_data"
              name="reporte_facturas.xls"
              :title="title_report"
              :fetch="downloadExcel"
            >
              <i class="fa fa-file-excel mr-1"></i>
              Exportar Excel
            </download-excel>
          </div>

          <!-- NCS Totals -->
          <div v-if="filter === 'all' || filter === 'ncs'">
            <h4 class="pt-5">Notas de credito</h4>
            <div class="row text-center">
              <div class="col">
                <div class="font-weight-bold">{{ quantity_ncs }}</div>
                <div class="text-primary">Cantidad</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ subtotal_ncs | currency }}
                </div>
                <div class="text-primary">Subtotal</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ discount_ncs | currency }}
                </div>
                <div class="text-primary">Descuentos</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">{{ tax_ncs | currency }}</div>
                <div class="text-primary">IVA</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ iva_devuelto_ncs | currency }}
                </div>
                <div class="text-primary">IVA Devuelto</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{
                    (subtotal_ncs - discount_ncs + tax_ncs - iva_devuelto_ncs)
                      | currency
                  }}
                </div>
                <div class="text-primary">Total Neto</div>
              </div>
            </div>
          </div>
          <hr />
          <!-- NDS Totals -->
          <div v-if="filter === 'all' || filter === 'nds'">
            <h4 class="pt-1">Notas de debito</h4>
            <div class="row text-center pb-5">
              <div class="col">
                <div class="font-weight-bold">{{ quantity_nds }}</div>
                <div class="text-primary">Cantidad</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ subtotal_nds | currency }}
                </div>
                <div class="text-primary">Subtotal</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ discount_nds | currency }}
                </div>
                <div class="text-primary">Descuentos</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">{{ tax_nds | currency }}</div>
                <div class="text-primary">IVA</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{ iva_devuelto_nds | currency }}
                </div>
                <div class="text-primary">IVA Devuelto</div>
              </div>
              <div class="col">
                <div class="font-weight-bold">
                  {{
                    (subtotal_nds - discount_nds + tax_nds - iva_devuelto_nds)
                      | currency
                  }}
                </div>
                <div class="text-primary">Total Neto</div>
              </div>
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
                <vs-th sort-key="type">Tipo</vs-th>
                <vs-th>Pertenece a</vs-th>
                <vs-th>Cliente</vs-th>
                <vs-th>Cédula Cliente</vs-th>
                <vs-th sort-key="created_at">Fecha</vs-th>
                <vs-th sort-key="subtotal">Subtotal</vs-th>
                <vs-th sort-key="discount">Descuento</vs-th>
                <vs-th sort-key="tax">IVA</vs-th>
                <vs-th sort-key="iva_devuelto">Iva Devuelto</vs-th>
                <vs-th>Total</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="item.id"
                    v-for="(item, indextr) in data"
                  >
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'note', id: item.id }
                        }"
                      >
                        {{ item.reference }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      {{ item.type.toUpperCase() }}
                    </vs-td>
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: {
                            type:
                              item.documentable_type === 'App\\Invoice'
                                ? 'invoice'
                                : 'ticket',
                            id: item.documentable.id
                          }
                        }"
                      >
                        {{ on_document(item.documentable_type)
                        }}{{ item.documentable.reference }}
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
                        {{ item.client.name | truncateText(0, 25) }}
                      </router-link>
                      <span v-else>
                        {{ item.client.name | truncateText(0, 25) }}
                      </span>
                    </vs-td>
                    <vs-td>
                      {{ item.client.identification }}
                    </vs-td>
                    <vs-td>{{ item.created_at | moment("DD/MM/YYYY") }}</vs-td>
                    <!-- <td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.note_totals.ncs.nc_total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </td>
                    <td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.note_totals.nds.nd_total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </td> -->
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.subtotal"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.discount"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.tax"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.iva_devuelto"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :if_calculate="true"
                        :price="item.total - item.iva_devuelto"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
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
            v-if="!loading && items.length == 0"
          >
            <p>No hay notas</p>
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
  name: "report-Invoices",
  data() {
    return {
      filter: "all",
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
      subtotal_ncs: 0,
      tax_ncs: 0,
      discount_ncs: 0,
      iva_devuelto_ncs: 0,
      quantity_ncs: 0,
      quantity_nds: 0,
      subtotal_nds: 0,
      tax_nds: 0,
      discount_nds: 0,
      iva_devuelto_nds: 0,
      checkedDefaultOptions: ["rechazado"],
      title_report: ""
    };
  },
  computed: {
    ...mapState(["current_currency", "company_default"])
  },
  methods: {
    filterChange() {
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.searchData.filter = this.filter;
      this.getReportNotes(1, this.searchData, this.rangeDates);
    },
    on_document(type) {
      let on_document = "FEC-";
      if (type === "App\\Invoice") {
        on_document = "FE-";
      } else if (type === "App\\Ticket") {
        on_document = "TE-";
      }
      return on_document;
    },
    search(search) {
      this.searchData = search;
      this.searchData.filter = this.filter;
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.getReportNotes(1, this.searchData);
    },
    changeRangeDates() {
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.searchData.filter = this.filter;
      this.getReportNotes(1, this.searchData, this.rangeDates);
    },
    goPage(page) {
      this.getReportNotes(page, this.searchData);
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
        "Reporte de notas",
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
        this.$message({
          showClose: true,
          message: error.message,
          type: "error"
        });
      }
    },
    getReportNotes(page = 1, search = {}) {
      this.loading = true;
      this.searchData = search;
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.searchData.filter = this.filter;

      reportsService
        .getReportNotes(page, search)
        .then(res => {
          this.loading = false;
          this.pageCount = res.data.documents.last_page;
          this.page = res.data.documents.current_page;
          this.items = res.data.documents.data;
          this.subtotal_ncs = res.data.subtotal_ncs;
          this.tax_ncs = res.data.tax_ncs;
          this.discount_ncs = res.data.discount_ncs;
          this.iva_devuelto_ncs = res.data.iva_devuelto_ncs;
          this.quantity_ncs = res.data.quantity_ncs;
          this.quantity_nds = res.data.quantity_nds;
          this.subtotal_nds = res.data.subtotal_nds;
          this.tax_nds = res.data.tax_nds;
          this.discount_nds = res.data.discount_nds;
          this.iva_devuelto_nds = res.data.iva_devuelto_nds;
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
    async getSkipRegisters(page, search) {
      try {
        let datos = await reportsService.getReportNotesSkip(page, search);
        let items = datos.data;
        items.forEach(i => {
          console.log(i);
          let el = {
            consecutivo: `${i.reference}`,
            "consecutivo hacienda": `# ${i.key50digits.substring(21, 41)}`,
            tipo: i.type.toUpperCase(),
            "pertenece a": `${this.on_document(i.documentable_type)} ${
              i.documentable.reference
            }`,
            cliente: i.client.name,
            "cedula cliente": i.client.identification,
            fecha: moment(i.created_at).format("DD-MM-YYYY"),
            subtotal: helpers
              .calculated_price_no_symbol(
                i.subtotal,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            descuento: helpers
              .calculated_price_no_symbol(
                i.discount,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            IVA: helpers
              .calculated_price_no_symbol(
                i.tax,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            "IVA Devuelto": helpers
              .calculated_price_no_symbol(
                i.iva_devuelto,
                i.exchange_rate,
                i.currency_id,
                this.current_currency.id,
                this.current_currency.id
              )
              .replaceAll(".", "")
              .replaceAll(",", "."),
            total: helpers
              .calculated_price_no_symbol(
                i.total,
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
        console.log(error);
        this.loading = false;
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
    this.getReportNotes();
  }
};
</script>

<style scoped></style>

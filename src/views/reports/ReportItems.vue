<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- <h4 class="font-weight-bold">Reporte de productos</h4> -->
              <search-filter
                :options="[]"
                @executeSearch="search"
              ></search-filter>
            </div>
            <vs-button @click.prevent="downloadExcel()">
              <i class="fa fa-file-excel mr-1"></i>
              Exportar Excel
            </vs-button>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="items.length" :data="items">
              <template slot="thead">
                <vs-th sort-key="code">Código</vs-th>
                <vs-th>Descripción</vs-th>
                <vs-th>Facturado</vs-th>
                <vs-th>Subtotal</vs-th>
                <vs-th>Descuento</vs-th>
                <vs-th>IVA</vs-th>
                <vs-th>Total</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="index"
                    v-for="(item, index) in data"
                  >
                    <vs-td>
                      {{ item.code }}
                    </vs-td>
                    <vs-td>
                      {{ item.name }}
                    </vs-td>
                    <vs-td>{{ item.invoiced }} veces</vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.all_totals.subtotal"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.all_totals.discount"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.all_totals.tax"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.all_totals.total"
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
            <p>No hay items</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import reportsService from "@/services/reports.service";
import helpers from "@/helpers/helpers";
import moment from "moment";

export default {
  name: "report-tickets",
  data() {
    return {
      items: [],
      loading: false,
      payment_modal_visible: false,
      data_modal: {},
      searchData: {},
      rangeDates: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        moment()
          .endOf("month")
          .format("YYYY-MM-DD")
      ]
    };
  },
  methods: {
    search(search) {
      this.searchData = search;
      this.searchData.rangeDates = this.rangeDates.join(",");
      this.getReportItems(1, this.searchData);
    },
    downloadExcel() {
      reportsService
        .downloadExcelReportItems(this.searchData)
        .then(res => {
          helpers.downloadBlob(res.data, "reporte-productos.xls");
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
        });
    },
    goPage(page) {
      this.getReportItems(page, this.searchData);
    },
    getReportItems(page = 1, search = {}) {
      this.loading = true;
      this.searchData = search;
      this.searchData.rangeDates = this.rangeDates.join(",");
      reportsService
        .getReportItems(page, search)
        .then(res => {
          this.items = res.data;
          this.loading = false;
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
    }
  },
  components: {
    CalcPrice,
    SearchFilter
  },
  created() {
    this.getReportItems();
  }
};
</script>

<style scoped></style>

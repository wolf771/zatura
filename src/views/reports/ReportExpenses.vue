<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <el-date-picker
                @change="changeExpensesYear"
                v-model="expenses_year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="Año"
              />
              <!-- <h4 class="font-weight-bold">Informe de gastos</h4> -->
              <search-filter
                :options="optionsFilter"
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
                <vs-th>Categoria</vs-th>
                <vs-th>Enero</vs-th>
                <vs-th>Febrero</vs-th>
                <vs-th>Marzo</vs-th>
                <vs-th>Abril</vs-th>
                <vs-th>Mayo</vs-th>
                <vs-th>Junio</vs-th>
                <vs-th>Julio</vs-th>
                <vs-th>Agosto</vs-th>
                <vs-th>Septiembre</vs-th>
                <vs-th>Octubre</vs-th>
                <vs-th>Noviembre</vs-th>
                <vs-th>Diciembre</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="item.id"
                    v-for="(item, index) in data"
                  >
                    <vs-td class="text-info font-weight-bold">{{
                      item.name
                    }}</vs-td>
                    <vs-td v-for="(m, i) in item.months" :key="i">
                      <b class="mr-1">{{ current_currency.symbol }}</b
                      >{{ parseFloat(m).toFixed(2) }}
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
            <p>No hay Gastos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatusPayment from "@/components/StatusPayment.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import reportsService from "@/services/reports.service";
import helpers from "@/helpers/helpers";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "report-invoices",
  data() {
    return {
      expenses_year: moment().format("YYYY"),
      items: [],
      loading: false,
      data_modal: {},
      searchData: {},
      optionsFilter: [],
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
  computed: {
    ...mapState(["current_currency"])
  },
  methods: {
    changeExpensesYear(year) {
      if (!year) {
        this.expenses_year = moment().format("YYYY");
      }
      this.getReportExpenses(1, this.searchData, this.expenses_year);
    },
    search(search) {
      this.searchData = search;
      //this.searchData.rangeDates = this.rangeDates.join(",");
      this.searchData.expenses_year = this.expenses_year;
      this.getReportExpenses(1, this.searchData);
    },
    changeRangeDates() {
      this.searchData.expenses_year = this.expenses_year;
      this.getReportExpenses(1, this.searchData, this.expenses_year);
    },
    goPage(page) {
      this.getReportExpenses(page, this.searchData);
    },
    downloadExcel() {
      reportsService
        .downloadExcelReportExpenses(1, this.searchData)
        .then(res => {
          helpers.downloadBlob(res.data, "reporte-informe-gastos.xls");
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
    getReportExpenses(page = 1, search = {}) {
      this.loading = true;
      this.searchData = search;
      this.searchData.expenses_year = this.expenses_year;
      reportsService
        .getReportExpenses(page, search)
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
    StatusPayment,
    SearchFilter
  },
  created() {
    this.getReportExpenses();
  }
};
</script>

<style scoped></style>

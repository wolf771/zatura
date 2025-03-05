<template>
  <div id="dashboard-loading" class="vs-con-loading__container">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          :key="chartInvoicesCard.series.length"
          icon="FileTextIcon"
          :statistic="amount_invoices"
          statisticTitle="Facturas"
          type="area"
          :chartData="chartInvoicesCard.series"
          type_report="Facturas"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          :key="chartTicketsCard.series.length"
          icon="FileTextIcon"
          :statistic="amount_tickets"
          statisticTitle="Tiquetes"
          color="warning"
          type="area"
          :chartData="chartTicketsCard.series"
          type_report="Tickets"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          :key="chartIncomesCard.series.length"
          icon="DollarSignIcon"
          :statistic="amount_incomes"
          statisticTitle="Ingresos"
          color="success"
          type="area"
          :chartData="chartIncomesCard.series"
          type_report="Ingresos"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          :key="chartExpensesCard.series.length"
          icon="ShoppingBagIcon"
          :statistic="amount_expenses"
          statisticTitle="Gastos"
          color="danger"
          type="area"
          :chartData="chartExpensesCard.series"
          type_report="Gastos"
        ></statistics-card-line>
      </div>
    </div>
    <!-- <div class="row">
    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="vx-card card card-stats">
        <div class="card-header card-header-rose card-header-icon">
          <div class="card-icon">
            <i class="material-icons">equalizer</i>
          </div>
          <p class="card-category text-rose font-weight-bold">Facturas</p>
          <h4 class="card-title">{{ amount_invoices | currency }}</h4>
        </div>

      </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="vx-card card card-stats">
        <div class="card-header card-header-warning card-header-icon">
          <div class="card-icon">
            <i class="material-icons">equalizer</i>
          </div>
          <p class="card-category text-warning font-weight-bold">Tiquetes</p>
          <h4 class="card-title">{{ amount_tickets | currency }}</h4>

        </div>

      </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="vx-card card card-stats">
        <div class="card-header card-header-success card-header-icon">
          <div class="card-icon">
            <i class="material-icons">equalizer</i>
          </div>
          <p class="card-category text-success font-weight-bold">Notas credito</p>
          <h4 class="card-title">{{ amount_ncs | currency }}</h4>
        </div>

       
      </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="vx-card card card-stats">
        <div class="card-header card-header-danger card-header-icon">
          <div class="card-icon">
            <i class="material-icons">equalizer</i>
          </div>
          <p class="card-category text-danger font-weight-bold">Notas debito</p>
          <h4 class="card-title">{{ amount_nds | currency }}</h4>
        </div>

       
      </div>
    </div>

</div> -->

    <!-- LINE CHART -->
    <!-- md:w-2/3 -->

    
    <div class="vx-col w-full">
      <vx-card title="Ventas por mes">
        <template slot="actions">
          
        </template>
        <div slot="no-body" class="p-6 pb-0">
          <div class="flex">
            <div class="mr-6">
              <p class="mb-1 font-semibold">Mes actual</p>
              <p class="text-2xl text-success">
                {{ totalCurrentMonth | currency }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-semibold">Mes Pasado</p>
              <p class="text-2xl">{{ totalLastMonth | currency }}</p>
            </div>
          </div>
          <vue-apex-charts
            type="area"
            height="220"
            :options="monthChartData.chartOptions"
            :series="monthChartData.series"
          />
        </div>
      </vx-card>
    </div>

    <div class="row mt-5">
      <div class="col-md-4">
        <!-- <div class="card vx-card">
       
        <div class="card-body">
          <p class="font-weight-bold">Gastos : <span class="text-rose">{{ totalExpenses | currency }}</span></p>
          <pie-chart v-if="areExpenses" :chart-data="expenseChartData"></pie-chart>
          <h4 class="text-center" v-if="!areExpenses">No hay gastos.</h4>
        </div>
      </div> -->

        <!-- CUSTOMERS CHART -->
        <div class="vx-col w-full">
          <vx-card title="Gastos mes actual">
            <!-- SLOT = ACTIONS -->
            <template slot="actions">
              <!-- <change-time-duration-dropdown /> -->
            </template>

            <div slot="no-body" v-if="expenseChartData.series.length > 0">
              <!-- CHART -->
              <vue-apex-charts
                type="pie"
                height="220"
                class="mt-2"
                :options="expenseChartData.chartOptions"
                :series="expenseChartData.series"
              />

              <!-- CHART DATA -->
              <ul class="mb-1" style="height:140px;overflow-y: auto">
                <li
                  v-for="(expen, index) in this.expenses"
                  :key="index"
                  class="flex justify-between py-3 px-6 border border-grey-light border-solid border-r-0 border-l-0 border-b-0"
                >
                  <span class="flex items-center">
                    <span
                      class="inline-block h-3 w-3 rounded-full mr-2"
                      :class="`bg-${expen}`"
                    ></span>
                    <span class="font-semibold d-flex">
                      <div
                        :style="
                          'display:inline-block;margin-right: 10px;border-radius: 50%;height:20px;width:20px;background:' +
                            expenseChartData.chartOptions.colors[index]
                        "
                      ></div>
                      <span>{{ expen.name }}</span>
                    </span>
                  </span>
                  <span>{{ expen.total | currency }}</span>
                </li>
              </ul>
            </div>
            <div v-else>
              <p class="text-center">Este mes no has registrado gastos.</p>
            </div>
          </vx-card>
        </div>
      </div>
      <div class="col-md-8">
        <!-- <div class="card vx-card">
       
        <div class="card-body">
          <p class="font-weight-bold">Ingresos vs Gastos</p>
          <bar-vertical :chart-data="expensesVsIncomesData"></bar-vertical>
        </div>
      </div> -->

        <div class="vx-col w-full mb-base">
          <vx-card title="Ingresos vs Gastos">
            <div class="flex">
              <span class="flex items-center"
                ><div class="h-3 w-3 rounded-full mr-1 bg-primary"></div>
                <span>Ingresos</span></span
              >
              <span class="flex items-center ml-4"
                ><div class="h-3 w-3 rounded-full mr-1 bg-danger"></div>
                <span>Gastos</span></span
              >
            </div>
            <vue-apex-charts
              type="bar"
              height="277"
              :options="expensesVsIncomesData.chartOptions"
              :series="expensesVsIncomesData.series"
            />
          </vx-card>
        </div>
      </div>
    </div>

    <!-- modal de bienvenida -->

    <vs-popup
      v-if="isAdvertisementActive"
      :title="advertisement_welcome.title"
      :active.sync="centerDialogVisible"
    >
      <div style="width:100%;display:block;text-align:center;">
        <div
          v-html="advertisement_welcome.content"
          style="word-break:keep-all;"
        ></div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
  </span> -->
    </vs-popup>

    <!-- end modal bienvenida -->
  </div>
</template>

<script>
import dashboardService from "@/services/dashboard.service";
import utilitiesService from "@/services/utilities.service";
import LineChart from "@/components/charts/LineChart.vue";
import PieChart from "@/components/charts/PieChart.vue";
import BarVertical from "@/components/charts/BarVertical.vue";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import VueApexCharts from "vue-apexcharts";
import { mapState } from "vuex";

export default {
  name: "dashboard",
  components: {
    LineChart,
    PieChart,
    BarVertical,
    StatisticsCardLine,
    VueApexCharts
  },
  data() {
    return {
      centerDialogVisible: false,
      advertisement_welcome: {},
      amount_invoices: 0,
      amount_tickets: 0,
      amount_expenses: 0,
      amount_incomes: 0,
      monthChartData: {
        series: [],
        chartOptions: {}
      },
      expenseChartData: {
        series: [],
        chartOptions: {},
        analyticsData: []
      },
      expensesVsIncomesData: {
        series: [],
        chartOptions: {}
      },
      areExpenses: [],
      totalExpenses: 0,
      totalCurrentMonth: 0,
      totalLastMonth: 0,
      expenses: [],
      chartInvoicesCard: {
        series: []
      },
      chartTicketsCard: {
        series: []
      },
      chartIncomesCard: {
        series: []
      },
      chartExpensesCard: {
        series: []
      }
    };
  },
  computed: {
    ...mapState(["current_currency", "user"]),
    isAdvertisementActive() {
      return parseInt(this.advertisement_welcome.active) == 1;
    }
  },
  methods: {
    async getAdvertisement() {
      try {
        let res = await utilitiesService.getAdvertisementAdmin();
        this.advertisement_welcome = res.data;
        if (this.user.advertisement != this.advertisement_welcome.code) {
          this.centerDialogVisible = true;
        }
      } catch (err) {
        // this.$notify({
        //   type: "error",
        //   title: err
        // })
      }
    },
    formatPrice(amount, decimalCount = 2, decimal = ",", thousands = ".") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    },
    closeWelcome() {
      this.centerDialogVisible = false;
      if (this.user.advertisement != this.advertisement_welcome.code) {
        utilitiesService
          .updateAdvertisementCodeUser(this.advertisement_welcome.code)
          .then(res => {
            console.log("listo");
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    getDashboard() {
      this.$vs.loading({
        color: "rgb(118, 0, 228)",
        container: "#dashboard-loading",
        scale: 1.5,
        type: "radius",
        text: "Cargando"
      });

      dashboardService
        .getDashboard()
        .then(res => {

          this.$vs.loading.close("#dashboard-loading > .con-vs-loading");
          this.amount_invoices = res.data.amount_invoices;
          this.amount_tickets = res.data.amount_tickets;
          this.amount_expenses = res.data.amount_expenses;
          this.amount_incomes = res.data.amount_incomes;

          let expenses = res.data.expenses;

          let expensesNames = [];
          let expensesValues = [];

          this.expenses = expenses;

          expenses.forEach(element => {
            expensesNames.push(element.name);
            expensesValues.push(element.total);
          });

          this.areExpenses = expensesValues.length ? true : false;
          this.totalExpenses = expensesValues.reduce(function(a, b) {
            return parseFloat(parseFloat(a) + parseFloat(b));
          }, 0);

          expensesValues = expensesValues.map(v => parseFloat(v));
          expensesValues = expensesValues.map(v => Math.round(v * 100) / 100);
          

          //datos para los 4 graficos de la parte de arriba del dashboard

          this.chartIncomesCard.series = res.data.payments_per_day
          this.chartTicketsCard.series = res.data.tickets_per_day
          this.chartInvoicesCard.series = res.data.invoices_per_day
          this.chartExpensesCard.series = res.data.expenses_per_day

          /*
          las comprobaciones siguientes se hacen porque si viene solo un registro
          el grafico tiene punto de inicio pero no tiene punto final.
          entonces se le hace un push a cada arreglo de un elemento con datos vacios
          */
          if (this.chartIncomesCard.series.length === 1) {
            this.chartIncomesCard.series.push({
              date: '',
              total: 0
            })
          }
          if (this.chartTicketsCard.series.length === 1) {
            this.chartTicketsCard.series.push({
              date: '',
              total: 0
            })
          }
          if (this.chartInvoicesCard.series.length === 1) {
            this.chartInvoicesCard.series.push({
              date: '',
              total: 0
            })
          }
          if (this.chartExpensesCard.series.length === 1) {
            this.chartExpensesCard.series.push({
              date: '',
              total: 0
            })
          }

          this.expenseChartData = {
            analyticsData: this.expenses,
            series: expensesValues,
            chartOptions: {
              labels: expensesNames,
              dataLabels: {
                enabled: false
              },
              tooltip: {
                y: {
                  formatter: value => {
                    return `${this.current_currency.symbol} ${this.formatPrice(
                      value
                    )}`;
                  }
                }
              },
              legend: { show: false },
              chart: {
                type: "pie",
                dropShadow: {
                  enabled: false,
                  blur: 5,
                  left: 1,
                  top: 1,
                  opacity: 0.2
                },
                toolbar: {
                  show: false
                }
              },
              stroke: {
                width: 5
              },
              colors: [
                "#7961F9",
                "#FF9F43",
                "#EA5455",
                "#1f56e0",
                "#e01fcf",
                "#efb12c",
                "#505050",
                "#c60e0e"
              ],
              fill: {
                type: "gradient",
                gradient: {
                  gradientToColors: [
                    "#9c8cfc",
                    "#FFC085",
                    "#f29292",
                    "#1f56e0",
                    "#e01fcf",
                    "#efb12c",
                    "#505050",
                    "#c60e0e"
                  ]
                }
              }
            }
          };

          this.monthChartData = {
            series: [
              {
                name: "Mes actual",
                data: res.data.values
              },
              {
                name: "Mes pasado",
                data: res.data.valuesLastMonth
              }
            ],
            chartOptions: {
              chart: {
                toolbar: { show: false }
              },
              stroke: {
                curve: "smooth",
                dashArray: [0, 8],
                width: [4, 2]
              },
              grid: {
                borderColor: "#e7e7e7"
              },
              legend: {
                show: false
              },
              colors: ["#6c61e4", "#b8c2cc"],
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.6,
                  opacityTo: 0.9,
                  stops: [0, 90, 100],
                  type: "horizontal"
                }
              },
              markers: {
                size: 5,
                hover: {
                  size: 10
                }
              },
              xaxis: {
                labels: {
                  style: {
                    cssClass: "text-primary"
                  }
                },
                axisTicks: {
                  show: false
                },
                categories: res.data.days,
                axisBorder: {
                  show: false
                }
              },
              yaxis: {
                tickAmount: 5,
                labels: {
                  style: {
                    cssClass: "text-grey fill-current"
                  },
                  formatter: val => {
                    return `${this.current_currency.symbol} ${this.formatPrice(
                      val
                    )}`;
                  }
                }
              },
              dataLabels: {
                enabled: false
              },
              tooltip: {
                x: { show: false }
              }
            }
          };

          //Total currrent month
          this.totalCurrentMonth = res.data.values.reduce(function(a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0);

          //Total last month
          this.totalLastMonth = res.data.valuesLastMonth.reduce(function(a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0);

          //Expenses vs incomes

          this.expensesVsIncomesData = {
            series: [
              {
                name: "Ingresos",
                data: res.data.incomes_amount_months
              },
              {
                name: "Gastos",
                data: res.data.expenses_amount_months
              }
            ],
            chartOptions: {
              grid: {
                borderColor: "#ebebeb",
                padding: {
                  left: 0,
                  right: 0
                }
              },
              legend: {
                show: false
              },
              dataLabels: {
                enabled: false
              },
              chart: {
                stacked: true,
                type: "bar",
                toolbar: { show: false }
              },
              colors: ["#7367F0", "#EA5455"],
              plotOptions: {
                bar: {
                  columnWidth: "50%"
                }
              },
              xaxis: {
                labels: {
                  style: {
                    cssClass: "text-grey fill-current"
                  }
                },
                axisTicks: {
                  show: false
                },
                categories: res.data.months,
                axisBorder: {
                  show: false
                }
              },
              yaxis: {
                tickAmount: 5,
                labels: {
                  style: {
                    cssClass: "text-gray fill-current"
                  },
                  formatter: value => {
                    return `${this.current_currency.symbol} ${this.formatPrice(
                      value
                    )}`;
                  }
                }
              },
              tooltip: {
                shared: false,
                x: {
                  formatter: value => {
                    return `${this.current_currency.symbol} ${this.formatPrice(
                      value
                    )}`;
                  }
                },
                y: {
                  formatter: value => {
                    return `${this.current_currency.symbol} ${this.formatPrice(
                      value
                    )}`;
                  }
                }
              }
            }
          };
        })
        .catch(error => {
          //alert(error.message)
        });
    }
  },
  watch: {
    centerDialogVisible(newVal) {
      if (!newVal) {
        this.closeWelcome()
      }
    }
  },
  mounted() {
    this.getDashboard();
    this.$nextTick(() => {
      this.getAdvertisement();
    });
  }
};
</script>

<style>
.title-loading {
  color: rgb(118, 0, 228) !important;
  position: absolute;
  bottom: -115px;
}
</style>

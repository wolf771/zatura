<!-- =========================================================================================
    File Name: StatisticsCard.vue
    Description: Statistics card component
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <vx-card class="overflow-hidden">
    <div slot="no-body">
      <div
        class="p-6"
        :class="{
          'flex justify-between flex-row-reverse items-center': iconRight,
          'text-center': !iconRight && hideChart,
          'pb-0': !hideChart
        }"
      >
        <feather-icon
          :icon="icon"
          class="p-3 inline-flex rounded-full"
          :class="[`text-${color}`, { 'mb-4': !iconRight }]"
          :style="{ background: `rgba(var(--vs-${color}),.15)` }"
        ></feather-icon>
        <div class="truncate">
          <h2 class="mb-1 font-bold">{{ formatPrice(statistic) }}</h2>
          <span>{{ statisticTitle }}</span>
        </div>
      </div>

      <div class="line-area-chart" v-if="!hideChart">
        <vue-apex-charts
          ref="apexChart"
          :type="type"
          height="50"
          width="100%"
          :options="chartOptions"
          :series="dataChart"
        />
      </div>
    </div>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import chartConfigs from "./chartConfigs.js";
import _color from "@/assets/utils/color.js";
import helpers from "@/helpers/helpers";
import { mapState } from "vuex";

export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    statistic: {
      type: [Number, String],
      required: true
    },
    statisticTitle: {
      type: String
    },
    chartData: {
      // type: Array,
      // required: true
    },
    color: {
      type: String,
      default: "primary"
    },
    colorTo: {
      type: String
    },
    // chartType: {
    //     type: String,
    //     default: 'line-chart',
    // },
    type: {
      type: String,
      default: "line"
    },
    iconRight: {
      type: Boolean,
      default: false
    },
    hideChart: {
      type: Boolean,
      default: false
    },
    type_report: {
      type: String
    }
  },
  data() {
    return {
      chartOptions: null,
      dataChart: [
        {
          data: [],
          name: 'Ingresos'
        }
      ]
    };
  },
  watch: {
    themePrimaryColor() {
      this.$refs.apexChart.updateOptions({
        theme: { monochrome: { color: this.getHex(this.color) } }
      });
    }
  },
  computed: {
    ...mapState(["current_currency"]),
    themePrimaryColor() {
      return this.$store.state.themePrimaryColor;
    }
  },
  methods: {
    formatPrice(value) {
      return `${this.current_currency.symbol} ${helpers.formatPrice(value)}`;
    },
    getHex(color) {
      if (_color.isColor(color)) {
        let rgb = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(`--vs-${color}`);
        rgb = rgb.split(",");
        return `#${(
          (1 << 24) +
          (Number(rgb[0]) << 16) +
          (Number(rgb[1]) << 8) +
          Number(rgb[2])
        )
          .toString(16)
          .slice(1)}`;
      }
      return color;
    },
    gradientToColor(color) {
      const gradientToColors = {
        primary: "#A9A2F6",
        success: "#55DD92",
        warning: "#ffc085",
        danger: "#F97794"
      };

      return gradientToColors[color]
        ? gradientToColors[color]
        : gradientToColors["primary"];
    }
  },
  components: {
    VueApexCharts
  },
  mounted() {
    //console.log(this.type)
  },
  created() {
    if (this.type === "area") {

      // assign chart options
      this.chartOptions = Object.assign({}, chartConfigs.areaChartOptions);

      this.chartData.forEach(i => {
        this.dataChart[0].data.push(i.total)
      })

      let cloneData = JSON.parse(JSON.stringify(this.chartData))
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions))

      this.chartOptions.tooltip.y = {
        formatter: value => {
          let index = cloneData.findIndex(i => i.total == value)
          return `${this.formatPrice(
            value
          )} ${ index !== -1 ? cloneData[index].date : 'Fecha'}`;
        }
      }

      this.dataChart[0].name = this.type_report

      this.chartOptions["theme"] = {
        monochrome: {
          enabled: true,
          color: this.getHex(this.color),
          shadeTo: "light",
          shadeIntensity: 0.65
        }
      };
    } else if (this.type === "line") {
      // Assign chart options
      this.chartOptions = JSON.parse(
        JSON.stringify(chartConfigs.lineChartOptions)
      );

      this.chartOptions.fill.gradient.gradientToColors = [
        this.gradientToColor(this.colorTo || this.color)
      ];
      this.chartOptions.colors = [this.getHex(this.color)];
    }
  }
};
</script>

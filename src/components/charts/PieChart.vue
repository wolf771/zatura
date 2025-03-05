<script>
import { Pie, mixins } from 'vue-chartjs'

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              let currency_symbol = this.currency_symbol;
              let label = data.labels[tooltipItem.index] || '';
              let value = data.datasets[0].data[tooltipItem.index] || '';

              if (label) {
                  label += ` :  ${currency_symbol} ${parseFloat(value).toFixed(2)}`;
              }
              return label;
            }
          }
        },
        legend: {
          position: 'left',
          pointStyle: true,
          labels: {
            generateLabels: (chart) => {
              let currency_symbol = this.currency_symbol;
              var newLabels = [];
              // call the default generateLabels
              Chart.defaults.pie.legend.labels.generateLabels(chart)
              .forEach((label, i) => { 
                label.text = `${label.text} : ${currency_symbol} ${parseFloat(chart.data.datasets[0].data[i]).toFixed(2)}`;
                newLabels.push(label)
              });
              return newLabels;
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    }
  },
  computed: {
    currency_symbol() {
      return this.$store.state.current_currency.symbol;
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>


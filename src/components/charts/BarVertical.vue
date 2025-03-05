<script>
import { Bar, mixins } from 'vue-chartjs'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
				maintainAspectRatio: false,
        scaleShowValues: true,
        scales: {
          yAxes: [{
            ticks: {
            beginAtZero: true,
           
            }
          }],
          xAxes: [{
            ticks: {
            autoSkip: false
          }
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return tooltipItem.yLabel.toFixed(2).replace('.',',');
            }
          }
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>


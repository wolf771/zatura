import { numberFormat } from '@/helpers/numbers'
import dayjs from 'dayjs'

export default {
  methods: {
    numberFormat(num) {
      return numberFormat(num)
    },
    dateFormat(date) {
      return dayjs(date).format('DD/MM/YYYY')
    },
  },
}

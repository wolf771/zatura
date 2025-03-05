/* eslint-disable import/extensions */
// axios
import axios from 'axios'

import interceptors from '@/helpers/axios-interceptors.js'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'http://localhost:85/zatura/zatura-4-backend/public/api/',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
})
interceptors(axiosIns)

export default axiosIns

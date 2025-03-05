export default function interceptors(API) {
  // Add a request interceptor
  API.interceptors.request.use(
    config => {
      // eslint-disable-next-line prefer-const
      let requestConfig = config
      const AUTH_TOKEN = localStorage.getItem('token')
      const X_COMPANY = localStorage.getItem('zaturacom')
      requestConfig.headers.Authorization = `Bearer ${AUTH_TOKEN}`
      requestConfig.headers['X-Company'] = X_COMPANY

      // Do something before request is sent
      return requestConfig
    },
    error => // Do something with request error
      // eslint-disable-next-line implicit-arrow-linebreak
      // eslint-disable-next-line implicit-arrow-linebreak
      Promise.reject(error)
    ,
  )

  // Add a response interceptor
  API.interceptors.response.use(
    response =>
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      // eslint-disable-next-line implicit-arrow-linebreak
      response,
    error =>
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // eslint-disable-next-line implicit-arrow-linebreak
      Promise.reject(error)
    ,
  )
}

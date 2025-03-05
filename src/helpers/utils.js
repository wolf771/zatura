// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { createToastInterface } from 'vue-toastification'

const pluginOptions = {
  hideProgressBar: true,
  closeOnClick: false,
  closeButton: false,
  icon: false,
  timeout: 3000,
  transition: 'Vue-Toastification__fade',
}

// Create the interface
const toast = createToastInterface(pluginOptions)

// Use it

export const confirmAlert = (title, message = null) => Swal.fire({
  title,
  text: message,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Si, continuar',
  cancelButtonText: 'Cancelar',
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-outline-danger ml-1',
  },
  buttonsStyling: false,
})

export const generateCustomProductId = (length = 20) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return `custom-${result}`
}

export const handleErrors = (e, customMessage = false, message = '') => {
  let mensajeErrores
  if (e.response) {
    if (e.response.data?.data?.errores) {
      const erroresValidacion = Object.values(e.response.data?.data?.errores)
      erroresValidacion.forEach(error => {
        if (mensajeErrores) {
          mensajeErrores = `${mensajeErrores} ${error}`
        } else {
          mensajeErrores = `${error}`
        }
      })
    }
  }
  toast({
    component: ToastificationContent,
    props: {
      title: customMessage ? message : `Ha ocurrido un error al completar el formulario. ${
        mensajeErrores || ''
      }`,
      icon: 'CheckCircleIcon',
      variant: 'error',
    },
  })
}

export const successToast = (
  msg = 'Los cambios se han guardado correctamente.',
) => {
  toast({
    component: ToastificationContent,
    props: {
      title: msg,
      icon: 'CheckCircleIcon',
      variant: 'success',
    },
  })
}

export const generateFormData = data => {
  const fdata = new FormData()
  Object.keys(data).forEach(key => {
    let value
    if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
      value = JSON.stringify(data[key])
    } else {
      value = data[key]
    }
    fdata.append(key, value)
  })
  return fdata
}

export const resolveSidebarComponent = action => {
  switch (action) {
    case 'pay':
        return 'pay-sidebar'
  
    default:
      return 'pay-sidebar'
  }
} 
export const resolveMultiActionSidebarComponent = action => {
  switch (action) {
    case 'new-document':
        return 'pay-sidebar'
  
    default:
      return 'pay-sidebar'
  }
} 
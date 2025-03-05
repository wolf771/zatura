<template>
  <span :class="['font-weight-bold','text-capitalize', status_hacienda]">
    {{ status_hacienda }}
  </span>
</template>

<script>
export default {
  name: 'status-hacienda',
  props: {
    status: {
      required: true,
      default: null
    }
  },
  computed: {
    status_hacienda() {
      return this.status ? this.status : 'por enviar'
    }
  }
}
</script>

<style scoped>
.aceptado {
  color: rgb(0, 134, 128) !important;
}

.rechazado {
  color: rgb(245, 9, 9) !important;
}

.enviado {
  color: rgb(0, 158, 206) !important;
}

</style>

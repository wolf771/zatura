<template>
  <span :class="['font-weight-bold','text-capitalize', condition]">
    {{ condition }}
  </span>
</template>

<script>
export default {
  name: 'reception-condition',
  props: {
    message: {
      required: true,
      default: null
    }
  },
  computed: {
    condition() {
      let condition = '';
      switch(this.message) {
        case '1':
          condition = 'aceptado'
          break
        case '2':
          condition = 'parcialmente aceptado'
          break
        case '3':
          condition = 'rechazado'
          break
        //El caso 4 es cuando se ingreso el xml desde correo
        case '4':
          condition = 'pendiente'
          break
      }
      return condition
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

.parcialmente {
  color: rgb(206, 151, 0) !important;
}

</style>

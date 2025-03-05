<template>
  <div class="ribbon">
    <span :class="['font-weight-bold','text-capitalize', status_hacienda]">
      {{ status_hacienda }}
    </span>
  </div>
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
.ribbon {
  position: absolute;
  left: -5px; top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 75px; height: 75px;
  text-align: right;
}
.ribbon span {
  font-size: 11px;
  color: #FFF;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  line-height: 20px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  width: 100px;
  display: block;
  background: rgb(167, 164, 164);
  background: linear-gradient(rgb(167, 164, 164) 0%, rgb(167, 164, 164) 100%);
  box-shadow: 0 3px 10px -5px rgb(167, 164, 164);
  position: absolute;
  top: 19px; left: -21px;
}
.ribbon span::before {
  content: "";
  position: absolute; left: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid rgb(105, 126, 123);
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid rgb(105, 126, 123);
}
.ribbon span::after {
  content: "";
  position: absolute; right: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid rgb(105, 126, 123);
  border-bottom: 3px solid transparent;
  border-top: 3px solid rgb(105, 126, 123);
}

.aceptado {
  background: rgb(0, 134, 128) !important;
}

.rechazado {
  background: rgb(245, 9, 9) !important;
}

.enviado {
  background: rgb(0, 158, 206) !important;
}

</style>

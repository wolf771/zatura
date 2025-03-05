<template>
  <vs-chip v-if="show_status_payment" :color="color">{{ message }}</vs-chip>
  <div v-else style="text-align:center; width:100%">...</div>
</template>

<script>
export default {
  name: "status-payment",
  props: {
    payment_amount: {
      required: true,
      default: 0
    },
    total: {
      required: true,
      default: 0
    },
    hacienda: {
      default: null
    },
    note_totals: {
      required: false,
      default: null
    }
  },
  computed: {
    notes() {
      return this.note_totals;
    },
    show_status_payment() {
      let show = true;
      if (this.hacienda && this.hacienda == "rechazado") {
        show = false;
      }
      return show;
    },
    pagado() {
      return this.payment_amount;
    },
    total_item() {
      return this.total;
    },
    message() {
      let message = "No pagado";
      if (this.total_item > this.pagado && this.pagado > 0) {
        message = "Pago Parcial";
      } else if (this.total_item <= this.pagado) {
        message = "Pagado";
      }
      //Si hay notas
      if (this.notes && this.notes.ncs.nc_total > 0) {
        if (this.total_item <= this.notes.ncs.nc_total) {
          message = "Con nota de credito";
        }
      }

      return message;
    },
    color() {
      let color = "danger";

      if (this.total_item > this.pagado && this.pagado > 0) {
        color = "warning";
      } else if (this.total_item <= this.pagado) {
        color = "success";
      }

      //Si hay notas
      if (this.notes && this.notes.ncs.nc_total > 0) {
        if (this.total_item <= this.notes.ncs.nc_total) {
          color = "warning";
        }
      }

      return color;
    }
  }
};
</script>

<style></style>

<template>
  <el-dialog top="10vh" @close="close()" title="Agregar Exoneración" width="35%" :visible.sync="show">
    <form v-loading="loading"  element-loading-text="Pagando por favor espere..." data-vv-scope="new-payment">
      <div class="form-group">
        <label>Número Documento</label>
        <el-input v-model="payment.reference"></el-input>
      </div>
      <div class="text-center mt10">
        <button class="btn btn-success" type="submit">
          Guardar
        </button>
      </div>
      </form>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import paymentsService from '@/services/payments.service';
import moment from 'moment';

export default {
  props:{
    vis: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  name: 'exoneration-modal',
  data() {
    return {
      payment: {
        payment_method: "",
        date: "",
        amount: "",
        description: "Pago factura Nº ",
        reference: "",
        currency: ""
      },
      loading: false
    }
  },
  computed: {
    ...mapState(['payment_methods',
                'currencies',
                'current_currency'
              ]),
    show: {
      get() {
        return this.vis;
      },
      set(newVal) {}
    },
    document() {
      return this.data;
    },
    reference() {
      return Object.keys(this.data).length === 0 ? '' : this.data.item.reference;
    },
    amount_rules() {
      return Object.keys(this.data).length === 0 ? 'required|decimal:2' : `required|decimal:2|max_value:${this.calculated_price(this.data.item.total, this.data.item) - this.calculated_price(this.data.item.payment_amount, this.data.item)}`;
    }
  },
  methods: {
    ...mapActions(['getPaymentMethods', 'getCurrencies', 'getCurrentCurrency']),
    calculated_price(amount, document) {
      let value = 0;
      if(document.currency_id === this.payment.currency.id) {
        return amount;
      }
      if(this.payment.currency.id === 1) {
        value = amount / document.exchange_rate;
      } else if(this.payment.currency.id === 2) {
        value = amount * document.exchange_rate;
      }
      return parseFloat(value).toFixed(2);
    },
    resetDataForm() {
      let data_form_initial = this.$options.data().payment;
      data_form_initial.currency = this.payment.currency;
      Object.assign(this.$data.payment, data_form_initial);
      this.$validator.reset();
    },
    close() {
      this.$emit('closeModal', false);
      this.resetDataForm();
    },
    storePayment(scope) {
      this.$validator.validateAll(scope).then((valid) => {
        if(valid) {
          this.loading = true;
          this.payment.document_id = this.document.item.id;
          this.payment.description = 'Pago factura Nº '+this.reference;
          paymentsService.storePayment(this.payment)
          .then(res => {
            this.loading = false;
             /*this.$notify({
              title: 'Bien',
              message: 'Pago registrado correctamente',
              type: 'success',
              duration: 1500
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Pago registrado correctamente',
              type: 'success',
              duration: 1500
            });
            this.resetDataForm();
            this.$emit('paymentExecuted', res.data.item);
          })
          .catch((error) => {
            this.loading = false;
            /*this.$notify({
              title: 'Problema',
              message: error.message,
              type: 'error',
              duration: 1500
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 1500
            });
          });
        } else {
          /*this.$notify({
              title: 'invalido',
              type: 'error'
            });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: 'invalido',
            type: 'error'
          });
            this.loading = false;
        }
      });
      
    }
   
  },
  watch: {
    data() {
      //this.payment.amount = this.calculated_price(this.data.item.total, this.data.item) - this.calculated_price(this.data.item.payment_amount, this.data.item);
     this.payment.amount = this.data.item.total - this.data.item.payment_amount
     this.payment.currency = this.data.item.currency;
    }
  },
  created() {
    this.getPaymentMethods();
    this.getCurrencies().then(() =>{
      this.getCurrentCurrency()
      .then(res => {
        //this.payment.currency = this.data.item.currency;
      })
      .catch(error => alert('erroooor'));
    });
  }, 
  mounted() {
    // this.payment.currency = this.data.item.currency
    // this.payment.amount = this.data.item.total - this.data.item.payment_amount

  }
}
</script>

<style scoped>
.el-input-number .el-input .el-input__inner {
  width: 100% !important; 
  background: red;
}
</style>

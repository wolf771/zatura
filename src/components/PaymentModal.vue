<template>
  <vs-popup
    title="Pagar factura"
    :active.sync="show"
  >
    <div class="col">
      <div class="card">
        <div class="card-body">

          <form
            v-loading="loading"
            element-loading-text="Pagando por favor espere..."
            @submit.prevent="storePayment('new-payment')"
            data-vv-scope="new-payment"
          >
            <div>Documento: {{ reference }}</div>
            <div class="form-group">
              <label>Método de pago</label>
              <el-select
                popper-class="el-select-float"
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="payment.payment_method"
                value-key="id"
                name="payment_method"
                v-validate="'required'"
                filterable
                class="form-control"
              >
                <el-option
                  v-for="payment_method in payment_methods"
                  :key="payment_method.id"
                  :label="payment_method.name"
                  :value="payment_method"
                >
                </el-option>
              </el-select>
              <label v-show="errors.has('new-payment.payment_method')" class="error">
                {{ errors.first("new-payment.payment_method") }}
              </label>
            </div>
            <div class="form-group">
              <label>Monto</label>
              <div style="display: flex;justify-content: space-between">
                <el-select
                  style="width:70px;display:none"
                  v-model="payment.currency"
                  value-key="id"
                  name="currency"
                  v-validate="'required'"
                  readonly
                >
                  <el-option
                    v-for="currency in currencies"
                    :key="currency.id"
                    :label="currency.symbol"
                    :value="currency"
                  >
                  </el-option>
                </el-select>
                <el-input
                  style="width:50px"
                  :value="payment.currency.symbol"
                  readonly
                ></el-input>
                <el-input
                  v-model="payment.amount"
                  name="amount"
                  v-validate="amount_rules"
                ></el-input>
              </div>
              <label v-show="errors.has('new-payment.amount')" class="error">
                {{ errors.first("new-payment.amount") }}
              </label>
            </div>
            <div class="form-group">
              <label>Fecha</label>
              <!-- <el-input v-model="payment.date" readonly name="date" v-validate="'required'"></el-input> -->
              <el-date-picker
                popper-class="el-select-float"
                v-model="payment.date"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                placeholder=""
                style="width: 100%"
                v-validate="'required'"
                name="date"
              >
              </el-date-picker>
              <label v-show="errors.has('new-payment.date')" class="error">
                {{ errors.first("new-payment.date") }}
              </label>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <el-input
                :value="'Pago factura Nº ' + reference"
                name="description"
                readonly
                v-validate="'required'"
              ></el-input>
            </div>
            <div class="form-group">
              <label>Referencia</label>
              <el-input v-model="payment.reference"></el-input>
            </div>
            <div class="text-center mt10">
              <vs-button button="submit" type="gradient">
                Pagar
              </vs-button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";
import paymentsService from "@/services/payments.service";
import moment from "moment";

export default {
  props: {
    vis: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  name: "payment-modal",
  data() {
    return {
      show: false,
      payment: {
        payment_method: "",
        date: "",
        amount: "",
        description: "Pago factura Nº ",
        reference: "",
        currency: ""
      },
      loading: false
    };
  },
  computed: {
    ...mapState(["payment_methods", "currencies", "current_currency"]),
    document() {
      return this.data;
    },
    reference() {
      return Object.keys(this.data).length === 0
        ? ""
        : this.data.item.reference;
    },
    amount_rules() {
      return Object.keys(this.data).length === 0
        ? "required|decimal:2"
        : `required|decimal:2|max_value:${this.data.item.due}`;
    }
  },
  methods: {
    ...mapActions(["getPaymentMethods", "getCurrencies", "getCurrentCurrency"]),
    calculated_price(amount, document) {
      let value = 0;
      if (document.currency_id === this.payment.currency.id) {
        return amount;
      }
      if (this.payment.currency.id === 1) {
        value = amount / document.exchange_rate;
      } else if (this.payment.currency.id === 2) {
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
      this.$emit("closeModal", false);
      this.resetDataForm();
    },
    storePayment(scope) {
      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          this.loading = true;
          this.payment.document_id = this.document.item.id;
          this.payment.description = "Pago factura Nº " + this.reference;
          paymentsService
            .storePayment(this.payment)
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
                message: "Pago registrado correctamente",
                type: "success",
                duration: 1500
              });
              this.resetDataForm();
              this.$emit("paymentExecuted", res.data.item);
            })
            .catch(error => {
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
                type: "error",
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
            message: "invalido",
            type: "error"
          });
          this.loading = false;
        }
      });
    }
  },
  watch: {
    data(newVal) {
      console.log(newVal);
      this.payment.amount = this.data.item.due;
      this.payment.currency = this.data.item.currency;
    },
    show(newVal) {
      if (!newVal) {
        this.close()
      }
    },
    vis(newVal) {
      this.show = newVal
    }
  },
  created() {
    this.getPaymentMethods();
    this.getCurrencies().then(() => {
      this.getCurrentCurrency()
        .then(res => {
          //this.payment.currency = this.data.item.currency;
        })
        .catch(error => alert("erroooor"));
    });
  },
  mounted() {
    // this.payment.currency = this.data.item.currency
    // this.payment.amount = this.data.item.total - this.data.item.payment_amount
  }
};
</script>

<style scoped>
.el-input-number .el-input .el-input__inner {
  width: 100% !important;
  background: red;
}
.con-vs-popup .vs-popup {
  width: 800px !important;
}
</style>

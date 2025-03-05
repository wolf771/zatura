<template>
  <vs-popup title="Nuevo Gasto" :active.sync="show">
    
    <!-- modal new expense category -->
    <new-expense-category-modal @storeExpenseCategory="storeExpenseCategory" @closeModal="closeModal()" :company_id="company_default.id" :vis="show_new_expense_category_modal"></new-expense-category-modal>
    
    <div class="card">
      <div class="card-body">
        <form v-loading="loading" element-loading-text="Guardando por favor espere..." @submit.prevent="storeExpense('new-expense')" data-vv-scope="new-expense">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Fecha</label>
                <el-date-picker
                  popper-class="el-select-float"
                  size="large"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  v-model="expense.date"
                  type="date"
                  placeholder=""
                  name="date"
                  v-validate="'required'">
                </el-date-picker>
                <label v-show="errors.has('new-expense.date')" class="error">
                  {{ errors.first('new-expense.date') }}
                </label>
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <el-input v-model="expense.description" name="description" v-validate="'required'"></el-input>
                <label v-show="errors.has('new-expense.description')" class="error">
                  {{ errors.first('new-expense.description') }}
                </label>
              </div>

              <div>
                <label>Monto</label>
                 <div style="display: flex;justify-content: space-between">
                <el-select style="width:70px;"
                  v-model="expense.currency"
                  value-key="id" name="currency"
                  v-validate="'required'"
                  popper-class="el-select-float"
                >
                  <el-option
                    v-for="currency in currencies"
                    :key="currency.id"
                    :label="currency.symbol"
                    :value="currency">
                  </el-option>
                </el-select>
                <el-input v-model.number="expense.amount" name="amount" v-validate="'required|decimal:2'"></el-input>
                
                </div>
               <label v-show="errors.has('new-expense.amount')" class="error">
                  {{ errors.first('new-expense.amount') }}
                </label>
              </div>

              <div class="form-group">
                <label>Referencia</label>
                <el-input v-model="expense.reference"></el-input>
              </div>

            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>
                  Categoría
                  <a href="#" @click.prevent="newExpenseCategory()">
                    <i class="fa fa-plus"></i>
                    Nueva
                  </a>
                </label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  v-model="expense.category"
                  value-key="id"
                  name="category"
                  v-validate="'required'"
                  filterable
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category">
                  </el-option>
                </el-select>
                <label v-show="errors.has('new-expense.category')" class="error">
                  {{ errors.first('new-expense.category') }}
                </label>
              </div>

              <div class="form-group">
                <label>Método de pago</label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="expense.payment_method"
                  value-key="id"
                  name="payment_method"
                  v-validate="'required'"
                  filterable
                >
                  <el-option
                    v-for="payment_method in payment_methods"
                    :key="payment_method.id"
                    :label="payment_method.name"
                    :value="payment_method">
                  </el-option>
                </el-select>
                <label v-show="errors.has('new-expense.payment_method')" class="error">
                  {{ errors.first('new-expense.payment_method') }}
                </label>
              </div>

                <div class="form-group">
                  <label>Adjuntar Archivo</label>
                  <div class="form-group">
                    <el-upload
                      name="file"
                      ref="upload"
                      action="#"
                      :auto-upload="false"
                      :limit="1"
                      :on-change="fileSelect"
                      :on-exceed="fileExceed"
                      :on-remove="fileRemove"
                      :file-list="fileList"
                      :multiple="false">
                      <el-button slot="trigger" size="small" type="primary">
                        <i class="fa fa-upload"></i>
                        Adjunto
                      </el-button>
                    </el-upload>
                  </div>
                  <label v-show="errors.has('new-expense.file')" class="error">
                    {{ errors.first('new-expense.file') }}
                  </label>
                </div>

            </div>
          </div>

          <div class="text-center mt-30">
            <vs-button button="submit" type="gradient">
              <i class="fa fa-save"></i>
              Guardar
            </vs-button>
          </div>
        </form>
      </div>
    </div>

  </vs-popup>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import expensesService from '@/services/expenses.service';
import moment from 'moment';
import newExpenseCategoryModal from '@/components/NewExpenseCategoryModal.vue'

export default {
  props:{
    vis: {
      type: Boolean,
      default: false
    }
  },
  name: 'expense-modal',
  components: {
    newExpenseCategoryModal
  },
  data() {
    return {
      show: false,
      expense: {
        payment_method: "",
        category: "",
        date: "",
        amount: "",
        description: "",
        reference: "",
        file: "",
        currency: ""
      },
      categories: [],
      fileList: [],
      loading: false,
      show_new_expense_category_modal: false
    }
  },
  computed: {
    ...mapState(['payment_methods', 'currencies', 'company_default'])
  },
  methods: {
    ...mapActions(['getPaymentMethods', 'getCurrencies','getCurrentCurrency']),
    newExpenseCategory() {
      this.show_new_expense_category_modal = true;
    },
    storeExpenseCategory(new_category) {
      this.categories.push(new_category)
      this.expense.category = new_category
      this.closeModal()
    },
    closeModal() {
      this.show_new_expense_category_modal = false
    },
    close() {
      this.$emit('closeModal', false);
      this.resetDataForm();
    },
    resetDataForm() {
      let data_form_initial = this.$options.data().expense;
      data_form_initial.currency = this.expense.currency;
      Object.assign(this.$data.expense, data_form_initial);
      this.fileList = [];
      this.$validator.reset();
    },
    storeExpense(scope) {
      this.$validator.validateAll(scope).then((valid) => {
        if(valid) {
          this.loading = true;
          let formData = new FormData();
          Object.keys(this.expense).forEach(key => {
            let value;
            if(typeof this.expense[key] === 'object' && !(this.expense[key] instanceof File)) {
              value = JSON.stringify(this.expense[key])
            } else {
              value = this.expense[key]
            }
            formData.append(key, value)
          });
          expensesService.storeExpense(formData)
          .then(res => {
            this.$emit('expenseExecuted', res.data.item);
            this.loading = false;
            /*this.$notify({
              title: 'Bien',
              message: 'Gasto registrado correctamente',
              type: 'success',
              duration: 1500
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Gasto registrado correctamente',
              type: 'success',
              duration: 1500
            });
            this.resetDataForm();
          })
          .catch(error => {
            /*this.$notify({
              title: error.message,
              type: 'error'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error'
            });
            this.loading = false;
          });
        } else {
           /*this.$notify({
              title: 'invalido',
              type: 'error'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'invalido',
              type: 'error'
            });
            this.loading = false;
        }
      });
      
    },
    getCategories()
    {
      expensesService.getExpenseCategories()
      .then(res => {
        this.categories = res.data;
      })
      .catch(() => {
        alert('error al obtener expense categories')
      });
    },
     fileSelect(file) {
      this.fileList.push(file)
      this.expense.file = file.raw
    },
    fileExceed(file) {
      this.fileList = []
      this.fileList.push(file[0]);
      this.expense.file = file[0];
    },
    fileRemove() {
      this.fileList = [],
      this.expense.file = null;
    },
  },
  watch: {
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
    this.getCategories();
    this.getCurrencies().then(() =>{
      this.getCurrentCurrency()
      .then(res => {
        this.expense.currency = res;
      })
      .catch(error => alert('erroooor'));
    });
    
  }
}
</script>

<style scoped>
.el-input-number .el-input .el-input__inner {
  width: 100% !important; 
  background: red;
}
.el-date-editor {
  width: 100% !important;
}
.el-input__inner {
  display: block;
  width: 100% !important;
}
.mt-30 {
  margin-top: 30px
}
</style>

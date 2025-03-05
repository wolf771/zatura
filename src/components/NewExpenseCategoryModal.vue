<template>
  <vs-popup title="Nueva categoría de gasto" :active.sync="show">
    <div class="card">
      <div class="card-body">
        <form v-loading="loading"  element-loading-text="Guardando..." @submit.prevent="store('new-expense-category')" data-vv-scope="new-expense-category">
          <div class="row" >
            <div class="col-md-12">
              
              <div class="form-group">
                <label>Nombre Categoría</label>
                <el-input v-model="expense_category.name" name="name" v-validate="'required'"></el-input>
                 <label v-show="errors.has('new-expense-category.name')" class="error">
                  {{ errors.first('new-expense-category.name') }}
                </label>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-30">
            <vs-button button="submit" type="filled">
              Guardar
            </vs-button>
          </div>
        </form>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import utilitiesService from '@/services/utilities.service';

export default {
  props:{
    vis: {
      type: Boolean,
      default: false
    },
    company_id: {
      type: Number
    }
  },
  name: 'new-expense-category-modal',
  data() {
    return {
      show: false,
      expense_category: {
        company_id: "",
        name: "",
      },
      loading: false
    }
  },
  methods: {
    close() {
      this.$emit('closeModal', false);
      this.resetDataForm();
    },
    resetDataForm() {
      Object.assign(this.$data.expense_category, this.$options.data().expense_category);
      this.$validator.reset();
    },
    store(scope) {
      this.$validator.validateAll(scope).then((valid) => {
        if(valid) {
          this.loading = true;
          let expense_category = this.expense_category
          expense_category.company_id = this.company_id
          utilitiesService.storeExpenseCategory(expense_category)
          .then(res => {
            if(res.data.success) {
              this.$emit('storeExpenseCategory', res.data.item);
              /*this.$notify({
                title: 'Categoría agregada correctamente.',
                type: 'success',
                duration: 1500
              });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: 'Categoría agregada correctamente.',
                type: 'success',
                duration: 1500
              });
            } else {
              this.close()
              /*this.$notify({
                title: res.data.message,
                type: 'warning'
              });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'warning'
              });
            }
            this.loading = false;
            this.resetDataForm();
          })
          .catch(error => {
            /*this.$notify({
              title: error.message,
              type: 'error'
            });*/
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
    show(newVal) {
      if (!newVal) {
        this.close()
      }
    },
    vis(newVal) {
      this.show = newVal
    }
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

<template>
  <el-dialog top="10vh" @close="close()" title="Nuevo IVA" width="40%" :visible.sync="show">
    <form v-loading="loading"  element-loading-text="Guardando por favor..." @submit.prevent="store('new-tax')" data-vv-scope="new-tax">
      <div class="row" >
        <div class="col-md-12">
          
          <div class="form-group">
            <label>Nombre</label>
            <el-input v-model="tax.name" name="name" v-validate="'required'"></el-input>
             <label v-show="errors.has('new-tax.name')" class="error">
              {{ errors.first('new-tax.name') }}
            </label>
          </div>

           
          <div class="form-group">
            <label>Porcentaje</label>
            <el-input v-model="tax.rate" name="rate" v-validate="'required'"></el-input>
             <label v-show="errors.has('new-tax.rate')" class="error">
              {{ errors.first('new-tax.rate') }}
            </label>
          </div>

        </div>
      </div>
      
      <div class="text-center mt-30">
        <button class="btn btn-success" type="submit">
          Guardar
        </button>
      </div>
    </form>
  </el-dialog>
</template>

<script>
import configurationsService from '@/services/configurations.service';

export default {
  props:{
    vis: {
      type: Boolean,
      default: false
    }
  },
  name: 'new-tax-modal',
  data() {
    return {
      tax: {
       name: "",
       rate: ""
      },
      loading: false
    

    }
  },
  computed: {
    show: {
      get() {
        return this.vis;
      },
      set(newVal) {}
    }
  },
  methods: {
    close() {
      this.$emit('closeModal', false);
      this.resetDataForm();
    },
    resetDataForm() {
      Object.assign(this.$data.tax, this.$options.data().tax);
      this.$validator.reset();
    },
    store(scope) {
      this.$validator.validateAll(scope).then((valid) => {
        if(valid) {
          this.loading = true;
          configurationsService.storeTax(this.tax)
          .then(res => {
            if(res.data.success) {
              this.$emit('storeTax', res.data.item);
              /*this.$notify({
                title: res.data.message,
                type: 'success',
                duration: 1500
              });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success',
                duration: 1500
              });
            } else {
              /*this.$notify({
                title: res.data.message,
                type: 'error'
              });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
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

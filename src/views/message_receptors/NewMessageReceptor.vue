<template>
  <div class="row">
  <div class="col-md-12" v-loading="loading" element-loading-text="Cargando datos...">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-body">
            <form @submit.prevent="storeDocument()" method="POST">
              <div class="form-group">
                <label>Subir XML del documento</label>
                <div class="form-group">
                  <el-upload
                    ref="upload"
                    action="#"
                    :auto-upload="false"
                    :limit="1"
                    :on-change="xmlSelect"
                    :on-exceed="xmlExceed"
                    :on-remove="xmlRemove"
                    :file-list="fileList"
                    :multiple="false">
                    <el-button slot="trigger" size="small" type="primary">
                      <i class="fa fa-upload"></i>
                      XML DOCUMENTO
                    </el-button>
                  </el-upload>
                </div>
                <label v-show="errors.has('file_key')" class="error">
                  {{ errors.first('file_key') }}
                </label>
              </div>

               <div class="form-group">
                <label>Condición Aceptación</label>
                <el-select
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="reception.message"
                  value-key="id" name="condition"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="condition in conditions"
                    :key="condition.id"
                    :label="condition.name"
                    :value="condition">
                  </el-option>
                </el-select>
                <label v-show="errors.has('condition')" class="error">
                  {{ errors.first('condition') }}
                </label>
              </div>
                      
              <div class="form-group">
                <label>Detalle mensaje recepción</label>
                <el-input v-model="reception.message_detail" v-validate="'required'" name="message_detail"></el-input>
                <label v-show="errors.has('message_detail')" class="error">
                  {{ errors.first('message_detail') }}
                </label>
              </div>

              <div class="form-group">
                <label>
                  Categoría Gasto
                  <a href="#" @click.prevent="newExpenseCategory()">
                    <i class="fa fa-plus"></i>
                    Nueva
                  </a>
                </label>
                <el-select
                  placeholder=""
                  v-model="reception.expense_category"
                  value-key="id"
                  name="category"
                  v-validate="'required'"
                  filterable
                  style="width:100%"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category">
                  </el-option>
                </el-select>
                <label v-show="errors.has('category')" class="error">
                  {{ errors.first('category') }}
                </label>
              </div>

              <div class="text-center" style="padding-top:20px">
                <button type="submit" class="btn btn-info">
                  <i class="fa fa-send"></i>
                  Enviar
                </button>
              </div>
            </form>
            </div>
          </div>

        </div>
      </div>
  </div>

  <!-- modal new expense category -->
  <new-expense-category-modal @storeExpenseCategory="storeExpenseCategory" @closeModal="closeModal()" :company_id="company_default.id" :vis="show_new_expense_category_modal"></new-expense-category-modal>

</div>
</template>

<script>
import receptionsService from '@/services/receptions.service';
import expensesService from '@/services/expenses.service';
import NewExpenseCategoryModal from '@/components/NewExpenseCategoryModal.vue'
import { mapState } from 'vuex'

export default {
  name: 'new-message-receptor',
  components: {
    NewExpenseCategoryModal
  },
  data () {
    return {
      reception: {
        message: "",
        message_detail: "",
        xml_file: null,
        expense_category: ""
      },
      message: {},
      conditions: [
        {id: 1, code: 1, name: 'Aceptado'},
        {id: 2, code: 2, name: 'Aceptado Parcialmente'},
        {id: 3, code: 3, name: 'Rechazado'}
      ],
      fileList: [],
      categories: [],
      loading: false,
      show_new_expense_category_modal: false

    }
  },
  computed: {
    ...mapState(['company_default'])
  },
  methods: {
    newExpenseCategory() {
      this.show_new_expense_category_modal = true;
    },
    storeExpenseCategory(new_category) {
      this.categories.push(new_category)
      this.reception.expense_category = new_category
      this.closeModal()
    },
    closeModal() {
      this.show_new_expense_category_modal = false
    },
    xmlSelect(file) {
      this.fileList.push(file)
      this.reception.xml_file = file.raw
    },
    xmlExceed(file) {
      this.fileList = []
      this.fileList.push(file[0]);
      this.reception.xml_file = file[0];
    },
    xmlRemove() {
      this.fileList = [],
      this.reception.xml_file = null;
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
    storeDocument() {
      this.$validator.validate().then(valid => {
      if (valid) {
      this.loading = true
      let formData = new FormData();
      Object.keys(this.reception).forEach(key => {
        let value;
        if(typeof this.reception[key] === 'object' && !(this.reception[key] instanceof File)) {
          value = JSON.stringify(this.reception[key])
        } else {
          value = this.reception[key]
        }
        formData.append(key, value)
      });

      receptionsService.storeDocumentReception(formData)
      .then(res => {
        if(res.data.success) {
          /*this.$notify({
            title: res.data.message,
            type: 'success'
          });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.$router.push({name: 'message-receptors'});
        } else {
          /*this.$notify({
          title: res.data.message,
          type: 'warning',
          duration: 5000
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'warning',
            duration: 5000
          });
        }
        this.loading = false
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
        this.loading = false
      })
     
    }
    })
    } 
  },
  created() {
    this.getCategories();
  }
}
</script>

<style scoped>
  
</style>

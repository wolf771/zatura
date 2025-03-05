<template>
<div class="row">
  <div class="col-md-12">
    <form @submit.prevent="updateItem()">
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <div class="card vx-card">
            <div class="card-header bg-white">
              <h4 class="">Editar Artículo</h4>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <text-input
                    name="code"
                    :label="'Código'"
                    v-validate="'required'"
                    :error="errors.first('code')"
                    v-model="item.code"
                    data-vv-as="Código">
                  </text-input>
                  <text-input
                    name="name"
                    :label="'Nombre'"
                    v-validate="'required'"
                    :error="errors.first('name')"
                    v-model="item.name"
                    data-vv-as="Nombre">
                  </text-input>

                  <text-input
                    name="description"
                    :label="'Descripción'"
                    v-validate="'required'"
                    :error="errors.first('description')"
                    v-model="item.description"
                    data-vv-as="Descripción">
                  </text-input>
                  
                  <div class="form-group">
                    <label>Categoría</label>
                    <el-select placeholder="" v-model="item.category" value-key="id" name="category" v-validate="'required'" filterable class="form-control">
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

                  <div class="form-group">
                    <label>Unidad</label>
                    <el-select placeholder="" v-model="item.unit" value-key="id" name="unit" v-validate="'required'" filterable class="form-control">
                      <el-option
                        v-for="unit in units"
                        :key="unit.id"
                        :label="unit.description"
                        :value="unit">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('unit')" class="error">
                      {{ errors.first('unit') }}
                    </label>
                  </div>

                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>IVA</label>
                    <el-select placeholder="" v-model="item.tax_type" value-key="id" name="tax_type" v-validate="'required'" filterable class="form-control">
                      <el-option
                        v-for="tax_type in tax_types"
                        :key="tax_type.id"
                        :label="tax_type.name"
                        :value="tax_type">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('tax_type')" class="error">
                      {{ errors.first('tax_type') }}
                    </label>
                  </div>

                  <div class="form-group">
                    <label>Moneda</label>
                    <el-select
                      placeholder=""
                      no-data-text="No hay datos."
                      no-match-text="No hay resultados."
                      v-model="item.currency"
                      value-key="id" name="currency"
                      v-validate="'required'"
                      filterable
                      class="form-control"
                    >
                      <el-option
                        v-for="currency in currencies"
                        :key="currency.id"
                        :label="`${currency.name} (${currency.symbol})`"
                        :value="currency">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('currency')" class="error">
                      {{ errors.first('currency') }}
                    </label>
                  </div>

                  <text-input
                    name="price"
                    :label="'Precio'"
                    v-validate="'required|decimal:2'"
                    :error="errors.first('price')"
                    v-model="item.price"
                    data-vv-as="Precio">
                  </text-input>
                </div>
              
          
              

              <div class="col-md-12 text-center p-t-20">
                <button type="submit" class="btn btn-success">
                  <i class="fa fa-save"></i>
                  Guardar
                </button>
              </div>

            </div>
          </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import itemsService from '../../services/items.service.js';

export default {
  name: 'new-client',
  data() {
    return {
      item: {
        name: "",
        description: "",
        category: "",
        unit: "",
        tax_type: "",
        price: "",
        currency: ""
      }      
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    units() {
      return this.$store.state.units;
    },
    tax_types() {
      return this.$store.state.tax_types;
    },
    currencies() {
      return this.$store.state.currencies;
    }
  },
  methods: {
    getItemDetail() {
      let id = this.$route.params.id;
      itemsService.getItemDetail(id)
      .then((res) => {
        this.item = res.data.item;
      })
      .catch((error) => {
        this.$snotify.error(error.response.data.message);
      });
    },
    updateItem() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let data = this.item;
          itemsService.updateItem(data)
          .then(() => {
            /*this.$notify({
              title: 'Bien',
              message: 'Artículo actualizado correctamente',
              type: 'success',
              duration: 1500
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Artículo actualizado correctamente',
              type: 'success',
              duration: 1500
            });
            this.$router.push({name: 'items'});
          })
          .catch((error) => {
             /*this.$notify({
              title: 'Error',
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
        }
      });
    },
    getCategories() {
      this.$store.dispatch('getCategories', {});
    },
    getUnits() {
      this.$store.dispatch('getUnits', {});
    },
    getTaxTypes() {
      this.$store.dispatch('getTaxTypes', {});
    },
    getCurrencies() {
      this.$store.dispatch('getCurrencies', {});
    }
  },
  created() {
    this.getItemDetail();
    this.getCategories();
    this.getUnits();
    this.getTaxTypes();
    this.getCurrencies();
  }
}
</script>

<style scope>

.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}

</style>

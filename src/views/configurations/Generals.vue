<template>
<div class="row">
  <div class="col-md-12" v-loading="loading" element-loading-text="Guardando datos...">
    <form @submit.prevent="store()" enctype="multipart/form-data">
      <div class="row">
          <div class="col-md-6">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">Configuraciones Generales</h4>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label>
                    Nombre Cotización(preforma...)
                    <el-tooltip class="item" effect="dark" content="El nombre que aparecera en todo el sistema y documentos para tus cotizaciónes" placement="top-start">
                      <i class="fa fa-question-circle text-primary"></i>
                    </el-tooltip>
                  </label>
                  <el-input v-model="config.custom_quotation_name" v-validate="'required'" name="custom_quotation_name"  class="form-control"/>
                  <label v-show="errors.has('custom_quotation_name')" class="error">
                    {{ errors.first('custom_quotation_name') }}
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    Moneda sistema
                    <el-tooltip class="item" effect="dark" content="Es la moneda que mostrara el sitema en el dashboard y en los reportes" placement="top-start">
                      <i class="fa fa-question-circle text-primary"></i>
                    </el-tooltip>
                  </label>
                  <el-select
                    placeholder=""
                    no-data-text="No hay datos."
                    no-match-text="No hay resultados."
                    v-model="config.currency"
                    value-key="id" name="currency"
                    v-validate="'required'"
                    filterable
                    class="form-control ml-3"
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

                <div class="form-group">
                  <label>
                    Modo POS
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        Cuando el modo POS esta activo habilita un buscador de productos
                        <br> al momento de generar documentos que agiliza el proceso
                        <br> pensado en puntos de venta
                      </div>
                      <i class="fa fa-question-circle text-primary"></i>
                    </el-tooltip>
                  </label>
                  <el-switch
                  class="ml-4"
                    v-model="config.mode_pos"
                    name="test"
                    active-text="SI"
                    inactive-text="NO">
                  </el-switch>
                </div>

                <div class="form-group">
                  <label>
                    Moneda por defecto al emitir documentos
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        Con esta opción puedes elegir una moneda por defecto
                        <br> que aparezca preseleccionada al emitir documentos
                        <br>o dejalo en preguntar para que siempre te pregunte el tipo de moneda.
                      </div>
                      <i class="fa fa-question-circle text-primary"></i>
                    </el-tooltip>
                  </label>
                  <el-select placeholder="" v-model="config.currency_emit_doc" name="currency_emit_doc" v-validate="'required'" filterable class="form-control ml-4">
                    <el-option
                      v-for="item in currencies_emit_docs"
                      :key="item.value"
                      :label="item.text"
                      :value="item"
                      >
                    </el-option>
                  </el-select>
                  <label v-show="errors.has('currency_emit_doc')" class="error">
                    {{ errors.first('currency_emit_doc') }}
                  </label>
                </div>



              </div>
            </div>
          </div>
         
               
          <div class="col-md-12 text-center pt-5">
            <button type="submit" class="btn btn-lg btn-success">
              <i class="fa fa-save"></i>
              Guardar
            </button>
          </div>

        </div>
    </form>
  </div>
</div>
</template>

<script>
import configurationService from '@/services/configurations.service';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'config-generals',
  data() {
    return {
      config: {
        company_id: "",
        custom_quotation_name: "",
        currency: {
          id: "",
          symbol: "",
          name: ""
        },
        mode_pos: false,
        currency_emit_doc: 0
      },
      currencies_emit_docs: [
        {text: 'Preguntar', value: 0},
        {text: 'Colones', value: 2},
        {text: 'Dolares', value: 1}
      ],
      loading: false
    }
  },
  computed: {
    ...mapState(['currencies']),
  },
  methods: {
    ...mapActions(['getCurrencies']),
    store() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.config.company_id = this.$route.params.company_id;
          this.loading = true;
          configurationService.storeGeneralConfiguration(this.config)
          .then(res => {
            this.$CurrencyFilter.setConfig({symbol : this.config.currency.symbol,
              thousandsSeparator: '.',
              fractionCount: 2,
              fractionSeparator: ',',
              symbolPosition: 'front',
              symbolSpacing: false
            });

            let config = JSON.parse(JSON.stringify(this.config));
            config.currency_emit_doc = this.config.currency_emit_doc.value;

            this.$store.commit('updateCurrentCurrency', {current_currency : this.config.currency});
            this.$store.commit('updateGeneralConfigurations', {general_configurations: config});
            //this.$snotify.success('Configuración guardada correctamente');
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Configuración guardada correctamente',
              type: 'success'
            });

            this.loading = false;
          })
          .catch(() => {
            /*this.$notify({
              title: 'Ocurrio un problema',
              type: 'error'
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Ocurrio un problema',
              type: 'error'
            });
            this.loading = false;
          })
        } else {
            /*this.$notify({
              title: 'faltan datos',
              type: 'error'
            });*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'faltan datos',
              type: 'error'
            });
            this.loading = false;
        }
      });  
    },
    getConfiguration() {
      let company_id = this.$route.params.company_id;
      configurationService.getGeneralConfigurations(company_id)
      .then(res => {
          this.config.currency = JSON.parse(res.data.currency);
          this.config.custom_quotation_name = res.data.custom_quotation_name;
          this.config.mode_pos = (res.data.mode_pos && res.data.mode_pos != 0) ? true : false;
          let currency_db = res.data.currency_emit_doc ? res.data.currency_emit_doc : 0;
          let currency = this.currencies_emit_docs.find(i => i.value == currency_db);
          this.config.currency_emit_doc = currency ? currency : {text: 'preguntar', value: 0};
      })
      .catch(() => {
        alert('error')
      });
    }
  },
  created() {
    this.getCurrencies();
    this.getConfiguration();
  }
}
</script>

<style scoped>
  .el-input-number {
    width: 100% !important;
  }
  .el-input-number .el-input__inner {
    text-align: left !important;
  }
  .el-switch {
    display: block;
  }

  .form-group {
    padding-top: 1.2em;
  }
</style>

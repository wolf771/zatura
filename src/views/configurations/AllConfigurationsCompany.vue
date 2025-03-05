<template>
  <div class="row">
    <div
      class="col-md-12"
      v-loading="loading"
      element-loading-text="Guardando datos..."
    >
      <div class="col-md-12">
        <div class="col-md-12">
          <form @submit.prevent="updateCompanyConfig()">
            <div class="row">
              <div class="col-md-4">
                <div class="card vx-card">
                  <div class="card-header bg-white">
                    <h4 class="card-title">Detalle</h4>
                  </div>

                  <div class="card-body">
                    <text-input
                      name="name"
                      :label="'Nombre'"
                      v-validate="'required'"
                      :error="errors.first('name')"
                      v-model="company.name"
                      data-vv-as="Nombre"
                    >
                    </text-input>

                    <div class="form-group">
                      <label for="">
                        Nombre Fantasia
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            Si quiere colocar un nombre personalizado de su
                            negocio<br />
                            diferente al registrado en hacienda y este salga en
                            sus <br />
                            facturas llene este campo si no dejelo vacio.
                          </div>
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <text-input
                        name="fantasy_name"
                        v-model="company.fantasy_name"
                        data-vv-as="Nombre Fantasia"
                      >
                      </text-input>
                    </div>

                    <div class="form-group">
                      <label>Tipo identificación</label>
                      <el-select
                        placeholder=""
                        v-model="company.identification_type"
                        name="identification_type"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="item in identification_types"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <label
                        v-show="errors.has('identification_type')"
                        class="error"
                      >
                        {{ errors.first("identification_type") }}
                      </label>
                    </div>

                    <text-input
                      name="identification"
                      :label="'Identificación'"
                      v-validate="rulesIdentification"
                      :error="errors.first('identification')"
                      v-model="company.identification"
                    >
                    </text-input>

                    <text-input
                      name="email"
                      :label="'Email Principal'"
                      v-validate="'required|email'"
                      :error="errors.first('email')"
                      v-model="company.email"
                    >
                    </text-input>

                    <text-input
                      name="phone"
                      :label="'Teléfono'"
                      v-validate="'required|integer'"
                      :error="errors.first('phone')"
                      v-model="company.phone"
                    >
                    </text-input>

                    <div class="form-group">
                      <label>Logo </label>
                      <small class="text-primary">
                        Para cambiar el logo elige uno nuevo.</small
                      >
                      <!-- <img class="logo" :src="company.logo" alt="logo"> -->
                      <el-image
                        style="width: 100px; height: 100px;display:block"
                        :src="company.logo"
                        fit="scale-down"
                      ></el-image>
                      <el-upload
                        ref="upload"
                        action="#"
                        :auto-upload="false"
                        :limit="1"
                        :on-change="logoSelect"
                        :on-exceed="logoExceed"
                        :on-remove="logoRemove"
                        :file-list="fileList"
                        :multiple="false"
                      >
                        <el-button slot="trigger" size="small" type="primary"
                          >Subir Logo</el-button
                        >
                      </el-upload>
                    </div>

                    <div
                      class="form-group"
                      v-if="
                        user.rol === 'admin' &&
                          user.email === 'valery@zaturacr.com'
                      "
                    >
                      <text-input
                        name="database"
                        :label="'Base de datos'"
                        :error="errors.first('database')"
                        v-model="company.database"
                      >
                      </text-input>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="card vx-card">
                  <div class="card-header bg-white">
                    <h4 class="card-title">Ubicación</h4>
                  </div>

                  <div class="card-body">
                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('country') }
                      ]"
                    >
                      <label>País</label>
                      <el-select
                        v-model="company.country"
                        name="country"
                        value-key="id"
                        v-validate="'required'"
                        placeholder=""
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="country in countries"
                          :value="country"
                          :key="country.id"
                          :label="country.name"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('country')" class="error">
                        {{ errors.first("country") }}
                      </label>
                    </div>

                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('province') }
                      ]"
                    >
                      <label>Provincia</label>
                      <el-select
                        @change="getCantons()"
                        v-model="company.province"
                        value-key="number"
                        name="province"
                        v-validate="'required'"
                        placeholder=""
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="province in provinces"
                          :selected="province.id == 1 ? 'selected' : ''"
                          :value="province"
                          :key="province.number"
                          :label="province.name"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('province')" class="error">
                        {{ errors.first("province") }}
                      </label>
                    </div>

                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('canton') }
                      ]"
                    >
                      <label>Cantón</label>
                      <el-select
                        no-data-text="No hay datos"
                        value-key="number"
                        no-match-text="No hay coincidencias"
                        @change="getDistricts()"
                        v-model="company.canton"
                        name="canton"
                        v-validate="'required'"
                        placeholder=""
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="canton in cantons"
                          :value="canton"
                          :key="canton.number"
                          :label="canton.name"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('canton')" class="error">
                        {{ errors.first("canton") }}
                      </label>
                    </div>

                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('district') }
                      ]"
                    >
                      <label>Distrito</label>
                      <el-select
                        v-model="company.district"
                        name="district"
                        value-key="id"
                        v-validate="'required'"
                        placeholder=""
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="district in districts"
                          :value="district"
                          :key="district.id"
                          :label="district.name"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('district')" class="error">
                        {{ errors.first("district") }}
                      </label>
                    </div>

                    <text-input
                      name="other_signs"
                      :label="'Otras Señas'"
                      v-validate="'required'"
                      :error="errors.first('other_signs')"
                      v-model="company.other_signs"
                    >
                    </text-input>

                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('economic_activity') }
                      ]"
                    >
                      <label>Actividad Economica</label>
                      <el-select
                        v-model="company.economic_activity"
                        name="economic_activity"
                        value-key="id"
                        v-validate="'required'"
                        placeholder=""
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="economic_activity in economic_activities"
                          :value="economic_activity"
                          :key="economic_activity.id"
                          :label="economic_activity.name"
                        >
                        </el-option>
                      </el-select>
                      <label
                        v-show="errors.has('economic_activity')"
                        class="error"
                      >
                        {{ errors.first("economic_activity") }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- configuracion  -->
              <div class="col-md-4">
                <div class="card vx-card">
                  <div class="card-header bg-white">
                    <h4 class="card-title">Preferencias</h4>
                  </div>

                  <div class="card-body">
                    <div class="form-group">
                      <label>
                        Nombre Cotización(preforma...)
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="El nombre que aparecera en todo el sistema y documentos para tus cotizaciónes"
                          placement="top-start"
                        >
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-input
                        v-model="config.custom_quotation_name"
                        v-validate="'required'"
                        name="custom_quotation_name"
                        class="form-control"
                      />
                      <label
                        v-show="errors.has('custom_quotation_name')"
                        class="error"
                      >
                        {{ errors.first("custom_quotation_name") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>
                        Moneda sistema
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="Es la moneda que mostrara el sitema en el dashboard y en los reportes"
                          placement="top-start"
                        >
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-select
                        placeholder=""
                        no-data-text="No hay datos."
                        no-match-text="No hay resultados."
                        v-model="config.currency"
                        value-key="id"
                        name="currency"
                        v-validate="'required'"
                        filterable
                        class="form-control ml-3"
                      >
                        <el-option
                          v-for="currency in currencies"
                          :key="currency.id"
                          :label="`${currency.name} (${currency.symbol})`"
                          :value="currency"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('currency')" class="error">
                        {{ errors.first("currency") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>
                        Modo POS
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            Cuando el modo POS esta activo habilita un buscador
                            de productos
                            <br />
                            al momento de generar documentos que agiliza el
                            proceso <br />
                            pensado en puntos de venta
                          </div>
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-switch
                        class="ml-4"
                        v-model="config.mode_pos"
                        name="test"
                        active-text="SI"
                        inactive-text="NO"
                      >
                      </el-switch>
                    </div>

                    <div class="form-group">
                      <label>
                        Moneda por defecto al emitir documentos
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            Con esta opción puedes elegir una moneda por defecto
                            <br />
                            que aparezca preseleccionada al emitir documentos
                            <br />o dejalo en preguntar para que siempre te
                            pregunte el tipo de moneda.
                          </div>
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-select
                        placeholder=""
                        v-model="config.currency_emit_doc"
                        name="currency_emit_doc"
                        v-validate="'required'"
                        filterable
                        class="form-control ml-4"
                      >
                        <el-option
                          v-for="item in currencies_emit_docs"
                          :key="item.value"
                          :label="item.text"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                      <label
                        v-show="errors.has('currency_emit_doc')"
                        class="error"
                      >
                        {{ errors.first("currency_emit_doc") }}
                      </label>
                    </div>

                    <div class="form-group" v-if="user.rol === 'admin'">
                      <label>
                        Plan
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            Plan por el momento puede elegir solo recepción,
                            full facturación o Escuela.
                          </div>
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-select
                        placeholder=""
                        v-model="company.permission"
                        name="permission"
                        v-validate="'required'"
                        filterable
                        class="form-control ml-4"
                      >
                        <el-option
                          v-for="item in permissions"
                          :key="item.value"
                          :label="item.text"
                          :value="item"
                        >
                        </el-option>
                      </el-select>

                      <label v-show="errors.has('permission')" class="error">
                        {{ errors.first("permission") }}
                      </label>
                    </div>

                    <div class="form-group" v-if="user.rol === 'admin'">
                      <label style="width: 100%">
                        Apagar generación de XMLS Hacienda
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            Si pones esta opción en SI se generaran facturas
                            <br />
                            pero sin que se generen xml de las mismas <br />
                            y sin envió a hacienda
                          </div>
                          <i class="fa fa-question-circle text-primary"></i>
                        </el-tooltip>
                      </label>
                      <el-switch
                        class="ml-4"
                        v-model="company.stop_generate_xmls"
                        name="test"
                        active-text="SI"
                        inactive-text="NO"
                      >
                      </el-switch>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end configuracion -->
            </div>
            <div class="col-md-12 text-right">
              <vs-button type="gradient" button="submit">
                <i class="fa fa-save"></i>
                Guardar
              </vs-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";
import companiesService from "@/services/companies.service";
import configurationService from "@/services/configurations.service";
import utilitiesService from "@/services/utilities.service";
import helpers from "@/helpers/helpers";
import Config from "@/config";
import { mapState, mapActions } from "vuex";

export default {
  name: "all-configurations-company",
  data() {
    return {
      company: {
        name: "",
        fantasy_name: "",
        identification_type: "",
        identification: "",
        email: "",
        phone: "",
        country: "",
        province: "",
        canton: "",
        district: "",
        other_signs: "",
        database: "",
        logo: "",
        logo_file: null,
        economic_activity: "",
        permission: {
          text: "",
          value: ""
        }
      },
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
      fileList: [],
      //Config
      currencies_emit_docs: [
        { text: "Preguntar", value: 0 },
        { text: "Colones", value: 2 },
        { text: "Dolares", value: 1 }
      ],
      permissions: [
        { text: "Plan full", value: "1" },
        { text: "Plan solo recepción", value: "2" },
        { text: "Plan Escuelas", value: "3" },
        { text: "Plan 100 anual", value: "4" }
      ],
      loading: false,
      economic_activities: []
    };
  },
  computed: {
    ...mapState([
      "identification_types",
      "countries",
      "provinces",
      "cantons",
      "districts",
      "currencies",
      "user",
      "company_default"
    ]),
    id() {
      return this.$route.params.company_id;
    },
    rulesIdentification() {
      if (
        this.company.identification_type == "01" ||
        this.company.identification_type == "02" ||
        this.company.identification_type == "03" ||
        this.company.identification_type == "04"
      ) {
        return "required|min:9|max:12";
      } else {
        return "required";
      }
    },
    url_logo() {
      return Config.url_files;
    }
  },
  methods: {
    ...mapActions(["getCurrencies"]),
    logoSelect(file) {
      console.log(file);
      this.fileList.push(file);
      this.company.logo_file = file.raw;
      this.company.logo = file.raw;

      this.company.logo = URL.createObjectURL(file.raw);
    },
    logoExceed(file) {
      this.fileList = [];
      this.company.logo_file = file;

      this.fileList.push(file[0]);
      this.company.logo = file[0];
    },
    logoRemove() {
      (this.company.logo_file = null((this.fileList = []))),
        (this.company.logo = null);
    },
    getCompany() {
      companiesService
        .getCompanyDetail(this.id)
        .then(res => {
          this.getCountries();
          this.getProvinces(true);
          this.company = res.data;
          this.company.permission = this.permissions.find(
            i => i.value == this.company.permission
          );
          this.company.logo = this.url_logo + res.data.logo;
          this.company.stop_generate_xmls = this.company.stop_generate_xmls
            ? true
            : false;
        })
        .catch(error => {
          /*this.$notify({
          title: 'Problema',
          message: error.message,
          type: 'error'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: error.message,
            type: "error"
          });
        });
    },
    updateCompanyConfig() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let formData = new FormData();
          this.loading = true;
          //Datos company
          Object.keys(this.company).forEach(key => {
            let value;
            if (
              typeof this.company[key] === "object" &&
              !(this.company[key] instanceof File)
            ) {
              value = JSON.stringify(this.company[key]);
            } else {
              value = this.company[key];
            }
            formData.append(key, value);
          });

          //Datos config
          Object.keys(this.config).forEach(key => {
            let value;
            if (
              typeof this.config[key] === "object" &&
              !(this.config[key] instanceof File)
            ) {
              value = JSON.stringify(this.config[key]);
            } else {
              value = this.config[key];
            }
            formData.append(key, value);
          });

          companiesService
            .updateCompanyConfig(formData)
            .then(res => {
              if (res.data.success) {
                this.$CurrencyFilter.setConfig({
                  symbol: this.config.currency.symbol,
                  thousandsSeparator: ".",
                  fractionCount: 2,
                  fractionSeparator: ",",
                  symbolPosition: "front",
                  symbolSpacing: false
                });

                //Setear correctamente laconfiguracion en el store
                //Sin afectar el objeto config original
                let config = JSON.parse(JSON.stringify(this.config));
                config.currency_emit_doc = this.config.currency_emit_doc.value;

                if (this.company_default.id == this.company.id) {
                  this.$store.commit("updateCurrentCurrency", {
                    current_currency: this.config.currency
                  });
                  this.$store.commit("updateGeneralConfigurations", {
                    general_configurations: config
                  });
                }

                /*this.$notify({
              title: 'Guardado correctamente',
              type: 'success'
            })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: "Guardado correctamente",
                  type: "success"
                });
                this.loading = false;
              } else {
                /*this.$notify({
              title: res.data.errors.identification,
              type: 'error'
            })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: res.data.errors.identification,
                  type: "error"
                });
                this.loading = false;
              }
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
                type: "error"
              });
              this.loading = false;
            });
        }
      });
    },
    getCountries() {
      this.$store.dispatch("getCountries", {});
    },
    getProvinces(preselect = false) {
      this.$store.dispatch("getProvinces", {}).then(res => {
        this.getCantons(preselect);
      });
    },
    getCantons(preselect = false) {
      this.$store
        .dispatch("getCantons", { province: this.company.province.number })
        .then(res => {
          if (!preselect) {
            this.company.canton = this.company.canton;
          }
          this.getDistricts(preselect);
        });
    },
    getDistricts(preselect = false) {
      this.$store
        .dispatch("getDistricts", {
          province: this.company.province.number,
          canton: this.company.canton.number
        })
        .then(res => {
          if (!preselect) {
            this.company.district = res[0];
          }
        });
    },
    //Config
    getConfiguration() {
      let company_id = this.$route.params.company_id;
      configurationService
        .getGeneralConfigurations(company_id)
        .then(res => {
          this.config.currency = JSON.parse(res.data.currency);
          this.config.custom_quotation_name = res.data.custom_quotation_name;
          this.config.mode_pos =
            res.data.mode_pos && res.data.mode_pos != 0 ? true : false;
          let currency_db = res.data.currency_emit_doc
            ? res.data.currency_emit_doc
            : 0;
          let currency = this.currencies_emit_docs.find(
            i => i.value == currency_db
          );
          this.config.currency_emit_doc = currency
            ? currency
            : { text: "preguntar", value: 0 };
        })
        .catch(() => {
          alert("error");
        });
    },
    getEconomicActivities() {
      utilitiesService
        .getEconomicActivities()
        .then(res => {
          this.economic_activities = res.data;
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  created() {
    this.getCompany();
    this.getCurrencies();
    this.getConfiguration();
    this.getEconomicActivities();
  },
  components: {
    TextInput
  }
};
</script>

<style scoped>
.form-group {
  padding-top: 1em;
}

.logo {
  max-width: 100px;
  max-height: 700px;
  width: auto;
  height: auto;
  margin-bottom: 8px;
}
</style>

<template>
<div class="row" v-loading="loading">
  <div class="col-md-12">
    <div class="col-md-12">
      <div class="col-md-12">
        <form @submit.prevent="storeCompany()">
        <div class="row">
          <div class="col-md-6">

            <div class="card">

              <div class="card-header card-header-success card-header-icon">
                <div class="card-icon">
                  <i class="material-icons">person_pin</i>
                </div>
                <h4 class="card-title">Detalle</h4>
              </div>

              <div class="card-body">
                <text-input
                  name="name"
                  :label="'Nombre'"
                  v-validate="'required'"
                  :error="errors.first('name')"
                  v-model="company.name"
                  data-vv-as="Nombre">
                </text-input>

              <div class="form-group">
                <label for="">
                  Nombre Fantasia
                  <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        Si quiere colocar un nombre personalizado de su negocio<br />
                        diferente al registrado en hacienda y este salga en sus <br />
                        facturas llene este campo si no dejelo vacio.
                      </div>
                      <i class="fa fa-question-circle text-primary"></i>
                    </el-tooltip>
                </label>
                <text-input
                  name="fantasy_name"
                  v-model="company.fantasy_name"
                  data-vv-as="Nombre Fantasia">
                </text-input>
              </div>
                 
                <div class="form-group">
                  <label>Tipo identificación</label>
                  <el-select placeholder="" v-model="company.identification_type" name="identification_type" v-validate="'required'" filterable class="form-control">
                    <el-option
                      v-for="item in identification_types"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <label v-show="errors.has('identification_type')" class="error">
                    {{ errors.first('identification_type') }}
                  </label>
                </div>

                <text-input
                  name="identification"
                  :label="'Identificación'"
                  v-validate="rulesIdentification"
                  :error="errors.first('identification')"
                  v-model="company.identification">
                </text-input>

                

                <text-input
                  name="email"
                  :label="'Email Principal'"
                  v-validate="'required|email'"
                  :error="errors.first('email')"
                  v-model="company.email">
                </text-input>

                <text-input
                  name="phone"
                  :label="'Teléfono'"
                  v-validate="'required|integer'"
                  :error="errors.first('phone')"
                  v-model="company.phone">
                </text-input>

                <div class="form-group">
                  <el-upload
                    ref="upload"
                    action="#"
                    :auto-upload="false"
                    :limit="1"
                    :on-change="logoSelect"
                    :on-exceed="logoExceed"
                    :on-remove="logoRemove"
                    :file-list="fileList"
                    :multiple="false">
                    <el-button slot="trigger" size="small" type="primary">Subir Logo</el-button>
                  </el-upload>
                </div>

                <div class="form-group" v-if="user.email == 'valery@zaturacr.com'">
                  <text-input
                    name="database"
                    :label="'Base de datos'"
                    v-validate="'required'"
                    :error="errors.first('database')"
                    v-model="company.database" disabled>
                  </text-input>
                </div>
              

              </div>

            </div>
          </div>
          
          <div class="col-md-6">
             <div class="card">

              <div class="card-header card-header-success card-header-icon">
                <div class="card-icon">
                  <i class="material-icons">place</i>
                </div>
                <h4 class="card-title">Ubicación</h4>
              </div>

            <div class="card-body">
            <div :class="['form-group', {'has-danger': errors.has('country') }]">
              <label>País</label>
              <el-select v-model="company.country" name="country" value-key="id" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option v-for="country in countries"
                  :value="country"
                  :key="country.id"
                  :label="country.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('country')" class="error">
                {{ errors.first('country') }}
              </label>
            </div>

             <div :class="['form-group', {'has-danger': errors.has('province') }]">
              <label>Provincia</label>
              <el-select @change="getCantons()" v-model="company.province" value-key="number" name="province" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option
                  v-for="province in provinces"
                  :selected="province.id == 1 ? 'selected' : ''"
                  :value="province"
                  :key="province.number"
                  :label="province.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('province')" class="error">
                {{ errors.first('province') }}
              </label>
            </div>

             <div :class="['form-group', {'has-danger': errors.has('canton') }]">
              <label>Cantón</label>
              <el-select no-data-text="No hay datos" value-key="number" no-match-text="No hay coincidencias" @change="getDistricts()" v-model="company.canton" name="canton" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option 
                  v-for="canton in cantons"
                  :value="canton"
                  :key="canton.number"
                  :label="canton.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('canton')" class="error">
                {{ errors.first('canton') }}
              </label>
            </div>

            <div :class="['form-group', {'has-danger': errors.has('district') }]">
              <label>Distrito</label>
              <el-select v-model="company.district" name="district" value-key="id" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option
                  v-for="district in districts"
                  :value="district"
                  :key="district.id"
                  :label="district.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('district')" class="error">
                {{ errors.first('district') }}
              </label>
            </div>

             <text-input
              name="other_signs"
              :label="'Otras Señas'"
              v-validate="'required'"
              :error="errors.first('other_signs')"
              v-model="company.other_signs">
            </text-input>

              </div>
              </div>     
          </div>
          </div>
          <div class="col-md-12 text-right">
            <button type="submit" class="btn btn-success">
              <i class="fa fa-save"></i>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>      
</template>

<script>
import TextInput from '@/components/TextInput.vue'
import companiesService from '@/services/companies.service'
import helpers from '@/helpers/helpers'
import { mapState } from 'vuex'
import utilitiesService from '@/services/utilities.service';

export default {
  name: 'new-company',
  data() {
    return {
      company: {
        name: "",
        fantasy_name: "",
        identification_type: "",
        identification: "",
        email: "",
        phone: "",
        country:  {id: 60},
         province: {
          id: 1,
          number: 1
        },
        canton: {
          id: 1,
          number: "01"
        },
        district: {
          id: 1
        },
        other_signs: "",
        logo: null,
        database: ""
      },
      fileList: [],
      loading: false
    }
  },
  computed: {
    ...mapState(['user','identification_types','countries','provinces','cantons','districts']),
    
    rulesIdentification() {
      return helpers.validateIdentificationLength(this.company.identification_type)
    }
  },
  methods: {
    getAvailableDatabase() {
      utilitiesService.getAvailableDatabase()
      .then(res => {
        this.company.database = res.data.database
      })
      .catch(error => {
        /*this.$notify({
          type: 'error',
          title: error.message
        })*/
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: error.message,
          type: 'error'
        });
      })
    },
    logoSelect(file) {
      this.fileList.push(file)
      this.company.logo = file.raw
    },
    logoExceed(file) {
      this.fileList = []
      this.fileList.push(file[0]);
      this.company.logo = file[0];
    },
    logoRemove() {
      this.fileList = [],
      this.company.logo = null;
    },
    storeCompany() {
      this.$validator.validate().then(valid => {
      if (valid) {
        let formData = new FormData();
          Object.keys(this.company).forEach(key => {
            let value;

            if(typeof this.company[key] === 'object' && !(this.company[key] instanceof File)) {
              value = JSON.stringify(this.company[key])
            } else {
              value = this.company[key]
            }
            formData.append(key, value)
          });
        this.loading = true;  
        companiesService.storeCompany(formData)
        .then(res => {
          if(res.data.success) {
            /*this.$notify({
              title: 'Compañia guardada',
              type: 'success'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Compañia guardada',
              type: 'success'
            });
            this.$router.push({name: 'all-companies'})
          } else {
            /*this.$notify({
              title: res.data.errors.identification,
              type: 'error'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: res.data.errors.identification,
              type: 'error'
            });
          }
          this.loading = false;
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
      }
      });  
    },
    getCountries() {
     this.$store.dispatch('getCountries', {});
    },
     getProvinces() {
      this.$store.dispatch('getProvinces', {});
      this.getCantons();
    },
    getCantons() {
      this.$store.dispatch('getCantons', {province: this.company.province.number})
      .then(res => {
        this.company.canton = res[0];
        this.getDistricts();
      });
    },
    getDistricts() {
      let province = this.company.province.number;
      let canton = this.company.canton.number;
      this.$store.dispatch('getDistricts', {province: province, canton: canton})
      .then(res => {
        this.company.district = res[0];
      });
    }

  },
  created() {
    this.getCountries();
    this.getProvinces();
    this.getAvailableDatabase();
  },
  components: {
    TextInput
  }
}
</script>

<style>

</style>

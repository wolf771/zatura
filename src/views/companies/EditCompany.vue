<template>
<div class="row">
  <div class="col-md-12">
    <div class="col-md-12">
      <div class="col-md-12">
        <form @submit.prevent="updateCompany()">
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
                    v-model="company.database">
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

export default {
  name: 'edit-company',
  data() {
    return {
      company: {
        name: "",
        identification_type: "",
        identification: "",
        email: "",
        phone: "",
        country: "",
        province: "",
        canton: "",
        district: "",
        other_signs: "",
        logo: null,
        database: ""
      },
      fileList: []
    }
  },
  computed: {
    ...mapState(['user', 'identification_types','countries','provinces','cantons','districts']),
    id() {
      return this.$route.params.id;
    },
    rulesIdentification() {
      if (
        this.company.identification_type == '01'
        || this.company.identification_type == '02'
        || this.company.identification_type == '03'
        || this.company.identification_type == '04'
      ) {
        return 'required|min:9|max:12'
      } else {
        return 'required'
      }
    }
  },
  methods: {
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
    getCompany() {
      companiesService.getCompanyDetail(this.id)
      .then(res => {
        this.getCountries();
        this.getProvinces(true);
        this.company = res.data;
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
          type: 'error'
        });
      })
    },
    updateCompany() {
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
        companiesService.updateCompany(formData)
        .then(res => {
          if(res.data.success) {
            /*this.$notify({
              title: 'Compañia actualizada',
              type: 'success'
            })*/
            //JRA Cambio de notificacion por mensaje
            this.$message({
              showClose: true,
              message: 'Compañia actualizada',
              type: 'success'
            });
            this.$router.push({'name': 'all-companies'})
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
        });
      }
      });  
    },
    getCountries() {
     this.$store.dispatch('getCountries', {});
    },
   getProvinces(preselect = false) {
      this.$store.dispatch('getProvinces', {})
      .then(res => {
        this.getCantons(preselect);
      });
      
    },
    getCantons(preselect = false) {
      this.$store.dispatch('getCantons', {province: this.company.province.number})
      .then(res => {
        if(!preselect) {
          this.company.canton = this.company.canton;
        }
        this.getDistricts(preselect);
      });
    },
    getDistricts(preselect = false) {
      this.$store.dispatch('getDistricts', {province: this.company.province.number, canton: this.company.canton.number})
      .then(res => {
        if(!preselect) {
          this.company.district = res[0];
        }
      });
    }
  },
  created() {
    this.getCompany();
  },
  components: {
    TextInput
  }
}
</script>

<style>

</style>

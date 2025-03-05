<template>
<div class="row">
  <div class="col-md-12" v-loading="loading" element-loading-text="Guardando...">
    <div class="col-md-12">
      <div class="col-md-12">
        <form @submit.prevent="storeClient()">
        <div class="row">
          <div class="col-md-6">

            <div class="vx-card">
              <div class="card-header bg-white">
                <h4 class="card-title">
                  <i class="fa fa-user"></i>
                  Detalle
                </h4>
              </div>

              <div class="card-body">

                <text-input
                  name="name"
                  :label="'Nombre'"
                  v-validate="'required'"
                  :error="errors.first('name')"
                  v-model="client.name"
                  data-vv-as="Nombre">
                </text-input>
                 
                <div class="form-group">
                  <label>Tipo identificación</label>
                  <el-select placeholder="" v-model="client.identification_type" name="identification_type" v-validate="'required'" filterable class="form-control">
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
                  v-model="client.identification">
                </text-input>

                <text-input
                  name="email"
                  :label="'Email Principal'"
                  v-validate="'required|email'"
                  :error="errors.first('email')"
                  v-model="client.email">
                </text-input>

                <text-input
                  name="phone"
                  :label="'Teléfono'"
                  v-validate="'required|integer'"
                  :error="errors.first('phone')"
                  v-model="client.phone">
                </text-input>

              </div>

            </div>
          </div>
          
          <div class="col-md-6">
             <div class="vx-card">

              <div class="card-header bg-white">
                <h4 class="card-title">
                  <i class="fa fa-map"></i>
                  Ubicación
                </h4>
              </div>

            <div class="card-body">
            <div :class="['form-group', {'has-danger': errors.has('country') }]">
              <label>País</label>
              <el-select v-model="client.country" value-key="id" name="country" v-validate="'required'" placeholder="" filterable class="form-control">
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
            <div v-show="showProvinceCantonDistrict"> <!-- provincia canton distrito -->
             <div :class="['form-group', {'has-danger': errors.has('province') }]">
              <label>Provincia</label>
              <el-select @change="getCantons()" value-key="id" v-model="client.province" name="province" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option
                  v-for="province in provinces"
                  :value="province"
                  :key="province.id"
                  :label="province.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('province')" class="error">
                {{ errors.first('province') }}
              </label>
            </div>

             <div :class="['form-group', {'has-danger': errors.has('canton') }]">
              <label>Cantón</label>
              <el-select no-data-text="No hay datos" value-key="id" no-match-text="No hay coincidencias" @change="getDistricts()" v-model="client.canton" name="canton" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option 
                  v-for="canton in cantons"
                  :value="canton"
                  :key="canton.id"
                  :label="canton.name">
                </el-option>
              </el-select>
              <label v-show="errors.has('canton')" class="error">
                {{ errors.first('canton') }}
              </label>
            </div>

            <div :class="['form-group', {'has-danger': errors.has('district') }]">
              <label>Distrito</label>
              <el-select v-model="client.district" value-key="id" name="district" v-validate="'required'" placeholder="" filterable class="form-control">
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
            </div>
              </div>
              </div>     
          </div>
              
        </div>

        <!-- Separator horizontal -->
        <div class="row">
          <h3 class="separator-horizontal">
            Contactos
          </h3>
        </div>

          <div class="row">
           
              <div v-for="(contact, index) in contacts" :key="index" class="col-md-6">
                <div class="vx-card">
                <div class="card-header bg-white">
                  <h4 class="card-title">Contacto {{ index + 1 }}</h4>
                </div>
                <div class="card-body">

                <text-input
                  :name="'name_'+ index"
                  :label="'Nombre'"
                  v-validate="`${contacts[index].email.length > 0 ? 'required' : ''}`"
                  :error="errors.first('name_'+ index)"
                  v-model="contacts[index].name">
                </text-input>
    
               <text-input
                  :name="'email_'+ index"
                  :label="'Email'"
                  v-validate="`${contacts[index].name.length > 0 ? 'required' : ''}`"
                  :error="errors.first('email_'+ index)"
                  v-model="contacts[index].email">
                </text-input>

                <div>
                  <button type="button" :class="['btn', 'btn-link', 'text-danger', 'float-right', {'oculto': notRemoveContact}]" @click="removeContact(index)">
                    - Remover contacto
                  </button>
                </div>
                </div>
                </div>
          </div> 
          <div class="col-md-12">
          <br>
          <hr />
          <button type="button" class="btn btn-link text-success font-weight-bold" @click="addContact(contacts.length)">
            + Agregar contacto
          </button>
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
import clientsService from '@/services/clients.service'
import helpers from '@/helpers/helpers'
import { mapState } from 'vuex'

export default {
  name: 'new-client',
  data() {
    return {
      client: {
        economic_activity: "",
        name: "",
        identification_type: "",
        identification: "",
        email: "",
        phone: "",
        country: {
          id: 60
        },
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
        contacts: [
          {
            name: "",
            email: ""
          }
        ]
      },
      loading: false    
    }
  },
  computed: {
    contacts: function() {
      return this.client.contacts
    },
    notRemoveContact() {
      return this.client.contacts.length == 1;
    },

    ...mapState(['countries',
                  'provinces',
                  'cantons',
                  'districts',
                  'identification_types']),
   
    rulesIdentification() {
      return helpers.validateIdentificationLength(this.client.identification_type)
    },
    showProvinceCantonDistrict() {
      return this.client.country.id !== 60 ? false : true;
    }
    
  },
  methods: {
    storeClient() {
      this.loading = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          let _this = this;
          let data = this.client;
          clientsService.storeClient(data)
          .then(function () {
            _this.loading = false;
            //_this.$snotify.success('Cliente Guardado Correctamente');
            //JRA Cambio de notificacion por mensaje
            _this.$message({
              showClose: true,
              message: 'Cliente Guardado Correctamente',
              type: 'success'
            });
            _this.$router.push({"name" : 'clients'});
          })
          .catch(function (error) {
            _this.loading = false;
            //_this.$snotify.error(error.response.data.message);
            //JRA Cambio de notificacion por mensaje
            _this.$message({
              showClose: true,
              message: error.response.data.message,
              type: 'error'
            });
          });
        }
      });
      this.loading = false;
    },
    addContact(newIndex) {
      if (this.client.contacts.length == 4) {
        //this.$snotify.info(`No puede agregar mas de ${this.client.contacts.length} contactos`);
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: `No puede agregar mas de ${this.client.contacts.length} contactos`,
          type: 'info'
        });
        return;
      }

      this.$set(this.client.contacts, newIndex, {
        name: "",
        email: ""
      });
    },
    removeContact(index) {
      if (this.client.contacts.length == 1) return;
      this.client.contacts.splice(index, 1);
    },
    getCountries() {
     this.$store.dispatch('getCountries', {});
    },
    getProvinces() {
      this.$store.dispatch('getProvinces', {});
      this.getCantons();
    },
    getCantons() {
      this.$store.dispatch('getCantons', {province: this.client.province.number})
      .then(res => {
        this.client.canton = res[0];
        this.getDistricts();
      });
    },
    getDistricts() {
      let province = this.client.province.number;
      let canton = this.client.canton.number;
      this.$store.dispatch('getDistricts', {province: province, canton: canton})
      .then(res => {
        this.client.district = res[0];
      });
    }

  },
  created() {
    this.getCountries();
    this.getProvinces();
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

<template>
  <div class="row bg-white">
    <div class="col-md-12">
      <div class="d-flex justify-content-between" style="padding:0.5em">
        <div class="">
          <h3 class="text-info text-capitalize">{{ client.name }}</h3>
        </div>
        <div>
          <vs-button  @click="newDocument('invoice')" v-if="!client.generic">
          <i class="fa fa-plus"></i>
          Nueva Factura
        </vs-button>
        <vs-button class="ml-2" @click="newDocument('ticket')">
          <i class="fa fa-plus"></i>
          Nuevo Tiquete
        </vs-button>
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <span style="position:absolute;right:10px;bottom:-40px;">
          <span class="text-warning font-weight-bold">
            Balance: <calc-price :price="client.balance"
                      :currency="current_currency.id"
                      :exchange_rate="1">
                    </calc-price>
          </span>
        </span>
      </div>
    </div>
    <br>
    <div class="col-md-12">
      <el-tabs type="card" @tab-click="changeTab">
        <el-tab-pane label="Información">
         <div class="col-md-12">
        <form @submit.prevent="updateClient()">
        <div class="row">
          <div class="col-md-6">

            <div class="card">

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
                  v-model="client.name">
                </text-input>
                 
                <div class="form-group">
                  <label>Tipo identificación</label>
                  <el-select placeholder="" v-model="client.identification_type" name="identification_type" v-validate="'required'" filterable class="form-control">
                    <el-option
                      v-for="quotation in identification_types"
                      :key="quotation.value"
                      :label="quotation.text"
                      :value="quotation.value">
                    </el-option>
                  </el-select>
                  <label v-show="errors.has('identification_type')" class="error">
                    {{ errors.first('identification_type') }}
                  </label>
                </div>

                <text-input
                  name="identification"
                  :label="'Identificación'"
                  v-validate="'required'"
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
             <div class="card">

              <div class="card-header bg-white">
                <h4 class="card-title">
                  <i class="fa fa-map"></i>
                  Ubicación
                </h4>
              </div>

              <div class="card-body">
            <div :class="['form-group', {'has-danger': errors.has('country') }]">
              <label>País</label>
              <el-select v-model="client.country" name="country" value-key="id" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option v-for="country in countries"
                  :value="country"
                  :key="country.code"
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
              <el-select @change="getProvinces()" v-model="client.province" value-key="number" name="province" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option
                  :data-valor="province.number"
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
              <el-select @change="getCantons()" value-key="number" v-model="client.canton" name="canton" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option 
                  :data-province="canton.province_number"
                  :data-canton="canton.number"
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
              <el-select v-model="client.district" value-key="number" name="district" v-validate="'required'" placeholder="" filterable class="form-control">
                <el-option
                  v-for="district in districts"
                  :value="district"
                  :key="district.number"
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

      
          <hr />
          <div class="row">
              <h3 class="separator-horizontal">
                Contactos
              </h3>
          </div>
          <div class="row">
           
              <div v-for="(contact, index) in contacts" :key="index" class="col-md-6">
                <div class="card">
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
          <button type="button" class="btn btn-link text-success" @click="addContact(contacts.length)">
            + Agregar contacto
          </button>
          </div>
          </div>
          <div class="col-md-12 text-right p-5">
            <button type="submit" class="btn btn-success">
              <i class="fa fa-save"></i>
              Guardar
            </button>
          </div>
        </form>
      </div>
        </el-tab-pane>
        <!-- start cotizaciones -->
        <el-tab-pane label="Cotizaciones">
          <div class="d-flex"  v-if="quotations.length">
            <table class="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Subtotal</th>
                  <th>Descuento</th>
                  <th>IVA</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quotation in quotations" :key="quotation.id">
                    <td>
                      <router-link class="link" :to="{name: 'detail-transaction', params: {type: 'quotation', id: quotation.id}}">
                        {{ quotation.reference }}
                      </router-link>
                    </td>
                  
                    <td>
                      <calc-price :price="quotation.subtotal"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate">
                      </calc-price>
                    </td>
                    <td>
                      <calc-price :price="quotation.discount"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate">
                      </calc-price>
                    </td>
                    <td>
                      <calc-price :price="quotation.tax"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate">
                      </calc-price>
                    </td>
                    <td>
                        <calc-price :price="quotation.total"
                          :currency="quotation.currency_id"
                          :exchange_rate="quotation.exchange_rate">
                        </calc-price>
                    </td>
                    <td>{{ quotation.created_at | moment('DD/MM/YYYY')}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 v-if="!quotations.length" class="text-center">
            Sin cotizaciones
          </h3>
        </el-tab-pane>
        <!-- end cotizaciones -->
        <!-- start invoices -->
        <el-tab-pane label="Facturas">
          <div class="d-flex" v-if="invoices.length">
            <table class="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Total</th>
                  <th>Monto pagado</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Hacienda</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in invoices" :key="invoice.id">
                    <td>
                      <router-link class="link" :to="{name: 'detail-transaction', params: {type: 'invoice', id: invoice.id}}">
                        {{ invoice.reference }}
                      </router-link>
                    </td>
                    <td>
                      <calc-price :price="invoice.total" :currency="invoice.currency_id" :exchange_rate="invoice.exchange_rate" ></calc-price>
                    </td>
                    <td>
                      <calc-price :price="invoice.payment_amount" :currency="invoice.currency_id" :exchange_rate="invoice.exchange_rate"></calc-price> 
                    </td>
                    <td>
                      <status-payment :total="invoice.total" :payment_amount="invoice.payment_amount">
                      </status-payment>
                    </td>
                    <td>{{ invoice.created_at | moment('DD/MM/YYYY')}}</td>
                    <td>
                      <status-hacienda :status="invoice.hacienda"></status-hacienda>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>        
          <h3 v-if="!invoices.length" class="text-center">
            Sin Facturas
          </h3>
        </el-tab-pane>
        <!-- end invoices -->
        <!-- start tickets -->
        <el-tab-pane label="Tiquetes">
           <div class="d-flex"  v-if="tickets.length">
          <table class="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Hacienda</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets" :key="ticket.id">
                  <td>
                    <router-link class="link" :to="{name: 'detail-transaction', params: {type: 'ticket', id: ticket.id}}">
                      {{ ticket.reference }}
                    </router-link>
                  </td>
                  <td>
                    <calc-price :price="ticket.total"
                      :currency="ticket.currency_id"
                      :exchange_rate="ticket.exchange_rate">
                    </calc-price>
                  </td>
                
                  <td>{{ ticket.created_at | moment('DD/MM/YYYY')}}</td>
                  <td>
                    <status-hacienda :status="ticket.hacienda"></status-hacienda>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 v-if="!tickets.length" class="text-center">
            Sin Tiquetes
          </h3>
        </el-tab-pane>
        <!-- end tickets -->
        <!-- start payments -->
        <!-- <el-tab-pane label="Pagos">
          <h3 v-if="!quotations.length" class="text-center">
            Sin cotizaciones
          </h3>
        </el-tab-pane> -->
        <!-- end payments -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import clientsService from '@/services/clients.service';
import CalcPrice from '@/components/CalcPrice';
import StatusPayment from '@/components/StatusPayment.vue';
import StatusHacienda from '@/components/StatusHacienda.vue';
import { mapState } from "vuex";

export default {
  name: 'client-detail',
  components: {
    CalcPrice,
    StatusPayment,
    StatusHacienda
  },
  data() {
    return {
      id: this.$route.params.id,
      client: {
        name: "",
        identification_type: "",
        identification: "",
        email: "",
        country: {},
        province: {},
        canton: {},
        district: {},
        contacts: [
          {
            name: "",
            email: ""
          }
        ]
      },
      quotations: [],
      invoices: [],
      tickets: [],
      payments: []
    }
  },
   computed: {
     ...mapState(['current_currency']),
    contacts: function() {
      return this.client.contacts
    },
    notRemoveContact() {
      return this.client.contacts.length == 1;
    },
    countries: function() {
      return this.$store.state.countries
    },
     provinces() {
      return this.$store.state.provinces
    },
    cantons() {
      return this.$store.state.cantons
    },
    districts() {
      return this.$store.state.districts
    },
    rulesIdentification() {
      if (this.client.identification_type == '01') {
        return 'required|min:9|max:12'
      } else {
        return 'required'
      }
    },
    identification_types() {
      return this.$store.state.identification_types
    },
    showProvinceCantonDistrict() {
      return this.client.country.id !== 60 ? false : true;
    }
  },
  methods: {
    newDocument(type) {
      if(type === 'invoice') {
        this.$router.push({name: 'new-invoice', query: {id: this.id}})
      } else if(type === 'ticket') {
        this.$router.push({name: 'new-ticket', query: {id: this.id}})
      }
    },
    getClientDetail() {
      let id = this.id
      clientsService.getClientDetail(id).then((res) => {
        let {
          id,
          name,
          identification_type,
          identification,
          email,
          contacts,
          phone,
          district,
          canton,
          province,
          country,
          quotations,
          invoices,
          tickets,
          balance,
          generic
        } = res.data;
        

        this.client.name = name;
        this.client.identification_type = identification_type;
        this.client.identification = identification;
        this.client.email = email;
        this.client.phone = phone;
        this.client.province = province;
        this.client.canton = canton;
        this.client.district = district;
        this.client.country = country;
        this.client.contacts = contacts.length > 0 ? contacts : [{name:"", email:""}]
        this.quotations = quotations;
        this.invoices = invoices;
        this.tickets = tickets;
        this.client.balance = balance
        this.client.generic = generic

        this.getCountries();
        this.getProvinces(true);
      }).catch((error) => {
        //this.$snotify.error(error.response.data.message);
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: error.response.data.message,
          type: 'error'
        });
      });
    },
    changeTab(tab) {
    },
    updateClient() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let _this = this;
          let data = this.client;
          data.id = this.id
          clientsService.updateClient(data)
          .then(function () {
            //_this.$snotify.success('Cliente Actualizado Correctamente');
            //JRA Cambio de notificacion por mensaje
            _this.$message({
              showClose: true,
              message: 'Cliente Actualizado Correctamente',
              type: 'success'
            });
          })
          .catch(function (error) {
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
    },
    addContact(newIndex) {
      if (this.client.contacts.length == 3) {
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
    getProvinces(preselect = false) {
      this.$store.dispatch('getProvinces', {})
      .then(res => {
        this.getCantons(preselect);
      });
      
    },
    getCantons(preselect = false) {
      this.$store.dispatch('getCantons', {province: this.client.province.number})
      .then(res => {
        if(!preselect) {
          this.client.canton = this.client.canton;
        }
        this.getDistricts(preselect);
      });
    },
    getDistricts(preselect = false) {
      this.$store.dispatch('getDistricts', {province: this.client.province.number, canton: this.client.canton.number})
      .then(res => {
        if(!preselect) {
          this.client.district = res[0];
        }
      });
    }
  },
  created() {
    this.getClientDetail();
   
  }
}
</script>

<style scoped>
  .is-active {
    background:#00aec5;
    color: white !important;
  }
</style>

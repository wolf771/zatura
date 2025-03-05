<template>
  <!-- modal new client -->
  <div v-show="show" class="vs-component con-vs-popup vs-popup-primary fullscreen">
    <div class="vs-popup--background"></div>
    <div class="vs-popup">
      <header class="vs-popup--header">
        <div class="vs-popup--title">
          <h3>
            {{ title_modal }}
          </h3>
        </div>
        <i @click="close()" class="vs-icon notranslate icon-scale vs-popup--close vs-popup--close--icon material-icons null">close</i>
      </header>
      <div class="vs-popup--content">
        <div class="col-md-12">
          <form @submit.prevent="storeClient()">
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
                      v-model="client.name"
                      data-vv-as="Nombre"
                    >
                    </text-input>

                    <div class="form-group">
                      <label>Tipo identificación</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        v-model="client.identification_type"
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
                      v-model="client.identification"
                    >
                    </text-input>

                    <text-input
                      name="email"
                      :label="'Email Principal'"
                      v-validate="'required|email'"
                      :error="errors.first('email')"
                      v-model="client.email"
                    >
                    </text-input>

                    <text-input
                      name="phone"
                      :label="'Teléfono'"
                      v-validate="'required|integer'"
                      :error="errors.first('phone')"
                      v-model="client.phone"
                    >
                    </text-input>

                    <div
                      v-if="is_provider"
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('economic_activity') }
                      ]"
                    >
                      <label>Actividad Economica</label>
                      <el-select
                        popper-class="el-select-float"
                        v-model="client.economic_activity"
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
                      <label v-show="errors.has('economic_activity')" class="error">
                        {{ errors.first("economic_activity") }}
                      </label>
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
                    <div
                      :class="[
                        'form-group',
                        { 'has-danger': errors.has('country') }
                      ]"
                    >
                      <label>País</label>
                      <el-select
                        popper-class="el-select-float"
                        v-model="client.country"
                        value-key="id"
                        name="country"
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
                    <div v-show="showProvinceCantonDistrict">
                      <!-- provincia canton distrito -->
                      <div
                        :class="[
                          'form-group',
                          { 'has-danger': errors.has('province') }
                        ]"
                      >
                        <label>Provincia</label>
                        <el-select
                          popper-class="el-select-float"
                          @change="getCantons()"
                          value-key="id"
                          v-model="client.province"
                          name="province"
                          v-validate="'required'"
                          placeholder=""
                          filterable
                          class="form-control"
                        >
                          <el-option
                            v-for="province in provinces"
                            :value="province"
                            :key="province.id"
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
                          popper-class="el-select-float"
                          no-data-text="No hay datos"
                          value-key="id"
                          no-match-text="No hay coincidencias"
                          @change="getDistricts()"
                          v-model="client.canton"
                          name="canton"
                          v-validate="'required'"
                          placeholder=""
                          filterable
                          class="form-control"
                        >
                          <el-option
                            v-for="canton in cantons"
                            :value="canton"
                            :key="canton.id"
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
                          popper-class="el-select-float"
                          v-model="client.district"
                          value-key="id"
                          name="district"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Separator horizontal -->
            <div class="row">
              <h3 class="text-primary separator-horizontal">Contactos</h3>
            </div>

            <div class="row">
              <div
                v-for="(contact, index) in contacts"
                :key="index"
                class="col-md-6"
              >
                <div class="card">
                  <div class="card-header card-header-success card-header-icon">
                    <h4 class="card-title">Contacto {{ index + 1 }}</h4>
                  </div>
                  <div class="card-body">
                    <text-input
                      :name="'name_' + index"
                      :label="'Nombre'"
                      v-validate="
                        `${contacts[index].email.length > 0 ? 'required' : ''}`
                      "
                      :error="errors.first('name_' + index)"
                      v-model="contacts[index].name"
                    >
                    </text-input>

                    <text-input
                      :name="'email_' + index"
                      :label="'Email'"
                      v-validate="
                        `${contacts[index].name.length > 0 ? 'required' : ''}`
                      "
                      :error="errors.first('email_' + index)"
                      v-model="contacts[index].email"
                    >
                    </text-input>

                    <div>
                      <button
                        type="button"
                        :class="[
                          'btn',
                          'btn-link',
                          'text-danger',
                          'float-right',
                          { oculto: notRemoveContact }
                        ]"
                        @click="removeContact(index)"
                      >
                        - Remover contacto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <br />
                <hr />
                <button
                  type="button"
                  class="btn btn-link text-success font-weight-bold"
                  @click="addContact(contacts.length)"
                >
                  + Agregar contacto
                </button>
              </div>
            </div>
            <div class="col-md-12 text-right">
              <vs-button button="submit" color="primary" type="gradient">
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
import clientsService from "@/services/clients.service";
import utilitiesService from "@/services/utilities.service";
import helpers from "@/helpers/helpers";
import { mapState } from "vuex";

export default {
  props: {
    vis: {
      type: Boolean,
      default: false
    },
    is_provider: {
      type: Boolean,
      default: false
    }
  },
  name: "new-client",
  data() {
    return {
      show: false,
      economic_activities: [],
      client: {
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
        ],
        economic_activity: {
          id: 1
        }
      }
    };
  },
  computed: {
    contacts: function() {
      return this.client.contacts;
    },
    notRemoveContact() {
      return this.client.contacts.length == 1;
    },
    title_modal() {
      return this.is_provider ? "Nuevo Proveedor" : "Nuevo Cliente";
    },

    ...mapState([
      "countries",
      "provinces",
      "cantons",
      "districts",
      "identification_types"
    ]),

    rulesIdentification() {
      return helpers.validateIdentificationLength(
        this.client.identification_type
      );
    },
    showProvinceCantonDistrict() {
      return this.client.country.id !== 60 ? false : true;
    }
  },
  methods: {
    getEconomicActivities() {
      utilitiesService
        .getEconomicActivities()
        .then(res => {
          this.economic_activities = res.data;
        })
        .catch(error => {
          alert(error);
        });
    },
    close() {
      this.$emit("closeModal", false);
      this.resetDataForm();
    },
    resetDataForm() {
      let data_form_initial = this.$options.data().client;
      Object.assign(this.$data.client, data_form_initial);
      this.$validator.reset();
    },
    storeClient() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let data = this.client;

          //Si es un provider
          data.is_provider = this.is_provider;

          clientsService
            .storeClient(data)
            .then(res => {
              //this.$snotify.success('Cliente Guardado Correctamente');
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: "Cliente Guardado Correctamente",
                type: "success"
              });
              this.$emit("client-store", res.data.client);
            })
            .catch(function(error) {
              //this.$snotify.error(error.response.data.message);
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: error.response.data.message,
                type: "error"
              });
            });
        }
      });
    },
    addContact(newIndex) {
      if (this.client.contacts.length == 4) {
        //this.$snotify.info(`No puede agregar mas de ${this.client.contacts.length} contactos`);
        //JRA Cambio de notificacion por mensaje
        this.$message({
          showClose: true,
          message: `No puede agregar mas de ${
            this.client.contacts.length
          } contactos`,
          type: "info"
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
      this.$store.dispatch("getCountries", {});
    },
    getProvinces() {
      this.$store.dispatch("getProvinces", {});
      this.getCantons();
    },
    getCantons() {
      this.$store
        .dispatch("getCantons", { province: this.client.province.number })
        .then(res => {
          this.client.canton = res[0];
          this.getDistricts();
        });
    },
    getDistricts() {
      let province = this.client.province.number;
      let canton = this.client.canton.number;
      this.$store
        .dispatch("getDistricts", { province: province, canton: canton })
        .then(res => {
          this.client.district = res[0];
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
  },
  created() {
    this.getCountries();
    this.getProvinces();
    this.getEconomicActivities();
  },
};
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}
/*.con-vs-popup .vs-popup {
  width: 1000px !important;
  max-width: 1000px !important
}*/
</style>

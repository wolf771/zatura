<template>
  <div class="content">
    <div class="col-md-12">
      <div class="card vx-card">
        
        <div class="row mt-5">
          <div class="col">
            <vs-button class="float-right mr-5" type="gradient" @click="newClient()">
              <i class="fa fa-user-plus"></i>
              Nuevo Cliente
            </vs-button>
          </div>
        </div>

        <vs-tabs>
          <vs-tab label="Clientes activos">
            <div class="tab-text">
              <div class="card-body" v-loading="loading">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <!-- <h4 class="font-weight-bold text-primary">Lista de clientes</h4> -->
                    <registers-per-page
                      @changeNumPerPage="changeNumPerPage"
                    ></registers-per-page>
                    <search-filter
                      @executeSearch="search"
                      :options="[]"
                    ></search-filter>
                  </div>
                </div>

                <div
                  id="data-list-list-view"
                  class="data-list-container mt-5"
                  v-if="items.length"
                >
                  <vs-table ref="table" :max-items="perPage" :data="items">
                    <template slot="thead">
                      <vs-th sort-key="name">#</vs-th>
                      <vs-th sort-key="name">Nombre</vs-th>
                      <vs-th sort-key="category">Email</vs-th>
                      <vs-th sort-key="popularity">Identificación</vs-th>
                      <vs-th sort-key="order_status">Balance</vs-th>
                      <vs-th sort-key="price">Status</vs-th>
                      <vs-th>Acciones</vs-th>
                    </template>

                    <template slot-scope="{ data }">
                      <tbody>
                        <vs-tr
                          :data="item"
                          :key="indextr"
                          v-for="(item, indextr) in data"
                        >
                          <vs-td>
                            {{ indextr + 1 }}
                          </vs-td>

                          <vs-td>
                            <router-link
                              :to="{ name: 'client-detail', params: { id: item.id } }"
                              class="btn btn-link"
                            >
                              {{ item.name | truncateText(0, 25) }}
                            </router-link>
                          </vs-td>

                          <vs-td>
                            {{ item.email | truncateText(0, 25) }}
                          </vs-td>

                          <vs-td>
                            {{ item.identification }}
                          </vs-td>

                          <vs-td>
                            <calc-price
                              :price="item.balance"
                              :currency="current_currency.id"
                              :exchange_rate="1"
                            >
                            </calc-price>
                          </vs-td>

                          <vs-td>
                            <vs-chip
                              :color="getStatusColor(item.active)"
                              class="product-order-status"
                              >{{ item.active ? "Activo" : "Inactivo" }}</vs-chip
                            >
                          </vs-td>

                          <vs-td class="whitespace-no-wrap">
                            <el-dropdown @command="listAction">
                              <!-- <el-button type="primary" size="small"> -->

                              <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                              <!-- </el-button> -->
                              <i class="fa fa-cogs text-primary"></i>
                              <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item :class="[{'text-success': !item.active, 'text-warning': item.active}]" :command="{command: 'status', payload:{id: item.id, active: item.active}}">
                                 <i :class="{'fas fa-user-check': !item.active, 'fas fa-user-slash': item.active}"></i>
                                 {{ !item.active ? 'Activar' : 'Desactivar' }}
                                </el-dropdown-item> -->

                                <el-dropdown-item
                                  v-if="item.balance > 0"
                                  class="text-primary"
                                  :command="{
                                    command: 'state-account',
                                    payload: item
                                  }"
                                >
                                  <i class="fa fa-file"></i>
                                  Enviar estado de cuenta
                                </el-dropdown-item>

                                <el-dropdown-item
                                  v-if="item.active"
                                  class="text-secondary"
                                  :command="{
                                    command: 'change-active',
                                    payload: item.id
                                  }"
                                >
                                  <i class="fa fa-power-off"></i>
                                  Desactivar
                                </el-dropdown-item>

                                <el-dropdown-item
                                  v-if="!item.has_documents"
                                  class="text-danger"
                                  :command="{
                                    command: 'delete',
                                    payload: { id: item.id }
                                  }"
                                >
                                  <i class="fa fa-times"></i>
                                  Eliminar
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </vs-td>
                        </vs-tr>
                      </tbody>
                    </template>
                  </vs-table>

                  <div
                    class="mt-4 text-center zatura-pagination"
                    v-if="pageCount > 1"
                  >
                    <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
                  </div>
                </div>

                <div class="col-md-12 text-center" v-if="items.length == 0">
                  <p>No hay Clientes</p>
                </div>
              </div>
            </div>
          </vs-tab>
          <vs-tab label="Clientes inactivos">
            <div class="tab-text">
              <ClientsInactive @activeClient="changeActiveClient" :current_currency="current_currency"></ClientsInactive>
            </div>
          </vs-tab>
        </vs-tabs>

      </div>
    </div>

    <!-- modal new client -->
    <div
      v-show="newClientModal"
      class="vs-component con-vs-popup vs-popup-primary fullscreen"
    >
      <div class="vs-popup--background"></div>
      <div class="vs-popup">
        <header class="vs-popup--header">
          <div class="vs-popup--title">
            <h3>
              Nuevo cliente
            </h3>
          </div>
          <i
            @click="close()"
            class="vs-icon notranslate icon-scale vs-popup--close vs-popup--close--icon material-icons null"
            >close</i
          >
        </header>
        <div class="vs-popup--content">
          <div
            class="col-md-12"
            v-loading="loading"
            element-loading-text="Guardando..."
          >
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
                        data-vv-as="Nombre"
                      >
                      </text-input>

                      <div class="form-group">
                        <label>Tipo identificación</label>
                        <el-select
                          placeholder=""
                          v-model="client.identification_type"
                          name="identification_type"
                          v-validate="'required'"
                          filterable
                          class="form-control"
                          popper-class="el-select-float"
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
                      <div
                        :class="[
                          'form-group',
                          { 'has-danger': errors.has('country') }
                        ]"
                      >
                        <label>País</label>
                        <el-select
                          v-model="client.country"
                          value-key="id"
                          name="country"
                          v-validate="'required'"
                          placeholder=""
                          filterable
                          class="form-control"
                          popper-class="el-select-float"
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
                        <div
                          :class="[
                            'form-group',
                            { 'has-danger': errors.has('province') }
                          ]"
                        >
                          <label>Provincia</label>
                          <el-select
                            @change="getCantons()"
                            value-key="id"
                            v-model="client.province"
                            name="province"
                            v-validate="'required'"
                            placeholder=""
                            filterable
                            class="form-control"
                            popper-class="el-select-float"
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
                            popper-class="el-select-float"
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
                            v-model="client.district"
                            value-key="id"
                            name="district"
                            v-validate="'required'"
                            placeholder=""
                            filterable
                            class="form-control"
                            popper-class="el-select-float"
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

              <div class="row">
                <h3 class="separator-horizontal">
                  Contactos
                </h3>
              </div>

              <div class="row">
                <div
                  v-for="(contact, index) in contacts"
                  :key="index"
                  class="col-md-6"
                >
                  <div class="vx-card">
                    <div class="card-header bg-white">
                      <h4 class="card-title">Contacto {{ index + 1 }}</h4>
                    </div>
                    <div class="card-body">
                      <text-input
                        :name="'name_' + index"
                        :label="'Nombre'"
                        v-validate="
                          `${
                            contacts[index].email.length > 0 ? 'required' : ''
                          }`
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
    <!-- end modal new client -->

    <!-- Modal send state account -->

    <!-- modal edit item -->
    <vs-popup :active.sync="stateAccountModal" title="Estado de cuenta">
      <div
        v-loading="loading_send_state_account"
        element-loading-text="Enviando estado de cuenta al cliente..."
      >
        <div class="col-md-12">
          <h2>
            Cliente:
            <span class="text-primary">{{ state_account.client.name }}</span>
          </h2>
          <h3>
            Pendiente de pago:
            <span class="text-warning font-weight-bold">
              <calc-price
                :price="state_account.pending_total"
                :currency="current_currency.id"
                :exchange_rate="1"
              >
              </calc-price>
            </span>
          </h3>
        </div>

        <hr />

        <div class="d-flex justify-content-between p-3">
          <h3>
            Facturas pendientes
          </h3>

          <vs-button
            color="success"
            type="gradient"
            @click="sendPendingPaymentInvoicesClient()"
          >
            <i class="fas fa-paper-plane mr-2"></i>
            Enviar al cliente
          </vs-button>
        </div>
        <div
          class="col-md-12"
          v-loading="loading_pending_payment_invoices"
          element-loading-text="Cargando..."
        >
          <vs-table ref="table" :data="state_account.pending_payment_invoices">
            <template slot="thead">
              <vs-th>Factura</vs-th>
              <vs-th>Fecha</vs-th>
              <vs-th>Monto pendiente</vs-th>
            </template>

            <template slot-scope="{ data }">
              <tbody>
                <vs-tr
                  :data="item"
                  :key="indextr"
                  v-for="(item, indextr) in data"
                >
                  <vs-td>
                    {{ item.reference }}
                  </vs-td>

                  <vs-td>
                    {{ item.created_at | moment("DD-MM-Y") }}
                  </vs-td>

                  <vs-td>
                    <calc-price
                      :price="item.due"
                      :currency="item.currency.id"
                      :exchange_rate="1"
                    >
                    </calc-price>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
        </div>
      </div>
    </vs-popup>

    <!-- End Modal state account -->
  </div>
</template>

<script>
import clientsService from "@/services/clients.service";
import loading from "@/components/Loading.vue";
import CalcPrice from "@/components/CalcPrice.vue";
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
//JRA modal nuevo cliente
import helpers from "@/helpers/helpers";
import Modal from "@/components/Modal.vue";
import ClientsInactive from "@/views/clients/ClientsInactive"

export default {
  name: "clients",
  data() {
    return {
      stateAccountModal: false,
      state_account: {
        client: {},
        pending_total: 0,
        pending_payment_invoices: []
      },
      loading_pending_payment_invoices: false,
      loading_send_state_account: false,
      items: [],
      clients_inactive: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1,

      //JRA modal nuevo cliente
      newClientModal: false,
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
      }
    };
  },
  computed: {
    //JRA modal nuevo cliente
    ...mapState([
      "current_currency",
      "countries",
      "provinces",
      "cantons",
      "districts",
      "identification_types",
      "datatable_current_page"
    ]),
    contacts: function() {
      return this.client.contacts;
    },
    notRemoveContact() {
      return this.client.contacts.length == 1;
    },
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
    async changeActiveClient(data) {
      this.loading = true
      const { data:res } = await clientsService.changeActiveClient({
        client_id: data.client_id,
        status: data.status
      })
      if (res.success) {

        if (!data.status) {
          const index = this.items.findIndex(i => i.id == data.client_id)
          this.items.splice(index, 1)
        } else {
          this.items.push(res.data)
        }

        this.$message({
          showClose: true,
          message: res.message,
          type: "success"
        });
      }
      this.loading = false
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getClients(1, false, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getClients(1, false, this.searchData);
    },
    async getClients(page = 1, generic, search) {
      this.loading = true;
      const { data:res } = await clientsService.getOnlyClients(page, generic, search, 'active');
      this.items = res.data
      this.loading = false;
      this.pageCount = res.last_page;
      this.page = res.current_page;
    },
    //JRA modal nuevo cliente
    resetForm() {
      let data_form_initial = this.$options.data().client;
      Object.assign(this.$data.client, data_form_initial);
      this.$validator.reset();
    },
    newClient() {
      this.resetForm();
      this.newClientModal = true;
    },
    /*newClient() {
      this.$router.push('new-client')
    },*/
    storeClient() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let _this = this;
          let data = this.client;
          this.loading = true;
          clientsService
            .storeClient(data)
            .then(function() {
              _this.loading = false;
              //_this.$snotify.success('Cliente Guardado Correctamente');
              //JRA Cambio de notificacion por mensaje
              _this.$message({
                showClose: true,
                message: "Cliente Guardado Correctamente",
                type: "success"
              });
              _this.getClients(1, false, _this.searchData);
              _this.newClientModal = false;
            })
            .catch(function(error) {
              _this.loading = false;
              //_this.$snotify.error(error.response.data.message);
              //JRA Cambio de notificacion por mensaje
              _this.$message({
                showClose: true,
                message: error.response.data.message,
                type: "error"
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
    },
    goPage(numPage) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: numPage,
        section: "clients"
      });
      this.getClients(numPage, false, this.searchData);
    },
    async listAction(command) {
      switch (command.command) {
        case "state-account":
          this.state_account = {
            client: {},
            pending_total: 0,
            pending_payment_invoices: []
          };
          const client = command.payload;
          this.loading_pending_payment_invoices = true;
          this.stateAccountModal = true;
          this.state_account.client = client;
          try {
            const {
              data: res
            } = await clientsService.getPendingPaymentInvoices(client.id);
            this.state_account.pending_total = res.data.pending_total;
            this.state_account.pending_payment_invoices =
              res.data.pending_invoices;
          } catch (error) {}
          this.loading_pending_payment_invoices = false;
        break;

        case "change-active":
          this.$confirm("Si desactivas el cliente, este no estara disponible para emitir nuevos documentos", "Desactivar Cliente", {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          })
            .then(() => {
            this.changeActiveClient({
              client_id: command.payload,
              status: 0
            })
          })
        break;

        case "status":
          /*this.$notify({
          type: 'info',
          title: 'Se esta mejorando esta accion'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "Se esta mejorando esta accion",
            type: "info"
          });
          //   let active = command.payload.active;
          //      this.$confirm(`¿ Deseas ${active ? 'Desactivar' : 'Activar'} el cliente ?`, `${active ? 'Desactivar' : 'Activar'} Cliente`, {
          //       confirmButtonText: 'Si, continuar',
          //       cancelButtonText: 'Cancelar',
          //       type: 'warning',
          //       center: true
          //     }).then(() => {
          //       this.loading = true;
          //       let index = this.items.findIndex(i => i.id === command.payload.id);

          //       clientsService.activeDeactiveClient(command.payload.id)
          //       .then(() => {
          //         this.items[index].active = !active;
          //         this.loading = false;
          //         this.$message({
          //           type: 'success',
          //           message: `Cliente ${ active ? 'Desactivado': 'Activado'}`
          //         });
          //       })
          //       .catch(() => {
          //         this.loading = false;
          //         this.$message({
          //           type: 'error',
          //           message: 'Ocurrio un problema'
          //         });
          //       });
          //     }).catch(() => {
          //       this.loading = false;
          //       this.$message({
          //         type: 'info',
          //         message: 'Acción cancelada'
          //       });
          //     });
          break;
        case "delete":
          this.$confirm("¿ Deseas eliminar el cliente ?", "Eliminar Cliente", {
            confirmButtonText: "Si, continuar",
            cancelButtonText: "Cancelar",
            type: "warning",
            center: true
          })
            .then(() => {
              this.loading = true;
              let index = this.items.findIndex(
                i => i.id === command.payload.id
              );
              clientsService
                .deleteClient(command.payload.id)
                .then(() => {
                  this.loading = false;
                  this.items.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "Cliente eliminado"
                  });
                })
                .catch(() => {
                  this.loading = false;
                  this.$message({
                    type: "error",
                    message: "Ocurrio un problema"
                  });
                });
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                type: "info",
                message: "Acción cancelada"
              });
            });
          break;
      }
    },
    getStatusColor(status) {
      if (status) return "success";
      if (!status) return "warning";
      return "primary";
    },
    close() {
      this.newClientModal = false;
      this.client = JSON.parse(JSON.stringify(this.$options.data().client));
    },
    async sendPendingPaymentInvoicesClient(client_id) {
      try {
        this.loading_send_state_account = true;
        const {
          data: res
        } = await clientsService.sendPendingPaymentInvoicesClient(
          this.state_account.client.id
        );
        this.$message({
          type: "success",
          message: "Estado de cuenta enviado al cliente correctamente."
        });
      } catch (error) {
        this.$message({
          type: "success",
          message: error.message
        });
      }
      this.loading_send_state_account = false;
      this.stateAccountModal = false;
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getCountries();
    this.getProvinces();
    this.getClients(this.datatable_current_page.clients);
  },
  components: {
    loading,
    CalcPrice,
    SearchFilter,
    RegistersPerPage,
    Modal,
    ClientsInactive
  }
};
</script>

<style scoped>
.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}

.width-popup {
  width: 1000px !important;
}
</style>

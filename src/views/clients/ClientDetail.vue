<template>
  <div class="row bg-white">
    <div class="col-md-12">
      <div class="d-flex justify-content-between" style="padding:0.5em">
        <div class="">
          <h3 class="text-info text-capitalize">{{ client.name }}</h3>
        </div>
        <div v-if="!client.provider">
          <vs-button type="gradient" @click="newDocument('invoice')" v-if="!client.generic">
            <i class="fa fa-plus"></i>
            Nueva Factura
          </vs-button>
          <vs-button type="gradient" class="ml-2" @click="newDocument('ticket')">
            <i class="fa fa-plus"></i>
            Nuevo Tiquete
          </vs-button>
        </div>
      </div>

      <div class="d-flex justify-content-end" v-if="!client.provider">
        <span style="position:absolute;right:10px;bottom:-40px;">
          <h4 class="font-weight-bold" style="color: rgb(255, 130, 0)">
            Balance:
            <calc-price
              :price="client.balance"
              :currency="current_currency.id"
              :exchange_rate="1"
            >
            </calc-price>
          </h4>
        </span>
      </div>
    </div>
    <br />
    <div class="col-md-12">
      <vs-tabs>
        <vs-tab label="Información" icon-pack="feather" icon="icon-home">
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
                        v-model="client.name"
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
                        >
                          <el-option
                            v-for="quotation in identification_types"
                            :key="quotation.value"
                            :label="quotation.text"
                            :value="quotation.value"
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
                        v-validate="'required'"
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
                        v-if="client.provider"
                        :class="[
                          'form-group',
                          { 'has-danger': errors.has('economic_activity') }
                        ]"
                      >
                        <label>Actividad Economica</label>
                        <el-select
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

                <div class="col-md-6">
                  <div class="card">
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
                            :key="country.code"
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
                            @change="getProvinces()"
                            v-model="client.province"
                            value-key="number"
                            name="province"
                            v-validate="'required'"
                            placeholder=""
                            filterable
                            class="form-control"
                          >
                            <el-option
                              :data-valor="province.number"
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
                            @change="getCantons()"
                            value-key="number"
                            v-model="client.canton"
                            name="canton"
                            v-validate="'required'"
                            placeholder=""
                            filterable
                            class="form-control"
                          >
                            <el-option
                              :data-province="canton.province_number"
                              :data-canton="canton.number"
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
                            v-model="client.district"
                            value-key="number"
                            name="district"
                            v-validate="'required'"
                            placeholder=""
                            filterable
                            class="form-control"
                          >
                            <el-option
                              v-for="district in districts"
                              :value="district"
                              :key="district.number"
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

              <hr />
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
                  <div class="card">
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
                    class="btn btn-link text-success"
                    @click="addContact(contacts.length)"
                  >
                    + Agregar contacto
                  </button>
                </div>
              </div>
              <div class="col-md-12 text-right p-5">
                <vs-button type="gradient" button="submit">
                  <i class="fa fa-save"></i>
                  Guardar
                </vs-button>
              </div>
            </form>
          </div>
        </vs-tab>
        <vs-tab
          v-if="!client.provider"
          label="Cotizaciones"
          icon-pack="feather"
          icon="icon-file-text"
        >
          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="quotations.length"
          >
            <vs-table
              ref="table"
              :max-items="quotations.length"
              :data="quotations"
            >
              <template slot="thead">
                <vs-th sort-key="">Número</vs-th>
                <vs-th sort-key="">Subtotal</vs-th>
                <vs-th sort-key="">Descuento</vs-th>
                <vs-th sort-key="">IVA</vs-th>
                <vs-th sort-key="">Total</vs-th>
                <vs-th sort-key="created_at">Fecha</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="quotation"
                    :key="quotation.id"
                    v-for="(quotation, index) in data"
                  >
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'quotation', id: quotation.id }
                        }"
                      >
                        {{ quotation.reference }}
                      </router-link>
                    </vs-td>

                    <vs-td>
                      <calc-price
                        :price="quotation.subtotal"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="quotation.discount"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="quotation.tax"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="quotation.total"
                        :currency="quotation.currency_id"
                        :exchange_rate="quotation.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>{{
                      quotation.created_at | moment("DD/MM/YYYY")
                    }}</vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>
          <h3 v-if="!quotations.length" class="text-center">
            Sin cotizaciones
          </h3>
        </vs-tab>
        <vs-tab
          v-if="!client.provider"
          label="Facturas"
          icon-pack="feather"
          icon="icon-tag"
        >
          <div>
            <registers-per-page
              @changeNumPerPage="changeNumPerPage"
            ></registers-per-page>
            <!-- <h4 class="font-weight-bold">Lista de facturas</h4> -->
            <search-filter
              :perPage="perPage"
              :options="optionsFilter"
              @executeSearch="search"
            ></search-filter>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            style="height: 100vh"
            v-if="invoices.length"
            v-loading="loading"
          >
            <vs-table ref="table" :max-items="perPage" :data="invoices">
              <template slot="thead">
                <vs-th>Número</vs-th>
                <vs-th>Total</vs-th>
                <vs-th>Monto pagado</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th sort-key="created_at">Fecha</vs-th>
                <vs-th>Hacienda</vs-th>
                <vs-th>Acciones</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="invoice"
                    :key="invoice.id"
                    v-for="(invoice, index) in data"
                  >
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'invoice', id: invoice.id }
                        }"
                      >
                        {{ invoice.reference }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="invoice.total"
                        :currency="invoice.currency_id"
                        :exchange_rate="invoice.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="invoice.payment_amount"
                        :currency="invoice.currency_id"
                        :exchange_rate="invoice.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>
                      <div>
                        <status-payment
                          :total="invoice.total"
                          :payment_amount="invoice.payment_amount"
                          :hacienda="invoice.hacienda"
                          :note_totals="invoice.note_totals"
                        >
                        </status-payment>
                      </div>
                      <br />
                      <div
                        style="padding-top:8px"
                        v-if="
                          invoice.payment_amount < invoice.total &&
                            invoice.note_totals.ncs.nc_total < invoice.total
                        "
                      >
                        <small
                          class="text-danger"
                          v-if="invoice.expiration_date.substr(0, 10) < today"
                        >
                          Vencida hace {{ invoice.days_expiration }}
                          {{ invoice.days_expiration > 1 ? "dias" : "dia" }}
                        </small>
                        <small
                          class="text-warning"
                          v-if="invoice.expiration_date.substr(0, 10) == today"
                        >
                          Vence hoy
                        </small>
                      </div>
                    </vs-td>
                    <vs-td>{{
                      invoice.created_at | moment("DD/MM/YYYY")
                    }}</vs-td>
                    <vs-td>
                      <status-hacienda
                        :status="invoice.hacienda"
                      ></status-hacienda>
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="listAction">
                        <i class="fa fa-cogs text-primary"></i>

                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-if="invoice.total > invoice.payment_amount"
                            :command="{
                              command: 'pay',
                              payload: { item: invoice }
                            }"
                            class="text-info"
                          >
                            <i class="fa fa-money-bill-alt"></i>
                            Pagar
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="
                              invoiceExpiration(invoice.expiration_date) &&
                                invoice.payment_amount < invoice.total
                            "
                            :command="{
                              command: 'rp',
                              payload: { item: invoice }
                            }"
                            class="text-warning"
                          >
                            <i class="fa fa-envelope-open-text"></i>
                            Recordatorio de pago
                            {{
                              invoice.number_sent_remember_payment > 0
                                ? "(" +
                                  invoice.number_sent_remember_payment +
                                  ")"
                                : ""
                            }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              command: 'nc',
                              payload: { id: invoice.id }
                            }"
                            class="text-danger"
                          >
                            <i class="fa fa-minus-circle"></i>
                            Nota de crédito
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              command: 'nd',
                              payload: { id: invoice.id }
                            }"
                            class="text-success"
                          >
                            <i class="fa fa-plus-circle"></i>
                            Nota de débito
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              command: 'clone',
                              payload: { id: invoice.id }
                            }"
                            class="text-primary"
                          >
                            <i class="fa fa-clone"></i>
                            Clonar
                          </el-dropdown-item>

                          <el-dropdown-item
                            :command="{
                              command: 'recurring',
                              payload: { id: invoice.id }
                            }"
                            class="text-primary"
                          >
                            <i class="fa fa-clone"></i>
                            Hacer recurrente
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
          <h3 v-if="!invoices.length" class="text-center">
            Sin Facturas
          </h3>
        </vs-tab>
        <vs-tab
          v-if="!client.provider"
          label="Tiquetes"
          icon-pack="feather"
          icon="icon-file-text"
        >
          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="tickets.length"
            v-loading="loading"
          >
            <vs-table ref="table" :max-items="tickets.length" :data="tickets">
              <template slot="thead">
                <vs-th>Número</vs-th>
                <vs-th>Total</vs-th>
                <vs-th sort-key="created_at">Fecha</vs-th>
                <vs-th>Hacienda</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="ticket"
                    :key="index"
                    v-for="(ticket, index) in data"
                  >
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'ticket', id: ticket.id }
                        }"
                      >
                        {{ ticket.reference }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="ticket.total"
                        :currency="ticket.currency_id"
                        :exchange_rate="ticket.exchange_rate"
                      >
                      </calc-price>
                    </vs-td>
                    <vs-td>{{
                      ticket.created_at | moment("DD/MM/YYYY")
                    }}</vs-td>
                    <vs-td>
                      <status-hacienda
                        :status="ticket.hacienda"
                      ></status-hacienda>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>
          <h3 v-if="!tickets.length" class="text-center">
            Sin Tiquetes
          </h3>
        </vs-tab>
      </vs-tabs>
    </div>

    <payment-modal
      @paymentExecuted="updateItem"
      @closeModal="closeModal()"
      :data="data_modal_payment"
      :vis="payment_modal_visible"
    ></payment-modal>
    <payment-remember-modal
      @closeModal="closeModal()"
      :dataEmail="data_modal_remember_payment"
      :visible="show_modal_payment_remember"
    ></payment-remember-modal>
  </div>
</template>

<script>
import clientsService from "@/services/clients.service";
import utilitiesService from "@/services/utilities.service";
import CalcPrice from "@/components/CalcPrice";
import StatusPayment from "@/components/StatusPayment.vue";
import StatusHacienda from "@/components/StatusHacienda.vue";
import PaymentModal from "@/components/PaymentModal.vue";
import PaymentRememberModal from "@/components/PaymentRememberModal.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import SearchFilter from "@/components/SearchFilter.vue";

import { mapState } from "vuex";
import momentjs from "moment";

export default {
  name: "client-detail",
  components: {
    CalcPrice,
    StatusPayment,
    StatusHacienda,
    PaymentModal,
    PaymentRememberModal,
    RegistersPerPage,
    SearchFilter
  },
  data() {
    return {
      economic_activities: [],
      id: this.$route.params.id,
      client: {
        economic_activity_id: "",
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
        ],
        provider: 0,
        economic_activity: {
          id: 1
        }
      },
      quotations: [],
      invoices: [],
      tickets: [],
      payments: [],

      today: "",
      payment_modal_visible: false,
      show_modal_payment_remember: false,
      data_modal_payment: {},
      data_modal_remember_payment: {},
      searchData: {},
      pageCount: 0,
      perPage: 10,
      page: 1,
      optionsFilter: [
        { label: "Aceptado", value: "aceptado" },
        { label: "Rechazado", value: "rechazado" },
        { label: "Pagado", value: "pagado" },
        { label: "No Pagado", value: "no-pagado" }
      ],
      loading: false
    };
  },
  computed: {
    ...mapState(["current_currency"]),
    contacts: function() {
      return this.client.contacts;
    },
    notRemoveContact() {
      return this.client.contacts.length == 1;
    },
    countries: function() {
      return this.$store.state.countries;
    },
    provinces() {
      return this.$store.state.provinces;
    },
    cantons() {
      return this.$store.state.cantons;
    },
    districts() {
      return this.$store.state.districts;
    },
    rulesIdentification() {
      if (this.client.identification_type == "01") {
        return "required|min:9|max:12";
      } else {
        return "required";
      }
    },
    identification_types() {
      return this.$store.state.identification_types;
    },
    showProvinceCantonDistrict() {
      return this.client.country.id !== 60 ? false : true;
    }
  },
  methods: {
    invoiceExpiration(expiration_date) {
      let expiration_date_format = this.$options.filters.moment(
        expiration_date,
        "YYYY-MM-DD"
      );
      if (expiration_date_format <= momentjs().format("YYYY-MM-DD")) {
        return true;
      } else {
        return false;
      }
    },
    updateItem(item) {
      this.payment_modal_visible = false;
      let i = this.invoices.find(i => i.id === item.paymentable_id);
      let index = this.invoices.indexOf(i);
      this.invoices[index].payment_amount =
        this.invoices[index].payment_amount + parseFloat(item.amount);
      this.invoices[index].due = item.due;
      this.payment_modal_visible = false;
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getInvoices(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getInvoices(1, this.searchData);
    },
    goPage(page) {
      this.getInvoices(page, this.searchData);
    },
    listAction(command) {
      switch (command.command) {
        case "pay":
          this.payment_modal_visible = true;
          this.data_modal_payment = command.payload;
          break;
        case "nc":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nc",
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "nd":
          this.$router.push({
            name: "new-note",
            params: {
              note_type: "nd",
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "clone":
          this.$router.push({
            name: "new-clone",
            params: {
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        case "recurring":
          this.$router.push({
            name: "new-recurring",
            params: {
              document_type: "invoice",
              document_id: command.payload.id
            }
          });
          break;
        //recordatorio de pago
        case "rp":
          this.show_modal_payment_remember = true;
          this.data_modal_remember_payment = command.payload;
          break;
      }
    },
    closeModal(data) {
      this.payment_modal_visible = false;
      this.show_modal_payment_remember = false;
    },
    getEconomicActivities() {
      utilitiesService
        .getEconomicActivities()
        .then(res => {
          this.economic_activities = res.data;

          this.client.economic_activity = res.data.find(
            i => i.id == this.client.economic_activity_id
          );
        })
        .catch(error => {
          alert(error);
        });
    },
    newDocument(type) {
      if (type === "invoice") {
        this.$router.push({ name: "new-invoice", query: { id: this.id } });
      } else if (type === "ticket") {
        this.$router.push({ name: "new-ticket", query: { id: this.id } });
      }
    },
    getClientDetail() {
      let id = this.id;
      clientsService
        .getClientDetail(id)
        .then(res => {
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
            //invoices,
            tickets,
            balance,
            generic,
            provider,
            economic_activity_id
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
          this.client.contacts =
            contacts.length > 0 ? contacts : [{ name: "", email: "" }];
          this.quotations = quotations;
          //this.invoices = invoices;
          this.tickets = tickets;
          this.client.balance = balance;
          this.client.generic = generic;
          this.client.provider = provider;
          this.client.economic_activity_id = economic_activity_id;

          this.getCountries();
          this.getProvinces(true);
          this.getEconomicActivities();
          this.getInvoices();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    getInvoices(page = 1, search = {}) {
      this.loading = true;
      clientsService
        .getInvoicesByClient(this.id, page, search)
        .then(res => {
          this.invoices = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: "Ha ocurrido un error al cargar las facturas del cliente",
            type: "error"
          });
        });
    },
    updateClient() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let _this = this;
          let data = this.client;
          data.id = this.id;
          clientsService
            .updateClient(data)
            .then(function() {
              //_this.$snotify.success('Cliente Actualizado Correctamente');
              //JRA Cambio de notificacion por mensaje
              _this.$message({
                showClose: true,
                message: "Cliente Actualizado Correctamente",
                type: "success",
                duration: 1500
              });
            })
            .catch(function(error) {
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
    },
    addContact(newIndex) {
      if (this.client.contacts.length == 3) {
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
    getProvinces(preselect = false) {
      this.$store.dispatch("getProvinces", {}).then(res => {
        this.getCantons(preselect);
      });
    },
    getCantons(preselect = false) {
      this.$store
        .dispatch("getCantons", { province: this.client.province.number })
        .then(res => {
          if (!preselect) {
            this.client.canton = this.client.canton;
          }
          this.getDistricts(preselect);
        });
    },
    getDistricts(preselect = false) {
      this.$store
        .dispatch("getDistricts", {
          province: this.client.province.number,
          canton: this.client.canton.number
        })
        .then(res => {
          if (!preselect) {
            this.client.district = res[0];
          }
        });
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getClientDetail();
    this.today = momentjs().format("YYYY-MM-DD");
  }
};
</script>

<style scoped>
.is-active {
  background: #00aec5;
  color: white !important;
}
</style>

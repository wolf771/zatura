<template>
  <div>
    <pos-format
      :document_type="document_type"
      :company="company_default"
      :transaction="transaction"
      :url_qr="url_qr"
      ref="posFormatComponent"
    ></pos-format>

    <div class="container-detail-transaction vx-card">
      <div ref="list_transactions" class="list-transactions">
        <div class="title-list flex justify-between">
          Lista de {{ document_type.plural }}
          <button class="hide-desktop" @click="toggleListTransactions()">
            <el-button>
              <i class="fa fa-times"></i>
            </el-button>
          </button>
        </div>
        <div style="height: 80vh;position:relative">
          <div class="text-center mb-3 mr-2 ml-2">
            <search-filter
              style="width:100%"
              @executeSearch="search"
            ></search-filter>
          </div>
          <VuePerfectScrollbar
            element-loading-text="cargando..."
            v-loading="loading_list"
            style="position:relative"
          >
            <ul style="overflow-y: scroll; height:70vh">
              <li
                :class="['list-item p-5', { active: id == il.id }]"
                v-for="il in list"
                :key="il.id"
                @click.prevent="viewItem(il.id)"
                style="box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);margin-bottom:5px;"
              >
                <span class="total">
                  <calc-price
                    :price="il.total"
                    :currency="il.currency_id"
                    :exchange_rate="il.exchange_rate"
                  >
                  </calc-price
                ></span>
                <p class="client">{{ il.client.name }}</p>
                <div>
                  <span>
                    <span class="invoice-number"># {{ il.reference }} | </span>
                    <span style="color:black;font-size: 14px">{{
                      il.created_at | moment("DD-MM-Y")
                    }}</span>
                  </span>

                  <status-hacienda
                    v-if="type !== 'quotation' && type !== 'recurring'"
                    class="float-right"
                    :status="il.hacienda"
                  ></status-hacienda>
                </div>
              </li>
            </ul>
          </VuePerfectScrollbar>
          <div
            style="position:absolute;bottom: -25px;left:0;"
            class="p-5 text-center d-flex w-100 justify-content-center align-items-center"
            v-if="pageCount > 1"
          >
            <registers-per-page
              @changeNumPerPage="changeNumPerPage"
            ></registers-per-page>

            <i
              class="fa fa-arrow-left arrow-pagination"
              @click="prevPage()"
            ></i>
            <el-select v-model="page" style="width:80px">
              <el-option
                v-for="numberPage in pageCount"
                :key="numberPage"
                :label="numberPage"
                :value="numberPage"
              >
              </el-option>
            </el-select>
            <i
              class="fa fa-arrow-right arrow-pagination"
              @click="nextPage()"
            ></i>
          </div>
        </div>
      </div>
      <!-- end list transactions -->

      <div class="transaction-area">
        <div class="menu">
          <div class="number_remember_payment">
            <div
              v-if="
                transaction.number_sent_remember_payment > 0 &&
                  type === 'invoice'
              "
            >
              {{ transaction.number_sent_remember_payment }} recordatorios de
              pago enviados <br />
              Ult fecha de envio:
              {{ transaction.last_date_sent_remember_payment }}
            </div>
            <div v-else style="width: 25%"></div>
          </div>
          <div class="items-menu">
            <!-- Share link invoice -->
            <el-tooltip content="Compartir enlace" placement="top">
              <el-button @click="shareInvoiceModal = true">
                <i class="fa fa-share-square"></i>
              </el-button>
            </el-tooltip>
            <!-- End Share link invoice -->

            <el-tooltip content="Descargar XMLs" placement="top">
              <el-dropdown
                @command="downloadXml"
                v-if="type !== 'quotation' && type !== 'recurring'"
              >
                <el-button>
                  XML
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      command: 'send',
                      key50digits: transaction.key50digits,
                      document_type: type_xml
                    }"
                  >
                    <i class="fa fa-file-code"></i>
                    Xml enviado
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      transaction.hacienda === 'aceptado' ||
                        transaction.hacienda === 'rechazado'
                    "
                    :command="{
                      command: 'response',
                      key50digits: transaction.key50digits,
                      document_type: type_xml
                    }"
                  >
                    <i class="fa fa-file-code"></i>
                    Xml respuesta
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>

            <el-tooltip
              content="Pagar"
              placement="top"
              v-if="transaction.total > transaction.payment_amount"
            >
              <el-button
                @click="paymentInvoice()"
                v-if="
                  type !== 'quotation' &&
                    type !== 'simple' &&
                    type !== 'recurring'
                "
              >
                <i class="fas fa-money-bill-alt"></i>
              </el-button>
            </el-tooltip>

            <!-- Print -->
            <el-tooltip content="Imprimir" placement="top">
              <el-dropdown
                @command="print"
                v-if="type !== 'quotation' && type !== 'recurring'"
              >
                <el-button icon="el-icon-printer"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ command: 'print-normal' }">
                    Imprimir normal
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ command: 'print-pos' }">
                    Imprimir a POS
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>

            <!-- Editar si es factura recurrente -->
            <el-tooltip
              content="Editar"
              placement="top"
              v-if="type === 'recurring'"
            >
              <el-button
                @click="editRecurring()"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>

            <!-- enviar por correo-->
            <el-tooltip content="Enviar" placement="top">
              <el-dropdown @command="sendEmail">
                <el-button icon="el-icon-message"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ command: 'send-email' }">
                    Enviar por correo
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      invoiceExpiration(transaction.expiration_date) &&
                        type === 'invoice'
                    "
                    :command="{
                      command: 'send-remember-payment',
                      payload: transaction
                    }"
                  >
                    Enviar recordatorio de pago
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>

            <el-button-group>
              <!-- Edit-->
              <el-tooltip content="Editar" placement="top">
                <el-button
                  @click="editQuotation()"
                  v-if="type === 'quotation'"
                  icon="el-icon-edit"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="clonar"
                v-if="type !== 'note' && type !== 'recurring'"
                placement="top"
              >
                <el-button @click="clone()">
                  <i class="fa fa-copy"></i>
                </el-button>
              </el-tooltip>

              <!-- Pdf -->
              <el-tooltip content="PDF" placement="top">
                <el-button @click.prevent="downloadPdf()">
                  <i class="fa fa-file-pdf"></i>
                </el-button>
              </el-tooltip>

              <!--<el-tooltip content="Enviar por correo" placement="top">
              <el-button icon="el-icon-message" @click.prevent="showSendEmailModal()"></el-button>
            </el-tooltip>-->

              <el-button
                v-if="allow_note && type !== 'simple'"
                @click.prevent="newNote('nc')"
                type="danger"
                icon="el-icon-remove"
                plain
              >
                Nota credito
              </el-button>

              <el-button
                v-if="allow_note && type !== 'simple'"
                @click.prevent="newNote('nd')"
                type="success"
                icon="el-icon-plus"
                plain
              >
                Nota debito
              </el-button>

              <el-button
                v-if="type === 'quotation'"
                @click.prevent="toInvoice()"
                type="primary"
                plain
              >
                <i class="fa fa-file-import"></i>
                Convertir en factura
              </el-button>
            </el-button-group>
          </div>
        </div>

        <div class="hide-desktop">
          <el-button @click="toggleListTransactions()">
            <i class="fa fa-bars"></i>
          </el-button>
        </div>
        <div class="vx-card paper" ref="documento" v-loading="loading">
          <el-tooltip placement="top">
            <div slot="content" class="text-center">
              Este documento fue generado<br />con tipo de moneda
              {{
                transaction.currency_id === 2
                  ? "Colones (CRC)."
                  : "Dolares (USD)."
              }}<br />
              {{
                $store.state.current_currency.id === transaction.currency_id
                  ? ""
                  : `La moneda actual del sitema esta en ${$store.state.current_currency.name}`
              }}
            </div>
            <span
              class="badge badge-info original-currency-document"
              style="position:absolute;right: 5px;top:5px;padding:3px;color:white;font-size:12px;"
            >
              {{ transaction.currency_id === 2 ? "CRC" : "USD" }}
            </span>
          </el-tooltip>
          <!-- ribbon status hacienda -->
          <div class="box" v-if="type !== 'quotation' && type !== 'recurring'">
            <ribbon-document :status="transaction.hacienda"></ribbon-document>
          </div>

          <div class="header">
            <div class="left" v-if="type !== 'simple'">
              <div class="data-company">
                <figure class="mp-0 mb-4" v-if="!no_exist_logo">
                  <img
                    class="logo"
                    :src="url_logo + company_default.logo"
                    alt="logo"
                  />
                </figure>
                <ul class="">
                  <li v-if="company_default.fantasy_name">
                    <b>{{ company_default.fantasy_name }}</b>
                  </li>
                  <li>
                    <b v-if="!company_default.fantasy_name">
                      {{ company_default.name }}
                    </b>
                    <span v-else>
                      {{ company_default.name }}
                    </span>
                  </li>
                  <li v-if="transaction.economic_activity">
                    Actividad económica:
                    {{ transaction.economic_activity.code }} -
                    {{ transaction.economic_activity.name }}
                  </li>
                  <li v-else-if="company_default.economic_activity">
                    Actividad económica:
                    {{ company_default.economic_activity.code }} -
                    {{ company_default.economic_activity.name }}
                  </li>
                  <li>
                    {{ identification_type_letters }}:
                    {{ company_default.identification }}
                  </li>
                  <li>Teléfono: {{ company_default.phone }}</li>
                  <li>Email: {{ company_default.email }}</li>
                  <li>{{ company_default.other_signs }}</li>
                </ul>
              </div>

              <div>
                <div v-if="!transaction.is_international_client">
                  <p class="mp-0">Facturar a: {{ transaction.client.name }}</p>
                  <p v-if="!transaction.client.generic" class="mp-0">
                    Cédula: {{ transaction.client.identification }}
                  </p>
                  <p v-if="transaction.document_student">
                    Estudiante:
                    {{ transaction.document_student.student.name }}
                    {{ transaction.document_student.student.surname }}
                  </p>
                </div>

                <div v-else>
                  <p class="mp-0">
                    Facturar a: {{ transaction.international_client_name }}
                  </p>
                  <p class="mp-0">
                    Cédula: {{ transaction.international_client_cedula }}
                  </p>
                </div>
              </div>
            </div>

            <div class="left" v-if="type === 'simple'">
              <div class="data-company">
                <figure class="mp-0 mb-4" v-if="!no_exist_logo"></figure>
                <ul class="">
                  <li>
                    <b>{{ transaction.client.name }}</b>
                  </li>
                  <li>
                    {{ identification_type_letters }}:
                    {{ transaction.client.identification }}
                  </li>
                  <li>Teléfono: {{ transaction.client.phone }}</li>
                  <li>Email: {{ transaction.client.email }}</li>
                  <!-- <li>Costa Rica</li> -->
                </ul>
              </div>

              <div>
                <p class="mp-0">Facturar a: {{ company_default.name }}</p>
                <p class="mp-0">Cédula: {{ company_default.identification }}</p>
              </div>
            </div>

            <div class="right">
              <div class="identification">
                <p style="font-size:42px">{{ document_type.singular }}</p>
                <p style="margin:0">
                  <b style="letter-spacing:1px">
                    # {{ transaction.reference }}</b
                  >
                </p>
                <!-- code QR -->
                <div class="flex justify-end pt-4">
                  <qr-code :size="90" :text="url_qr"></qr-code>
                </div>
                <!-- end code qr -->
              </div>

              <div>
                <p class="mp-0" v-if="type !== 'recurring'">
                  Fecha {{ document_type.singular }}:
                  {{ transaction.created_at | moment("DD/MM/YYYY hh:mm A") }}
                </p>
                <p class="mp-0" v-else>
                  Fecha creación:
                  {{ transaction.created_at | moment("DD/MM/YYYY hh:mm A") }}
                </p>
                <p
                  class="mp-0"
                  v-if="type === 'recurring' && transaction.recurring_start_day"
                >
                  Inicio de envio:
                  {{ transaction.recurring_start_day | moment("DD/MM/YYYY") }}
                </p>
                <p
                  class="mp-0"
                  v-if="type === 'recurring' && transaction.last_sent_date"
                >
                  Ultimo envio:
                  {{ transaction.last_sent_date | moment("DD/MM/YYYY") }}
                </p>
                <p
                  class="mp-0"
                  v-if="type === 'recurring' && !transaction.last_sent_date"
                >
                  Ultimo envio: N/E
                </p>

                <p class="mp-0" v-if="type === 'recurring'">
                  Proximo envio:
                  {{ transaction.next_sent_date | moment("DD/MM/YYYY") }}
                </p>
                <p class="mp-0">
                  Metodo de pago: {{ transaction.payment_method.name }}
                </p>
                <p class="mp-0">
                  Medio de pago: {{ transaction.payment_form.name }}
                </p>
                <p class="mp-0">
                  Fecha vencimiento:
                  {{
                    transaction.expiration_date | moment("DD/MM/YYYY hh:mm A")
                  }}
                </p>
                <p v-if="transaction.currency_id !== 2" class="mp-0">
                  Tasa de cambio: ¢ {{ transaction.exchange_rate }}
                </p>
              </div>
            </div>
          </div>
          <!-- end header -->

          <div class="mt-10"></div>

          <div class="p-1" v-if="type === 'note'">
            <span
              ><b>Nota sobre {{ on_document }}:</b>
              {{
                transaction.documentable
                  ? transaction.documentable.key50digits
                  : ""
              }}</span
            >
          </div>

          <div class="p-1" v-if="type !== 'quotation' && type !== 'recurring'">
            <p style="padding:0;margin:0">
              <b>Consecutivo:</b>
              {{ transaction.key50digits.substring(21, 41) }}
            </p>
            <span><b>Clave:</b> {{ transaction.key50digits }}</span>
          </div>

          <div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th v-if="company_default.apply_ac_for_item">
                    Act.Económica
                  </th>
                  <th>Código cabys</th>
                  <th>Nombre</th>
                  <!-- <th>Unid.</th> -->
                  <th>Cant.</th>
                  <th>Tarifa</th>
                  <th>DTO.(%)</th>
                  <th>IVA(%)</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in transaction.transaction_details"
                  :key="item.id"
                >
                  <td
                    style="width:10%"
                    v-if="company_default.apply_ac_for_item"
                  >
                    {{
                      item.economic_activity
                        ? item.economic_activity.name
                        : "S/C"
                    }}
                  </td>
                  <td style="width:10%">
                    {{ item.cabys_code ? item.cabys_code : "S/A" }}
                  </td>
                  <td style="width:60%">
                    {{ item.name }} {{ item.description }}
                  </td>
                  <!-- <td>
                  {{ item.unit.description }}
                </td> -->
                  <td>
                    {{ item.quantity }}
                  </td>
                  <td>
                    <calc-price
                      :price="item.price"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                  <td>{{ item.discount }}%</td>
                  <td>{{ item.tax }}%</td>
                  <td>
                    <calc-price
                      :price="item.price * item.quantity"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>
                <tr>
                  <td colspan="7"></td>
                </tr>
                <tr>
                  <td colspan="5"></td>
                  <td>Subtotal:</td>
                  <td>
                    <calc-price
                      :price="transaction.subtotal"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr>
                  <td colspan="5"></td>
                  <td>Descuento:</td>
                  <td>
                    <calc-price
                      :price="transaction.discount"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr>
                  <td colspan="5"></td>
                  <td>IVA:</td>
                  <td>
                    <calc-price
                      :price="transaction.tax"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr v-if="transaction.exonerated">
                  <td colspan="5"></td>
                  <td>Exonerado:</td>
                  <td>
                    <calc-price
                      :price="transaction.exonerated"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr v-if="transaction.iva_devuelto > 0">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><span>Iva Devuelto:</span></td>
                  <td>
                    <calc-price
                      :price="transaction.iva_devuelto"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><span>Total:</span></td>
                  <td>
                    <calc-price
                      :price="transaction.total - transaction.iva_devuelto"
                      :currency="transaction.currency_id"
                      :exchange_rate="transaction.exchange_rate"
                    >
                    </calc-price>
                  </td>
                </tr>

                <tr v-if="transaction.currency_id !== 2">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><span>Total Colones:</span></td>
                  <td>
                    ¢{{
                      ((transaction.total - transaction.iva_devuelto) *
                        transaction.exchange_rate)
                        | formatPrice
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- end table -->

            <div class="totals row">
              <!-- <p>
              <span>Descuento:</span>
              <calc-price :price="transaction.discount"
                :currency="transaction.currency_id"
                :exchange_rate="transaction.exchange_rate">
              </calc-price>
            </p>
            <p>
              <span>IVA:</span>
              <calc-price :price="transaction.tax"
                :currency="transaction.currency_id"
                :exchange_rate="transaction.exchange_rate">
              </calc-price>
            </p> -->
            </div>
          </div>
          <!-- end body -->

          <!--comment and terms -->
          <div>
            <div v-if="transaction.comment">
              <p class="font-weight-bold mp-0">Nota:</p>
              <p>{{ transaction.comment }}</p>
            </div>
            <div v-if="transaction.term">
              <p class="font-weight-bold mp-0">Terminos y condiciones:</p>
              <p>{{ transaction.term }}</p>
            </div>
          </div>
          <!--End comment and terms -->

          <!-- autorizado hacienda -->

          <div class="resolution">
            <p>
              Autorizada mediante resolucion DGT-R-033-2019 del 20 de junio de
              2019 version 4.3
            </p>
          </div>

          <div v-if="transaction.notes && transaction.notes.length">
            <h3>* Con Nota:</h3>
            <ul>
              <li class="m-1" v-for="note in transaction.notes" :key="note.id">
                Nota de {{ note.type === "nc" ? "crédito" : "débito" }}: #
                <el-button @click.prevent="viewNote('note', note.id)">
                  {{ note.key50digits }}
                </el-button>
                <!-- <router-link class="link" :to="{name: 'detail-transaction', params: {type: 'note', id: note.id}}">
                      {{ note.key50digits }}
                    </router-link> -->
              </li>
            </ul>
          </div>
          <!-- end footer-->
        </div>
      </div>
    </div>
    <!-- end card -->

    <!-- modal send email -->
    <send-email-modal
      @emailSent="closeSendEmailModal()"
      :vis="show_send_email"
      :dataEmail="dataModalSendEmail"
      @closeModal="closeSendEmailModal()"
    >
    </send-email-modal>

    <!-- Payment Modal -->
    <payment-modal
      @paymentExecuted="executedPayment"
      @closeModal="closeModal()"
      :data="data_modal"
      :vis="payment_modal_visible"
    ></payment-modal>

    <payment-remember-modal
      @closeModal="closeSendEmailModal()"
      :dataEmail="data_modal_remember_payment"
      :visible="show_remember_payment"
    ></payment-remember-modal>

    <!-- modal edit item -->
    <vs-popup :active.sync="shareInvoiceModal" title="Compartir enlace">
      <div class="col-md-12">
        <p class="h4 p-3">
          Copia y comparte el enlace de este documento con tu cliente.
        </p>
        <div class="w-100">
          <vs-input type="text" v-model="url_qr" style="width:100%" />
          <div class="p-2 text-right">
            <vs-button
              type="gradient"
              color="success"
              v-clipboard:copy="url_qr"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              <i class="fa fa-copy"></i>
              Copiar enlace
            </vs-button>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import utilitiesService from "@/services/utilities.service";
import quotationsService from "@/services/quotations.service";
import CalcPrice from "@/components/CalcPrice.vue";
import StatusHacienda from "@/components/StatusHacienda.vue";
import RibbonDocument from "@/components/RibbonDocument.vue";
import { Printd } from "printd";
import Config from "@/config";
import SendEmailModal from "@/components/SendEmailModal.vue";
import helpers from "@/helpers/helpers";
//import printJs from 'print-js'
import { mapState } from "vuex";
import SearchFilter from "@/components/SearchFilter.vue";
import PaymentModal from "@/components/PaymentModal.vue";
import PaymentRememberModal from "@/components/PaymentRememberModal.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import PosFormat from "@/components/PosFormat.vue";
import moment from "moment";
import RegistersPerPage from "@/components/RegistersPerPage";

export default {
  name: "details-transaction",
  components: {
    CalcPrice,
    StatusHacienda,
    RibbonDocument,
    SendEmailModal,
    SearchFilter,
    PaymentModal,
    VuePerfectScrollbar,
    PosFormat,
    PaymentRememberModal,
    RegistersPerPage
  },
  data() {
    return {
      shareInvoiceModal: false,
      registers_per_page: 10,
      list: [],
      list_all: [],
      transaction: {
        client: {},
        payment_method: {},
        payment_form: {},
        key50digits: "",
        number_sent_remember_payment: 0
      },
      loading: true,
      loading_list: true,
      show_send_email: false,
      show_remember_payment: false,
      dataModalSendEmail: {
        email: "",
        subject: "",
        body: "",
        files: [],
        type: "",
        document: ""
      },
      pageCount: 1,
      page: 1,
      searchData: {},
      payment_modal_visible: false,
      data_modal: {},
      data_modal_remember_payment: {}
    };
  },
  computed: {
    ...mapState(["templates_email", "company_default"]),
    //Sobre que documento es la nota
    on_document() {
      let on_document = "Simplificado";
      if (this.transaction.documentable_type === "App\\Invoice") {
        on_document = "Factura";
      } else if (this.transaction.documentable_type === "App\\Ticket") {
        on_document = "Tiquete";
      }
      return on_document;
    },
    identification_type_letters() {
      let type = this.company_default.identification_type;
      let cedula = "";
      if (type === "01") {
        cedula = "cédula física";
      } else if (type === "02") {
        cedula = "cédula jurídica";
      } else if (type === "03") {
        cedula = "DIMEX";
      } else if (type === "04") {
        cedula = "NITE";
      }
      return cedula;
    },
    no_exist_logo() {
      return (
        !this.company_default.logo ||
        `companies/${this.company_default.id}/` == this.company_default.logo
      );
    },
    url_qr() {
      let str = `${this.type}AA${this.id}AA${this.transaction.company_id}`;
      let code64 = window.btoa(encodeURIComponent(str));
      return `https://titan2.zaturacr.com/query-public/${code64}`;
    },
    url_logo() {
      return Config.url_files;
    },
    type() {
      return this.$route.params.type;
    },
    type_xml() {
      if (this.type === "note") {
        return this.transaction.type;
      }
      return this.type;
    },
    id() {
      return this.$route.params.id;
    },
    printParameter() {
      return this.$route.params.print;
    },
    document_type() {
      let $type = {};
      if (this.type === "quotation") {
        $type = {
          singular: this.company_default.general_configurations
            .custom_quotation_name,
          plural:
            this.company_default.general_configurations.custom_quotation_name +
            "s"
        };
      } else if (this.type === "invoice") {
        $type = { singular: "Factura", plural: "Facturas" };
      } else if (this.type === "recurring") {
        $type = {
          singular: "Factura recurrente",
          plural: "Facturas recurrentes"
        };
      } else if (this.type === "ticket") {
        $type = { singular: "Tiquete", plural: "Tiquetes" };
      } else if (this.type === "note") {
        let note_singular = "Nota";
        if (this.type === "note") {
          if (this.transaction.type === "nc") {
            note_singular = "Nota Credito";
          } else {
            note_singular = "Nota Debito";
          }
        }

        $type = { singular: note_singular, plural: "Notas" };
      } else if (this.type === "simple") {
        $type = { singular: "Simplificado", plural: "Simplificados" };
      }
      return $type;
    },
    allow_note() {
      if (
        this.type !== "quotation" &&
        this.type !== "note" &&
        this.type !== "recurring"
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    changeNumPerPage(number_registers) {
      this.registers_per_page = number_registers;
      this.getDocumentsByType(this.page);
    },
    prevPage() {
      if (this.page != 1) {
        this.page = parseInt(this.page) - 1;
      }
    },
    nextPage() {
      if (this.page != this.pageCount) {
        this.page = parseInt(this.page) + 1;
      }
    },
    onCopy: function(e) {
      this.$message({
        showClose: true,
        message: `Enlace copiado correctamente`,
        type: "success"
      });
      this.shareInvoiceModal = false;
    },
    onError: function(e) {
      this.$message({
        showClose: true,
        message: `No se logro copiar el enlace`,
        type: "error"
      });
      this.shareInvoiceModal = false;
    },
    invoiceExpiration(expiration_date) {
      let expiration_date_format = this.$options.filters.moment(
        expiration_date,
        "YYYY-MM-DD"
      );
      if (expiration_date_format <= moment().format("YYYY-MM-DD")) {
        return true;
      } else {
        return false;
      }
    },
    toggleListTransactions() {
      let el = this.$refs.list_transactions;
      el.classList.toggle("visible");
    },
    clone() {
      let type = this.type;
      if (this.type === "note") {
        type = this.transaction.type;
      }

      this.$router.push({
        name: "new-clone",
        params: {
          document_type: type,
          document_id: this.id
        }
      });
    },
    paymentInvoice() {
      this.payment_modal_visible = true;
      this.data_modal = { item: this.transaction };
    },
    executedPayment(data) {
      this.payment_modal_visible = false;
      this.transaction.payment_amount =
        this.transaction.payment_amount + data.amount;
      //this.transaction.paymen
    },
    closeModal() {
      this.payment_modal_visible = false;
    },
    editQuotation() {
      this.$router.push({
        name: "edit-quotation",
        params: {
          document_type: "edit-quotation",
          document_id: this.transaction.id
        }
      });
    },
    editRecurring() {
      this.$router.push({
        name: "edit-recurring",
        params: {
          document_type: "edit-recurring",
          document_id: this.transaction.id
        }
      });
    },
    search(search) {
      this.searchData = search;
      this.page = 1;
      this.list = [];
      this.list_all = [];
      this.getDocumentsByType();
    },
    print(command) {
      switch (command.command) {
        case "print-normal":
          this.printNormal();
          break;
        case "print-pos":
          this.printPos();
          break;
      }
    },
    sendEmail(command) {
      switch (command.command) {
        case "send-email":
          this.showSendEmailModal();
          break;
        case "send-remember-payment":
          this.showSendRememberPayment({ item: command.payload });
          break;
      }
    },
    printPos() {
      this.$refs.posFormatComponent.printPos();
    },
    printNormal() {
      utilitiesService
        .getPdfTransaction(this.type, this.id)
        .then(response => {
          helpers.printBlobFile(response.data);
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
        });
    },
    getDetailTransaction(id = false, type = false) {
      this.loading = true;
      let uid = id ? id : this.id;
      let typeD = type ? type : this.type;
      utilitiesService
        .getDetailTransaction(typeD, uid)
        .then(res => {
          this.transaction = res.data.data;
          this.loading = false;
        })
        .catch(() => {
          alert("Error");
        });
    },
    getDocumentsByType(page = 1, type = false) {
      this.loading_list = true;
      let typeD = type ? type : this.type;
      utilitiesService
        .getDocumentsByType(
          this.page,
          typeD,
          this.searchData,
          this.registers_per_page
        )
        .then(res => {
          this.loading_list = false;
          this.pageCount = res.data.last_page;
          this.list = res.data.data;
        })
        .catch(() => {
          this.loading_list = false;
          this.$notify({
            title: "Ocurrio un problema",
            type: "error"
          });
        });
    },
    viewItem(id) {
      this.getDetailTransaction(id);
      this.$router.push({
        name: "detail-transaction",
        params: { type: this.type, id: id }
      });
    },
    viewNote(type, id) {
      this.list = [];
      this.page = 1;
      this.getDocumentsByType(1, "note");
      this.getDetailTransaction(id, type);
      this.$router.push({
        name: "detail-transaction",
        params: { type: type, id: id }
      });
    },
    downloadXml(command) {
      switch (command.command) {
        case "send":
          utilitiesService
            .downloadXml(command.key50digits, command.document_type, "send")
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `${command.key50digits}.xml`); //or any other extension
              document.body.appendChild(link);
              link.click();
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: "Ocurrio un problema",
                type: "error"
              });
            });
          break;

        case "response":
          utilitiesService
            .downloadXml(command.key50digits, command.document_type, "response")
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `${command.key50digits}.xml`); //or any other extension
              document.body.appendChild(link);
              link.click();
            })
            .catch(error => {
              /*this.$notify({
              title: 'Ocurrio un problema',
              type: 'error'
            });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: "Ocurrio un problema",
                type: "error"
              });
            });
          break;
      }
    },
    downloadPdf() {
      utilitiesService
        .getPdfTransaction(this.type, this.id)
        .then(response => {
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${this.id}.pdf`); //or any other extension
          document.body.appendChild(link);
          link.click();
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
        });
    },
    newNote(type) {
      this.$router.push({
        name: "new-note",
        params: {
          note_type: type,
          document_type: this.type,
          document_id: this.id
        }
      });
    },
    toInvoice() {
      this.$confirm("¿ Deseas convertir a factura ?", "Convertir", {
        confirmButtonText: "Si, continuar",
        cancelButtonText: "Cancelar",
        type: "warning",
        center: true
      })
        .then(() => {
          this.loading = true;
          quotationsService
            .quotationToInvoice(this.id)
            .then(res => {
              this.loading = false;
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "Cotización convertida correctamente",
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "error"
                });
              }
            })
            .catch(error => {
              this.loading = false;
              this.$message({
                type: "error",
                message: error.message
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
    },
    showSendEmailModal() {
      let templates = JSON.parse(JSON.stringify(this.templates_email));

      let template = templates.find(i => {
        return i.type === this.type;
      });

      if (!template) {
        template = templates.find(i => {
          return i.type === this.transaction.type;
        });
      }

      template.subject = template.subject.replace(
        "{customer_name}",
        this.transaction.client.name
      );
      template.subject = template.subject.replace(
        "{reference}",
        this.transaction.reference
      );
      template.subject = template.subject.replace(
        "{company_name}",
        this.company_default.name
      );

      template.body = template.body.replace(
        "{customer_name}",
        this.transaction.client.name
      );
      template.body = template.body.replace(
        "{reference}",
        this.transaction.reference
      );
      template.body = template.body.replace(
        "{company_name}",
        this.company_default.name
      );

      this.dataModalSendEmail = template;
      this.$set(
        this.dataModalSendEmail,
        "email",
        this.transaction.client.email
      );
      this.dataModalSendEmail.document = this.id;
      this.dataModalSendEmail.files = {};
      this.dataModalSendEmail.files.pdf = true;

      if (this.type !== "quotation" && this.type !== "recurring") {
        this.dataModalSendEmail.files.sendXml = true;

        if (
          this.transaction.hacienda === "aceptado" ||
          this.transaction.hacienda === "rechazado"
        ) {
          this.dataModalSendEmail.files.responseXml = true;
        }
      }
      this.show_send_email = true;
    },
    showSendRememberPayment(data) {
      this.data_modal_remember_payment = JSON.parse(JSON.stringify(data));
      this.show_remember_payment = true;
    },
    closeSendEmailModal() {
      this.show_send_email = false;
      this.show_remember_payment = false;
    }
  },
  watch: {
    page(newPage) {
      this.getDocumentsByType(newPage);
    }
  },
  created() {
    this.getDetailTransaction();
  },
  mounted() {
    //Infinite scroll in registers
    // Detect when scrolled to bottom.
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     const listElm = this.$refs.infinite_list;
    //     if (listElm) {
    //       listElm.addEventListener("scroll", () => {
    //         if (
    //           listElm.scrollTop + listElm.clientHeight >=
    //           listElm.scrollHeight
    //         ) {
    //           this.getDocumentsByType();
    //         }
    //       });
    //     }
    //   }, 0);
    this.getDocumentsByType();
    // });

    this.$store.dispatch("getTemplatesEmail");
  }
};
</script>

<style scoped>
.active {
  background-color: rgba(0, 25, 134, 0.171);
}
.container-detail-transaction {
  display: flex;

  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.number_remember_payment {
  font-weight: bold;
  text-align: left;
}

.menu {
  display: flex;
  justify-content: flex-end;
  text-align: right;
  width: 100%;
  padding: 10px;
  position: relative;
}

.items-menu {
  margin-left: 30px;
}

.title-list {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  height: 62px;
  font-weight: bold;
  color: black;
  font-size: 16px;
}

.list-transactions {
  width: 30%;
  border-right: 1px solid rgb(228, 227, 227);
}

.transaction-area {
  width: 100%;
}

table {
  border-collapse: collapse;
}

.paper {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 30px;
  margin: 5px 0px 0px 10px;
  position: relative;
  font-size: 12px;
  line-height: 16px;
  width: 99%;
}

.header {
  display: flex;
  justify-content: space-between;
}

.header .logo {
  display: block;
  max-width: 230px;
  max-height: 100px;
  width: auto;
  height: auto;
}

.header .data-company {
  padding-bottom: 80px;
}

.header .left,
.right {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
}

.header .left ul {
  list-style: none;
  padding: 0;
}

.header .right .identification {
  text-align: right;
}

.header .right .identification h3 {
  margin: 0;
  font-weight: bold;
}

table thead tr {
  background-color: #3c3d3a;
  color: white;
  font-weight: bold;
}

table thead th {
  font-size: 12px;
  padding: 5px;
}

.totals {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.totals p {
  text-align: right;
  width: 100%;
}

.totals p span {
  margin-right: 50px;
}

.list-transactions ul {
  list-style: none;
  padding: 0;
  font-size: 12px;
}

.list-transactions .list-item {
  padding: 5px 10px;
  cursor: pointer;
}

.list-transactions p {
  margin: 0;
}

.list-transactions .list-item .total {
  float: right;
}

.status {
  float: right;
}

.client {
  font-size: 17px;
  color: black;
  text-transform: lowercase;
  font-weight: 500;
}

.client::first-letter {
  text-transform: uppercase;
}

.invoice-number {
  color: rgb(19, 19, 163);
  font-size: 14px;
}

.total {
  color: #10163a;
  font-weight: 500;
  font-size: 14px;
}

.search-input {
  display: block !important;
  width: 100% !important;
  padding: 10px;
  border: 1px solid #ccc;
}
.mp-0 {
  margin: 0;
  padding: 0;
}
.hide-desktop {
  display: none;
}

.resolution {
  text-align: center;
  font-weight: bold;
  margin-top: 5px;
}

.arrow-pagination {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: #10163a;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  color: white;
  cursor: pointer;
}

@media screen and (max-width: 600px) {
  .paper {
    width: 100%;
    overflow: scroll;
  }

  .list-transactions {
    display: none;
  }

  .visible {
    display: block;
    position: fixed;
    z-index: 20000 !important;
    width: 85%;
    background: white;
  }

  .menu {
    padding: 0;
    text-align: left;
  }

  .hide-desktop {
    display: block;
  }
}
</style>

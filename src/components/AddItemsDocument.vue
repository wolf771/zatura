<template>
  <div>
    <!-- print to POS format -->
    <pos-format
      :company="company_default"
      :transaction="transaction"
      :url_qr="url_qr"
      ref="posFormatComponent"
    ></pos-format>
    <!-- End print to POS format -->

    <div v-loading="loading" element-loading-text="Procesando...">
      <form
        @submit.prevent="store('new-document')"
        data-vv-scope="new-document"
      >
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <label>
                <i class="fa fa-user-circle"></i>
                {{ name_new_client }}
                <a
                  href="#"
                  @click.prevent="newClient()"
                  style="display: inline-block"
                >
                  <i class="fa fa-plus"></i>
                  Nuevo {{ name_new_client | truncateText(0, 6) }}
                </a>
              </label>
              <el-select
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="doc.client"
                value-key="id"
                name="client"
                v-validate="'required'"
                filterable
                class="form-control"
              >
                <el-option
                  v-for="client in client_list"
                  :key="client.id"
                  :label="
                    is_school ? `${client.name} ${client.surname}` : client.name
                  "
                  :value="client"
                >
                </el-option>
              </el-select>
              <label v-show="errors.has('new-document.client')" class="error">
                {{ errors.first("new-document.client") }}
              </label>

              <span v-show="representative">
                <span class="text-info font-weight-bold">Representante:</span>
                {{ representative.name }}
              </span>
            </div>
          </div>
          <!-- end col one -->
          <div class="col-md-3">
            <div class="form-group">
              <label>Método de pago</label>
              <el-select
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="doc.payment_method"
                value-key="id"
                name="payment_method"
                v-validate="'required'"
                filterable
                class="form-control"
              >
                <el-option
                  v-for="payment_method in payment_methods"
                  :key="payment_method.id"
                  :label="payment_method.name"
                  :value="payment_method"
                >
                </el-option>
              </el-select>
              <label
                v-show="errors.has('new-document.payment_method')"
                class="error"
              >
                {{ errors.first("new-document.payment_method") }}
              </label>
            </div>
          </div>
          <!-- end col two -->
          <div class="col-md-3" v-if="if_payment_terms">
            <div class="form-group">
              <label>
                Plazo crédito
                <a
                  href="#"
                  @click.prevent="newPaymentTerm()"
                  style="display: inline-block"
                >
                  <i class="fa fa-plus"></i>
                  Nuevo plazo
                </a>
              </label>
              <el-select
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="doc.payment_term"
                value-key="id"
                name="payment_term"
                v-validate="'required'"
                filterable
                class="form-control"
              >
                <el-option
                  v-for="payment_term in payment_terms"
                  :key="payment_term.id"
                  :label="payment_term.name"
                  :value="payment_term"
                >
                </el-option>
              </el-select>
              <label
                v-show="errors.has('new-document.payment_term')"
                class="error"
              >
                {{ errors.first("new-document.payment_term") }}
              </label>
            </div>
          </div>
          <!-- end col three -->

          <div class="col-md-3">
            <div class="form-group">
              <label>Medio de pago</label>
              <el-select
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="doc.payment_form"
                value-key="id"
                name="payment_form"
                v-validate="'required'"
                filterable
                class="form-control"
              >
                <el-option
                  v-for="payment_form in payment_forms"
                  :key="payment_form.id"
                  :label="payment_form.name"
                  :value="payment_form"
                >
                </el-option>
              </el-select>
              <label
                v-show="errors.has('new-document.payment_form')"
                class="error"
              >
                {{ errors.first("new-document.payment_form") }}
              </label>
            </div>
          </div>
          <!-- end col four -->

          <div class="col-md-3">
            <div class="form-group">
              <label>Moneda</label>
              <el-select
                placeholder=""
                no-data-text="No hay datos."
                no-match-text="No hay resultados."
                v-model="doc.currency"
                value-key="id"
                name="currency"
                v-validate="'required'"
                filterable
                class="form-control"
                @change="changeCurrency"
              >
                <el-option
                  v-for="currency in currencies"
                  :key="currency.id"
                  :label="currency.name"
                  :value="currency"
                >
                </el-option>
              </el-select>
              <label v-show="errors.has('new-document.currency')" class="error">
                {{ errors.first("new-document.currency") }}
              </label>
            </div>
          </div>
          <!-- end col five -->

          <div
            class="col-md-3"
            v-if="type !== 'simple' && company_default.apply_ac_for_invoice"
          >
            <div
              :class="[
                'form-group',
                { 'has-danger': errors.has('economic_activity') }
              ]"
            >
              <label>Actividad Económica</label>
              <el-select
                v-model="doc.economic_activity"
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
                v-show="errors.has('new-document.economic_activity')"
                class="error"
              >
                {{ errors.first("new-document.economic_activity") }}
              </label>
            </div>
          </div>

          <!-- Is recurring section -->
          <div class="col-md-12" v-if="is_recurring">
            <h5>Datos para la recurrencia</h5>
          </div>
          <div class="row pl-5 pr-5" v-if="is_recurring">
            <div class="col-md">
              <div class="form-group">
                <label>Fecha inicio</label>
                <el-date-picker
                  style="width:100%"
                  :picker-options="datePickerOptions"
                  name="recurring_start_date"
                  v-validate="'required'"
                  v-model="doc.recurring_start_day"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Fecha inicial"
                >
                </el-date-picker>
              </div>
              <label
                v-show="errors.has('new-document.recurring_start_day')"
                class="error"
              >
                {{ errors.first("new-document.recurring_start_day") }}
              </label>
            </div>

            <div class="col-md">
              <div class="form-group">
                <label>Ciclos comunes</label>
                <el-select
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="doc.common_cycle"
                  value-key="id"
                  name="common_cycle"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                  @change="changeCommonCicle()"
                >
                  <el-option
                    v-for="common_cycle in common_cycles"
                    :key="common_cycle.id"
                    :label="common_cycle.name"
                    :value="common_cycle"
                  >
                  </el-option>
                </el-select>
              </div>
              <label
                v-show="errors.has('new-document.common_cycle')"
                class="error"
              >
                {{ errors.first("new-document.common_cycle") }}
              </label>
            </div>

            <div class="col-md" v-if="doc.common_cycle.id == 1">
              <div class="form-group">
                <label>Tipo recurrencia</label>
                <el-select
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="doc.recurring_type"
                  value-key="id"
                  name="recurring_type"
                  v-validate="rules_recurring_type"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="recurring_type in recurring_types"
                    :key="recurring_type.id"
                    :label="recurring_type.name"
                    :value="recurring_type"
                  >
                  </el-option>
                </el-select>
              </div>
              <label
                v-show="errors.has('new-document.recurring_type')"
                class="error"
              >
                {{ errors.first("new-document.recurring_type") }}
              </label>
            </div>

            <div class="col-md" v-if="doc.common_cycle.id == 1">
              <div class="form-group">
                <label>Se enviara Cada {{ periodicity }}</label>
                <el-input
                  name="recurring_cycle"
                  v-model.number="doc.recurring_cycle"
                  autocomplete="off"
                  v-validate="rules_recurring_cycle"
                ></el-input>
              </div>
              <label
                v-show="errors.has('new-document.recurring_cycle')"
                class="error"
              >
                {{ errors.first("new-document.recurring_cycle") }}
              </label>
            </div>
          </div>
          <!-- End is recurring -->

          <!-- Es cliente internacional -->
          <div class="pl-5 rpw w-100">
            <vs-checkbox
              v-if="type === 'ticket'"
              v-model="is_international_client"
              class="mb-5 p-0"
            >
              Es cliente internacional
            </vs-checkbox>

            <div
              v-if="is_international_client && type === 'ticket'"
              class="mb-2 p-1 row w-100"
            >
              <div class="form-group ml-5">
                <label class="m-0">Nombre cliente internacional</label>
                <vs-input
                  name="iternational_client_name"
                  v-model="international_client.name"
                  style="width:400px"
                  class="form-control"
                  v-validate="'required'"
                  data-vv-as="Nombre cliente"
                ></vs-input>
                <label
                  class="mt-5 pl-5 text-danger"
                  v-if="errors.first('new-document.iternational_client_name')"
                  >{{
                    errors.first("new-document.iternational_client_name")
                  }}</label
                >
              </div>
              <div class="form-group">
                <label class="m-0">Cédula cliente internacional</label>
                <vs-input
                  name="iternational_client_cedula"
                  v-model="international_client.cedula"
                  style="width:400px"
                  class="form-control"
                  v-validate="'required'"
                  data-vv-as="Cédula cliente"
                ></vs-input>

                <label
                  class="mt-5 pl-5 text-danger"
                  v-if="errors.first('new-document.iternational_client_cedula')"
                  >{{
                    errors.first("new-document.iternational_client_cedula")
                  }}</label
                >
              </div>
            </div>
          </div>
          <!-- Fin es cliente internacional -->

          <!-- search item bar -->
          <div
            class="form-group pl-5 pt-3"
            style="width:40%"
            v-if="general_configurations.mode_pos == 1"
          >
            <label>Buscar</label>
            <el-autocomplete
              value-key="name"
              class="form-control"
              v-model="searchItemPos"
              :fetch-suggestions="querySearch"
              placeholder="Buscar artículo"
              @select="selectItemPos"
            ></el-autocomplete>
          </div>

          <div
            v-if="is_recurring || type === 'invoice'"
            class="form-group mb-0 pb-0 pl-2 pr-5 text-right d-flex justify-content-end"
            style="width:100%"
          >
            <vx-tooltip
              title="Recordatorio de pago"
              text="Si marca esta opción se le emitira un recordatorio de pago al correo del cliente, esto se hara una vez de forma automatica un dia despues de vencida la factura."
            >
              <label class="p-0 m-0" style="display:flex;align-items: center">
                <vs-checkbox
                  style="display: inline-block; padding:0;margin:0"
                  v-model="doc.remember_payment"
                ></vs-checkbox>
                Enviar recordatorio de pago
              </label>
            </vx-tooltip>
          </div>

          <slot name="other-fields"></slot>
        </div>
        <!-- end row one-->

        <div class="row">
          <div style="width:100%" class="table-responsive-sm">
            <!--<table class="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th style="width:150px">
                    Tarifa({{ selected_currency.symbol }})
                  </th>
                  <th style="width: 30px">DTO.(%)</th>
                  <th style="width: 90px">IVA (%)</th>
                  <th style="width:100px">Total</th>
                </tr>
              </thead>
              <tbody>
                <row-item-document
                  v-for="(item, index) in selected_items"
                  :key="item.uid"
                  :items="items"
                  :index="index"
                  :item="item"
                  :selected_currency="selected_currency"
                >
                </row-item-document>
              </tbody>
            </table>-->
            <div class="rTable">
              <div class="rTableRow">
                <div
                  v-if="company_default.apply_ac_for_item"
                  class="rTableHead table_economic_activity"
                >
                  Act. Económica
                </div>
                <div
                  :class="
                    'rTableHead ' +
                      (!company_default.apply_ac_for_item
                        ? 'table_cabys_code'
                        : 'table_cabys_code_ac')
                  "
                >
                  Código Cabys
                </div>
                <div class="rTableHead table_name">Nombre</div>
                <div class="rTableHead table_quantity">Cantidad</div>
                <div class="rTableHead table_amount">Tarifa</div>
                <div class="rTableHead table_discount">DTO.(%)</div>
                <div class="rTableHead table_tax">IVA (%)</div>
                <div class="rTableHead table_total">Total</div>
              </div>

              <row-item-document
                v-for="(item, index) in selected_items"
                :key="item.uid"
                :items="items"
                :index="index"
                :item="item"
                :selected_currency="selected_currency"
                :exoneration_types="exoneration_types"
              >
              </row-item-document>
            </div>
            <!-- end table -->
          </div>
          <div class="col-md-12 mb-5">
            <a
              href="#"
              @click.prevent="addNewItem()"
              class="btn btn-link text-success font-weight-bold"
              style="font-size: 16px"
            >
              <i class="fa fa-plus-circle"></i>
              Nuevo Item
            </a>
          </div>
        </div>
        <!-- end row -->

        <!-- totales items -->
        <div class="row row-subtotales">
          <div class="col-md-8">
            <div class="form-group">
              <label>Nota</label>
              <el-input
                type="textarea"
                name="note"
                v-validate="{ required: note_is_required }"
                :rows="2"
                placeholder=""
                v-model="doc.note"
              >
              </el-input>
              <label v-show="errors.has('new-document.note')" class="error">
                {{ errors.first("new-document.note") }}
              </label>
            </div>
            <div class="form-group">
              <label>Terminos y condiciones</label>
              <el-input
                type="textarea"
                name="term"
                :rows="2"
                placeholder=""
                v-model="doc.term"
              >
              </el-input>
              <label v-show="errors.has('new-document.term')" class="error">
                {{ errors.first("new-document.term") }}
              </label>
            </div>
          </div>
          <div class="col-md-4 subtotales">
            <div>
              <b>Subtotal:</b>
              {{
                subtotal_invoice
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>
            <div>
              <b>Descuento:</b>
              {{
                discount_invoice
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>
            <div>
              <b>IVA:</b>
              {{ tax_invoice | currency({ symbol: selected_currency.symbol }) }}
            </div>

            <div v-if="exonerated_invoice > 0">
              <b>Exonerado:</b>
              {{
                exonerated_invoice
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>

            <div v-if="iva_devuelto(doc.payment_form.code) > 0">
              <b>Iva Devuelto:</b>
              {{
                iva_devuelto(doc.payment_form.code)
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>

            <div>
              <b>Total:</b>
              {{
                (total_invoice - iva_devuelto(doc.payment_form.code))
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>
          </div>
        </div>
        <!-- end totales items -->

        <!-- other other-fields slot -->
        <slot name="other-fields" :doc="$data.doc.correo"></slot>
        <!-- end other other-fields slot -->

        <div class="col-md-12 text-center p-t-20">
          <vs-button
            type="gradient"
            button="submit"
            color="success"
            :disabled="button_disabled"
          >
            <i class="fa fa-save"></i>
            Guardar
          </vs-button>

          <vs-button
            v-if="type === 'quotation'"
            @click.prevent="storeAndSendEmail('new-document')"
            type="gradient"
            button="submit"
            class="ml-2"
          >
            <i class="fa fa-save"></i>
            Guardar y Enviar por correo
          </vs-button>

          <vs-button
            v-if="type === 'ticket'"
            @click.prevent="storeAndPrint('new-document')"
            type="gradient"
            button="submit"
            class="ml-2"
          >
            <i class="fa fa-save"></i>
            Guardar e imprimir
          </vs-button>

          <!-- other buttons slot -->
          <slot name="buttons"></slot>
          <!-- end other buttons slot -->
        </div>
      </form>
      <!-- modal new client -->
      <new-client-modal
        @closeModal="closeModalNewClient"
        @client-store="selectClientModal"
        :vis="new_client"
        :is_provider="is_provider"
      >
      </new-client-modal>
      <!-- end new client modal -->

      <!-- modal new student -->
      <vs-popup
        :active.sync="newStudentModal"
        body-classes="p-4 card vx-card"
        modal-classes="card vx-card modal-lg"
      >
        <div
          class="col-md-12"
          v-loading="loading"
          element-loading-text="Guardando..."
        >
          <form
            @submit.prevent="storeStudent('new-student')"
            data-vv-scope="new-student"
          >
            <div class="row">
              <div class="col-md-12">
                <div class="vx-card">
                  <div class="card-body">
                    <div class="form-group">
                      <label>
                        <i class="fa fa-user-circle"></i>
                        Representante
                      </label>
                      <el-select
                        placeholder=""
                        no-data-text="No hay datos."
                        no-match-text="No hay resultados."
                        v-model="student.client"
                        value-key="id"
                        name="client"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="client in clients"
                          :key="client.id"
                          :label="client.name"
                          :value="client"
                        >
                        </el-option>
                      </el-select>
                      <label
                        v-show="errors.has('new-student.client')"
                        class="error"
                      >
                        {{ errors.first("new-student.client") }}
                      </label>
                    </div>

                    <text-input
                      name="name"
                      :label="'Nombre'"
                      v-validate="'required'"
                      :error="errors.first('new-student.name')"
                      v-model="student.name"
                      data-vv-as="Nombre"
                    >
                    </text-input>

                    <text-input
                      name="surname"
                      :label="'Apellido'"
                      v-validate="'required'"
                      :error="errors.first('new-student.surname')"
                      v-model="student.surname"
                      data-vv-as="Apellido"
                    >
                    </text-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-12 text-right">
              <vs-button type="gradient" button="submit">
                <i class="fa fa-save"></i>
                Guardar
              </vs-button>
            </div>
          </form>
        </div>
      </vs-popup>
      <!-- end modal new student -->

      <!-- modal new payment term -->
      <vs-popup
        :active.sync="new_payment_term_modal"
        body-classes="p-4 card vx-card"
        modal-classes="card vx-card modal-lg"
        title="Nuevo plazo de crédito"
      >
        <div
          class="col-md-12"
          v-loading="loading_new_payment_term"
          element-loading-text="Guardando..."
        >
          <form
            @submit.prevent="storeNewPaymentTerm('new-payment-term')"
            data-vv-scope="new-payment-term"
          >
            <div class="form-group">
              <label>Nombre</label>
              <vs-input
                class="w-100"
                name="name"
                v-validate="'required'"
                v-model="new_payment_term.name"
                data-vv-as="Nombre"
                placeholder="Ej. plazo 15 días"
              >
              </vs-input>
              <label v-show="errors.has('new-payment-term.name')" class="error">
                {{ errors.first("new-payment-term.name") }}
              </label>
            </div>

            <div class="form-group">
              <label class="w-100">Número de días del crédito</label>
              <el-input-number
                name="days"
                v-validate="'required'"
                v-model="new_payment_term.days"
                :min="1"
                :step="1"
                :max="365"
                controls-position="right"
                style="width:300px;"
              ></el-input-number>
              <label v-show="errors.has('new-payment-term.days')" class="error">
                {{ errors.first("new-payment-term.days") }}
              </label>
            </div>

            <div class="col-md-12 text-center pb-5">
              <vs-button type="gradient" button="submit">
                <i class="fa fa-save"></i>
                Guardar
              </vs-button>
            </div>
          </form>
        </div>
      </vs-popup>
      <!-- end new payment term modal -->
    </div>
  </div>
</template>

<script>
import RowItemDocument from "@/components/RowItemDocument.vue";
import clientsService from "@/services/clients.service";
import quotationsService from "@/services/quotations.service";
import invoicesService from "@/services/invoices.service";
import ticketsService from "@/services/tickets.service";
import notesService from "@/services/notes.service";
import NewClientModal from "@/components/NewClientModal.vue";
import { mapGetters, mapState, mapActions } from "vuex";
import { Printd } from "printd";
import CalcPrice from "@/components/CalcPrice.vue";
import simplesService from "@/services/simples.service";
import studentsService from "@/services/students.service";
import Modal from "@/components/Modal.vue";
import PosFormat from "@/components/PosFormat.vue";
import moment from "moment";
import utilitiesService from "@/services/utilities.service";

export default {
  name: "add-items-document",
  props: {
    items: {
      required: true,
      default: []
    },
    type: {
      required: true,
      default: null
    },
    document: {
      required: false,
      default: false
    },
    preselect_client: {
      required: false
    },
    is_simple: {
      required: false,
      default: false
    },
    is_recurring: {
      required: false,
      default: false
    }
  },
  components: {
    RowItemDocument,
    NewClientModal,
    CalcPrice,
    Modal,
    PosFormat
  },
  data() {
    return {
      economic_activities: [],
      exoneration_types: [],
      new_payment_term_modal: false,
      is_international_client: false,
      loading_new_payment_term: false,
      international_client: {
        name: "",
        cedula: ""
      },
      new_payment_term: {
        name: "",
        days: 1
      },
      transaction: {
        payment_method: {
          id: 1,
          name: "Contado"
        },
        payment_term: "",
        payment_form: {
          id: 1,
          name: "Efectivo"
        },
        currency: "",
        client: "",
        note: "",
        send_email: false,
        term: ""
      },
      todoCount: 2,
      doc: {
        remember_payment: false,
        payment_method: {
          id: 1,
          name: "Contado"
        },
        payment_term: "",
        payment_form: {
          id: 1,
          name: "Efectivo"
        },
        currency: "",
        client: "",
        note: "",
        send_email: false,
        term: "",
        recurring_start_day: moment().format("YYYY-MM-DD"),
        recurring_type: {
          id: 1,
          name: "dias"
        },
        common_cycle: "",
        recurring_cycle: 1
      },
      loading: false,
      clients: [],
      students: [],
      button_disabled: false,
      new_client: false,
      searchItemPos: "",
      generic_client: "",
      newStudentModal: false,
      student: {
        name: "",
        surname: "",
        client: ""
      },
      common_cycles: [
        {
          id: 1,
          name: "personalizado"
        },
        {
          id: 2,
          name: "cada mes"
        },
        {
          id: 3,
          name: "cada 15 dias"
        },
        {
          id: 4,
          name: "cada 3 meses"
        },
        {
          id: 5,
          name: "cada año"
        }
      ],
      recurring_types: [
        {
          id: 1,
          name: "dias",
          value: "day"
        },
        {
          id: 2,
          name: "semanas",
          value: "week"
        },
        {
          id: 3,
          name: "meses",
          value: "month"
        },
        {
          id: 4,
          name: "años",
          value: "year"
        }
      ],
      datePickerOptions: {
        disabledDate(date) {
          var dateObj = new Date();
          var month = dateObj.getUTCMonth() + 1; //months from 1-12
          var day = dateObj.getUTCDate();
          var year = dateObj.getUTCFullYear();

          let newDate = year + "-" + month + "-" + day;
          let current_date = new Date(newDate);
          return date < current_date;
        }
      }
    };
  },
  computed: {
    periodicity() {
      let periodicity = "";
      if (this.doc.recurring_type) {
        if (
          this.doc.recurring_type.name === "dias" &&
          this.doc.recurring_cycle == 1
        ) {
          periodicity = "dia";
        } else if (
          this.doc.recurring_type.name === "semanas" &&
          this.doc.recurring_cycle == 1
        ) {
          periodicity = "semana";
        } else if (
          this.doc.recurring_type.name === "meses" &&
          this.doc.recurring_cycle == 1
        ) {
          periodicity = "mes";
        } else if (
          this.doc.recurring_type.name === "años" &&
          this.doc.recurring_cycle == 1
        ) {
          periodicity = "año";
        } else {
          periodicity = `${this.doc.recurring_cycle} ${this.doc.recurring_type.name}`;
        }
      }

      return periodicity;
    },
    client_list() {
      if (this.is_school) {
        if (this.type === "simple") {
          //Providers Only
          return this.clients.filter(i => i.provider === 1);
        }
        return this.students;
      }
      return this.clients;
    },
    representative() {
      let repre = this.clients.find(i => i.id === this.doc.client.client_id);
      return repre || "";
    },
    is_provider() {
      return this.type == "simple" || this.is_simple;
    },
    is_school() {
      return this.company_default.permission === "3";
    },
    name_new_client() {
      let name = "cliente";
      if (this.is_provider) {
        name = "provedor";
      } else if (this.is_school) {
        name = "estudiante";
      }
      return name;
    },
    url_qr() {
      let str = `${this.type}AA${this.id}AA${this.transaction.company_id}`;
      let code64 = window.btoa(encodeURIComponent(str));
      return `https://titan2.zaturacr.com/query-public/${code64}`;
    },
    document_data() {
      return this.document;
    },
    note_is_required() {
      if (this.type === "nc" || this.type === "nd") {
        return true;
      }
      return false;
    },
    selected_currency() {
      if (this.doc.currency) {
        return this.doc.currency;
      }
      return this.current_currency;
    },
    if_payment_terms() {
      if (this.doc.payment_method.id == 2) {
        return true;
      }
      return false;
    },
    rules_recurring_type() {
      return this.doc.common_cycle.id == 1 ? "required" : "";
    },
    rules_recurring_cycle() {
      return this.doc.common_cycle.id == 1 ? "required|integer|min:1" : "";
    },
    ...mapState([
      "currencies",
      "current_currency",
      "payment_methods",
      "payment_terms",
      "payment_forms",
      "selected_items",
      "consecutives",
      "exchange_rate",
      "company_default",
      "general_configurations"
    ]),
    ...mapGetters([
      "subtotal_invoice",
      "tax_invoice",
      "discount_invoice",
      "total_invoice",
      "iva_devuelto",
      "exonerated_invoice"
    ])
  },
  methods: {
    ...mapActions([
      "getUnits",
      "getCurrencies",
      "getPaymentMethods",
      "getPaymentTerms",
      "getPaymentForms",
      "getConsecutives",
      "getTerms"
    ]),
    getEconomicActivities() {
      utilitiesService
        .getEconomicActivities()
        .then(res => {
          this.economic_activities = res.data;
          console.log(this.doc, this.company_default);
          if (
            !this.doc.economic_activity_id &&
            this.company_default.apply_ac_for_invoice
          ) {
            this.doc.economic_activity = res.data.find(
              i => i.id === this.company_default.economic_activity_id
            );
          }
        })
        .catch(error => {
          alert(error);
        });
    },
    newPaymentTerm() {
      this.new_payment_term_modal = true;
    },
    changeCommonCicle() {
      console.log(this.doc.common_cycle);
    },
    querySearch(val, cb) {
      //let val = this.searchItemPos;
      let items = this.items;
      if (val !== "") {
        items = items.filter(item => {
          return (
            item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            item.code.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        });
      } else {
        items = items;
      }
      cb(items);
    },
    selectItemPos(item) {
      item = JSON.parse(JSON.stringify(item));
      if (item.cabys_code) {
        item.cabys_code = item.cabys_code.id
          ? item.cabys_code.code
          : item.cabys_code;
      }

      this.searchItemPos = "";
      item.calculate_price = this.calculated_price(
        item.price,
        item.currency,
        this.exchange_rate
      );
      item.quantity = 1;
      item.discount = 0;

      let selected_items = JSON.parse(JSON.stringify(this.selected_items));
      let exist_item = selected_items.find(i => i.id === item.id);

      if (exist_item) {
        exist_item.quantity = exist_item.quantity + 1;
        let exist_item_index = selected_items.indexOf(exist_item);
        this.$store.dispatch("updateItems", {
          item: exist_item,
          index: exist_item_index
        });
      } else {
        //console.log(selected_items[0])
        if (selected_items[0].id === 0 && selected_items[0].price == 0) {
          let empty_item_index = selected_items.indexOf(selected_items[0]);
          this.$store.dispatch("updateItems", {
            item: item,
            index: empty_item_index
          });
        } else {
          this.$store.dispatch("addNewItem", { item: item });
        }
      }
    },
    addNewItem() {
      let item = {
        uid: this.todoCount++,
        id: 0,
        name: "",
        price: 0,
        calculate_price: 0,
        quantity: 1,
        discount: 0,
        tax_type: {
          id: 1,
          rate: 0
        },
        currency: {
          id: 2,
          symbol: "₡"
        }
      };
      this.$store.dispatch("addNewItem", { item: item });
    },
    selectClientModal(client) {
      this.clients.push(client);
      this.doc.client = client;
      this.new_client = false;
    },
    closeModalNewClient() {
      this.new_client = false;
    },
    getClients(page = 0) {
      //Incllude client generic
      clientsService
        .getClients(page, true)
        .then(res => {
          this.clients = res.data;

          if (this.is_school) {
            return this.clients;
          }

          if (this.type === "ticket") {
            this.generic_client = this.clients.find(i => i.generic === 1);

            //No provider
            this.clients = this.clients.filter(i => i.provider === 0);

            if (this.preselect_client) {
              this.doc.client = this.clients.find(
                i => i.id == this.preselect_client
              );
            } else {
              this.doc.client = this.clients.find(i => i.generic === 1);
            }
          } else if (this.type === "invoice" && this.preselect_client) {
            //No provider
            this.clients = this.clients.filter(i => i.provider === 0);

            this.doc.client = this.clients.find(
              i => i.id == this.preselect_client
            );
          } else if (this.type === "invoice") {
            //No provider
            this.clients = this.clients.filter(
              i => i.generic !== 1 && i.provider === 0
            );
          } else if (this.type === "simple") {
            //Providers Only
            this.clients = this.clients.filter(i => i.provider === 1);
          }
          // } else if(this.is_simple) {
          //   //Providers Only
          //   this.clients = this.clients.filter((i) => i.provider === 1);
          // }
        })
        .catch(error => {
          if (error.response.status == 401) {
            // localStorage.clear();
            // this.$router.push('login');
          }
        });
    },
    getStudents() {
      studentsService
        .getStudents(0)
        .then(res => {
          this.students = res.data;
        })
        .catch(error => {
          alert(error);
        });
    },
    calculated_price(price, currency, exchange_rate) {
      let value = 0;
      exchange_rate = parseFloat(exchange_rate);
      price = parseFloat(price);

      if (currency.id === this.selected_currency.id) {
        return price;
      }
      if (this.selected_currency.id === 1) {
        value = price / exchange_rate;
      } else if (this.selected_currency.id === 2) {
        value = price * exchange_rate;
      }
      return parseFloat(value).toFixed(2);
    },
    storeAndSendEmail(scope) {
      this.store(scope, { sendEmail: true });
    },
    storeAndPrint(scope) {
      this.store(scope, { print: true });
    },
    printPos() {
      this.$refs.posFormatComponent.printPos();
    },
    store(scope, payload = {}) {
      if (this.selected_items.length === 0) {
        this.$message({
          showClose: true,
          message: "El documento debe contener minimo un artículo.",
          type: "warning"
        });
      }
      //If send email
      if (payload.sendEmail) {
        this.doc.send_email = true;
      } else {
        this.doc.send_email = false;
      }

      //Verify is school
      this.doc.is_school = this.is_school;

      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          this.button_disabled = true;
          this.loading = true;

          //Si es recurrente
          if (this.is_recurring) {
            this.doc.is_recurring = true;
            this.doc.items = this.selected_items;

            if (this.type === "invoice") {
              quotationsService
                .storeRecurring(this.doc)
                .then(res => {
                  this.loading = false;

                  if (res.data.success) {
                    this.$message({
                      showClose: true,
                      message: "Factura recurrente creada con exito",
                      type: "success"
                    });
                    this.$router.push({
                      name: "detail-transaction",
                      params: { type: "recurring", id: res.data.item.id }
                    });
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.message,
                      type: "error"
                    });
                  }
                  this.button_disabled = false;
                })
                .catch(error => {
                  this.$message({
                    showClose: true,
                    message: error.message,
                    type: "error"
                  });
                  this.button_disabled = false;
                  this.loading = false;
                });
            } else if (this.type === "edit-recurring") {
              this.doc.is_recurring = 1;
              quotationsService
                .updateRecurring(this.doc)
                .then(res => {
                  this.loading = false;
                  if (res.data.success) {
                    this.$message({
                      showClose: true,
                      message: "Factura recurrente editada con exito",
                      type: "success"
                    });
                    this.$router.push({
                      name: "detail-transaction",
                      params: { type: "recurring", id: res.data.item.id }
                    });
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.message,
                      type: "error"
                    });
                  }
                  this.button_disabled = false;
                })
                .catch(error => {
                  this.$message({
                    showClose: true,
                    message: error.message,
                    type: "error"
                  });
                  this.button_disabled = false;
                  this.loading = false;
                });
            }
          } else if (this.type === "quotation") {
            this.doc.items = this.selected_items;
            console.log(this.doc);
            quotationsService
              .storeQuotation(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$message({
                    showClose: true,
                    message: "Cotización guardada con exito",
                    type: "success"
                  });
                  this.$router.push({
                    name: "detail-transaction",
                    params: { type: "quotation", id: res.data.item.id }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else if (this.type === "edit-quotation") {
            this.doc.items = this.selected_items;
            quotationsService
              .updateQuotation(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$message({
                    showClose: true,
                    message: "Actualizada correctamente",
                    type: "success"
                  });
                  this.$router.push({ name: "quotations" });
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else if (this.type === "invoice") {
            this.doc.items = this.selected_items;
            invoicesService
              .storeInvoice(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$message({
                    showClose: true,
                    message: "Factura guardada con exito",
                    type: "success"
                  });
                  this.$router.push({
                    name: "detail-transaction",
                    params: { type: "invoice", id: res.data.item.id }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else if (this.type === "ticket") {
            this.doc.items = this.selected_items;

            //International client
            this.doc.is_international_client = this.is_international_client
              ? 1
              : 0;
            this.doc.international_client = this.international_client;
            console.log(this.doc);
            ticketsService
              .storeTicket(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  let parameters = {};
                  if (payload.print) {
                    parameters = {
                      type: "ticket",
                      id: res.data.item.id,
                      print: "print"
                    };
                  } else {
                    parameters = { type: "ticket", id: res.data.item.id };
                  }

                  this.$message({
                    showClose: true,
                    message: "Tiquete guardado con exito",
                    type: "success"
                  });
                  this.transaction = res.data.item;
                  //console.log(this.transaction)
                  if (payload.print) {
                    setTimeout(() => {
                      this.printPos();
                      this.doc = {
                        payment_method: {
                          id: 1,
                          name: "Contado"
                        },
                        payment_term: "",
                        payment_form: {
                          id: 1,
                          name: "Efectivo"
                        },
                        currency: "",
                        client: "",
                        note: "",
                        send_email: false,
                        term: ""
                      };

                      this.doc.client = this.generic_client;
                      let no_preguntar_currency = this.currencies.find(
                        i =>
                          i.id == this.general_configurations.currency_emit_doc
                      );
                      if (no_preguntar_currency) {
                        this.doc.currency = no_preguntar_currency;
                      }
                      this.$emit("imprimio", this.todoCount++);
                    }, 1000);
                  } else {
                    this.$router.push({
                      name: "detail-transaction",
                      params: parameters
                    });
                  }
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else if (this.type === "nc" || this.type === "nd") {
            this.doc.items = this.selected_items;
            this.doc.note_type = this.type;
            this.doc.document_type = this.document_data.document_type;
            this.doc.document_id = this.document_data.document_id;

            //Is note on simple
            this.doc.is_simple = this.is_simple ? 1 : 0;

            notesService
              .storeNote(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$message({
                    showClose: true,
                    message: "Nota guardada con exito",
                    type: "success"
                  });
                  this.$router.push({
                    name: "detail-transaction",
                    params: { type: "note", id: res.data.item.id }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else if (this.type === "simple") {
            //SImplificado
            this.doc.items = this.selected_items;
            simplesService
              .storeSimple(this.doc)
              .then(res => {
                this.loading = false;
                if (res.data.success) {
                  this.$message({
                    showClose: true,
                    message: "Factura guardada con exito",
                    type: "success"
                  });
                  this.$router.push({
                    name: "detail-transaction",
                    params: { type: "simple", id: res.data.item.id }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error"
                  });
                }
                this.button_disabled = false;
              })
              .catch(error => {
                this.$message({
                  showClose: true,
                  message: error.message,
                  type: "error"
                });
                this.button_disabled = false;
                this.loading = false;
              });
          } else {
            alert("El tipo de documento a crear es invalido");
            this.button_disabled = false;
            this.loading = false;
          }
        }
      });
    },
    changeCurrency() {},
    newClient() {
      if (this.is_school) {
        this.newStudentModal = !this.newStudentModal;
      } else {
        this.new_client = !this.new_client;
      }
    },
    compareData(data) {
      let selected_items = [];
      data.transaction_details.forEach(i => {
        i.uid = this.todoCount++;
        i.calculate_price = this.calculated_price(
          i.price,
          this.document_data.currency,
          this.document_data.exchange_rate
        );
        i.currency = this.document_data.currency;
        selected_items.push(i);
      });
      this.$store.dispatch("clearItemsInvoice", {});
      this.$store.dispatch("loadItems", { selected_items: selected_items });
    },
    storeNewPaymentTerm(scope) {
      this.$validator.validateAll(scope).then(async valid => {
        if (valid) {
          this.loading_new_payment_term = true;
          try {
            const { data: res } = await utilitiesService.storeNewPaymentTerm(
              this.new_payment_term
            );

            if (res.success) {
              let new_payment_terms = this.payment_terms;
              new_payment_terms.push(res.data);
              this.doc.payment_term = res.data;

              this.$store.commit("updatePaymentTerms", {
                payment_terms: new_payment_terms
              });

              this.$message({
                showClose: true,
                message: res.message,
                type: "success"
              });
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: "error"
              });
            }
          } catch (error) {
            this.$message({
              showClose: true,
              message: "ocurrio un problema: " + error.message,
              type: "error"
            });
          }
          this.loading_new_payment_term = false;
          this.new_payment_term_modal = false;
          this.new_payment_term = {
            name: "",
            days: 1
          };
        }
      });
    },
    storeStudent(scope) {
      this.$validator.validateAll(scope).then(valid => {
        if (valid) {
          let data = this.student;
          this.loading = true;

          studentsService
            .storeStudent(data)
            .then(({ data }) => {
              this.loading = false;

              if (data.success) {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "success"
                });

                this.doc.client = data.student;
                this.students.push(data.student);
              } else {
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: "error"
                });
              }

              this.newStudentModal = false;
            })
            .catch(function(error) {
              this.loading = false;
              this.$message({
                showClose: true,
                message: error.message,
                type: "error"
              });
            });
        }
      });
      this.loading = false;
    },
    async getExonerationTypes() {
      const { data: res } = await utilitiesService.getExonerationTypes();
      this.exoneration_types = res.data;
    }
  },
  watch: {
    document_data(new_data) {
      if (new_data.document_student) {
        new_data.client = new_data.document_student.student;
      }

      if (this.is_recurring && this.type === "edit-recurring") {
        let recurring_type = this.recurring_types.find(
          i => i.value === new_data.recurring_type
        );
        let common_cycle = this.common_cycles.find(
          i => i.id === new_data.common_cycle
        );

        new_data.common_cycle = common_cycle;
        new_data.recurring_type = recurring_type;
      }

      this.doc = Object.assign({}, this.doc, new_data);
      this.compareData(new_data);
    }
  },
  mounted() {
    this.getEconomicActivities();
    this.getExonerationTypes();
    this.getStudents();
    this.getClients();
    this.getPaymentMethods();
    this.getPaymentTerms();
    this.getPaymentForms();
    this.getCurrencies().then(() => {
      let no_preguntar_currency = this.currencies.find(
        i => i.id == this.general_configurations.currency_emit_doc
      );
      if (no_preguntar_currency) {
        this.doc.currency = no_preguntar_currency;
      }
    });
    this.getConsecutives();
    this.getTerms().then(res => {
      let term = res.find(i => i.type === this.type);

      if (term) {
        this.doc.term = term.body;
      }
    });
  },
  beforeDestroy() {
    this.$store.dispatch("clearItemsInvoice", {});
  }
};
</script>

<style scoped>
.row-subtotales {
  font-display: flex;
  align-items: end;
}

.row-subtotales .subtotales div {
  padding: 0.5em;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
table thead {
  position: relative;
}
table thead {
  position: relative;
  background-color: #5a5a5a;
  font-weight: bold;
  color: white !important;
}

table tbody tr:hover {
  background-color: rgb(223, 222, 222);
  color: black;
}
</style>

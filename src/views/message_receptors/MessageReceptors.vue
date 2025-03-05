<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>
              <!-- <h4 class="font-weight-bold">Lista de aceptación de documentos</h4> -->
              <search-filter @executeSearch="search"></search-filter>
            </div>
            <vs-button type="gradient" @click="newMessage()">
              <i class="fa fa-plus"></i>
              Subir Nuevo XML
            </vs-button>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th></vs-th>
                <vs-th>Número Documento</vs-th>
                <vs-th>Emisor</vs-th>
                <vs-th>Fecha emisión</vs-th>
                <vs-th>Monto</vs-th>
                <vs-th>Tipo</vs-th>
                <vs-th>Aceptación</vs-th>
                <vs-th>Hacienda</vs-th>
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
                      <label
                        v-if="item.message == 4"
                        class="p-0 m-0"
                        style="display:flex;align-items: center"
                      >
                        <vs-checkbox
                          style="display: inline-block; padding:0;margin:0"
                          v-model="accept_multiples"
                          :vs-value="item.id"
                        ></vs-checkbox>
                      </label>
                    </vs-td>
                    <vs-td>{{ item.key50digits.substr(31, 10) }}</vs-td>
                    <vs-td>{{ JSON.parse(item.data).Emisor.Nombre }}</vs-td>
                    <vs-td>
                      {{
                        JSON.parse(item.data).FechaEmision | moment("DD-MM-Y")
                      }}
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.total"
                        :currency="item.currency"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <vs-td>{{ item.document_type }}</vs-td>
                    <vs-td>
                      <reception-condition
                        :message="item.message"
                      ></reception-condition>
                    </vs-td>
                    <vs-td>
                      <!-- JRA El valor 4 es un valor asignado cuando se obtiene el xml desde correo. Se revisa que no sea un xml obtenido desde correo, si viene de correo no se muestra el estado de hacienda hasta que se le ingresen los datos requeridos -->
                      <status-hacienda
                        v-if="item.message == 4"
                        :status="'Pendiente'"
                      ></status-hacienda>
                      <status-hacienda
                        v-else
                        :status="item.hacienda"
                      ></status-hacienda>
                    </vs-td>
                    <vs-td>
                      <el-dropdown @command="listAction">
                        <i class="fa fa-cogs text-primary"></i>

                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-if="item.message != 4"
                            :command="{
                              command: 'upload-xml',
                              payload: { item: item }
                            }"
                            class="text-info"
                          >
                            <i class="fa fa-download"></i>
                            xml subido
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="item.message != 4"
                            :command="{
                              command: 'send-xml',
                              payload: { item: item }
                            }"
                            class="text-primary"
                          >
                            <i class="fa fa-download"></i>
                            xml enviado
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="item.response_xml && item.message != 4"
                            :command="{
                              command: 'response-xml',
                              payload: { item: item }
                            }"
                            class="text-success"
                          >
                            <i class="fa fa-download"></i>
                            xml respuesta
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="item.message == 4"
                            :command="{
                              command: 'update-xml',
                              payload: { item: item }
                            }"
                            class="text-success"
                          >
                            <i class="fa fa-download"></i>
                            procesar xml
                          </el-dropdown-item>

                          <el-dropdown-item
                            :command="{
                              command: 'open-pdf',
                              payload: { item: item }
                            }"
                            class="text-success"
                          >
                            <i class="fa fa-download"></i>
                            Pdf Factura
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>

          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>

          <vs-button
            size="small"
            v-if="accept_multiples.length"
            @click="uploadMultipleDocs()"
          >
            <i class="fa fa-plus"></i>
            Procesar múltiples
          </vs-button>

          <div
            class="col-md-12 text-center"
            v-if="!loading && items.length == 0"
          >
            <p>No se han subido documentos.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal new message receptor -->
    <vs-popup
      :active.sync="newMessageReceptorModal"
      title="Subir XML del documento"
    >
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Cargando datos..."
      >
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="storeDocument()" method="POST">
              <div class="form-group">
                <label>Subir XML del documento</label>
                <div class="form-group">
                  <el-upload
                    ref="upload"
                    action="#"
                    :auto-upload="false"
                    :limit="1"
                    :on-change="xmlSelect"
                    :on-exceed="xmlExceed"
                    :on-remove="xmlRemove"
                    :file-list="fileList"
                    :multiple="false"
                  >
                    <el-button slot="trigger" size="small" type="primary">
                      <i class="fa fa-upload"></i>
                      XML DOCUMENTO
                    </el-button>
                  </el-upload>
                </div>
                <label v-show="errors.has('file_key')" class="error">
                  {{ errors.first("file_key") }}
                </label>
              </div>

              <div class="form-group">
                <label>Condición Aceptación</label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="reception.message"
                  value-key="id"
                  name="condition"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="condition in conditions"
                    :key="condition.id"
                    :label="condition.name"
                    :value="condition"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('condition')" class="error">
                  {{ errors.first("condition") }}
                </label>
              </div>
              <div
                class="form-group"
                v-if="reception.message.code && reception.message.code != 1"
              >
                <label>Detalle mensaje recepción</label>
                <el-input
                  v-model="reception.message_detail"
                  v-validate="'required'"
                  name="message_detail"
                ></el-input>
                <label v-show="errors.has('message_detail')" class="error">
                  {{ errors.first("message_detail") }}
                </label>
              </div>

              <div class="form-group">
                <label>Condición impuesto</label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="reception.tax_condition"
                  value-key="id"
                  name="tax_condition"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="tax_condition in tax_conditions"
                    :key="tax_condition.id"
                    :label="tax_condition.name"
                    :value="tax_condition"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('tax_condition')" class="error">
                  {{ errors.first("tax_condition") }}
                </label>
              </div>

              <div
                class="form-group"
                v-if="
                  reception.message.code != 3 &&
                    reception.tax_condition.code != 5
                "
              >
                <label>
                  Monto total impuesto acreditar
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      Se puede utilizar, en los casos que el monto total del
                      impuesto pagado, <br />
                      no forme en su totalidad parte del crédito aplicable.
                    </div>
                    <i class="fa fa-question-circle text-primary"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="reception.tax_credit"
                  v-validate="'decimal'"
                  name="tax_credit"
                ></el-input>
                <label v-show="errors.has('tax_credit')" class="error">
                  {{ errors.first("tax_credit") }}
                </label>
              </div>

              <div
                class="form-group"
                v-if="
                  reception.message.code != 3 &&
                    reception.tax_condition.code != 5
                "
              >
                <label>
                  Monto total de gasto aplicable
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      Se puede utilizar, en los casos que el monto total del
                      comprobante, <br />
                      no forme en su totalidad un gasto o parte del IVA pagado
                      se convierten en gastos.
                    </div>
                    <i class="fa fa-question-circle text-primary"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="reception.applicable_expense"
                  v-validate="'decimal'"
                  name="applicable_expense"
                ></el-input>
                <label v-show="errors.has('applicable_expense')" class="error">
                  {{ errors.first("applicable_expense") }}
                </label>
              </div>

              <div class="form-group">
                <label>
                  Categoría Gasto
                  <a href="#" @click.prevent="newExpenseCategory()">
                    <i class="fa fa-plus"></i>
                    Nueva
                  </a>
                </label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  v-model="reception.expense_category"
                  value-key="id"
                  name="category"
                  v-validate="'required'"
                  filterable
                  style="width:100%"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('category')" class="error">
                  {{ errors.first("category") }}
                </label>
              </div>

              <div class="text-center" style="padding-top:20px">
                <vs-button type="filled" button="submit">
                  <i class="fa fa-send"></i>
                  Enviar
                </vs-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </vs-popup>
    <!-- end modal new message receptor -->

    <!-- JRA modal edit message receptor -->
    <vs-popup
      :active.sync="editMessageReceptorModal"
      title="Actualizar aceptación de documento"
    >
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Cargando datos..."
      >
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="updateDocument()" method="POST">
              <div class="form-group" v-if="!accept_multiples.length">
                <label>Actualizar XML del documento</label>
                <label>{{ this.messageName }}</label>
              </div>

              <div class="form-group">
                <label>Condición Aceptación</label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="reception.message"
                  value-key="id"
                  name="condition"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="condition in conditions"
                    :key="condition.id"
                    :label="condition.name"
                    :value="condition"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('condition')" class="error">
                  {{ errors.first("condition") }}
                </label>
              </div>

              <div
                class="form-group"
                v-if="reception.message.code && reception.message.code != 1"
              >
                <label>Detalle mensaje recepción</label>
                <el-input
                  v-model="reception.message_detail"
                  v-validate="'required'"
                  name="message_detail"
                ></el-input>
                <label v-show="errors.has('message_detail')" class="error">
                  {{ errors.first("message_detail") }}
                </label>
              </div>

              <div class="form-group">
                <label>Condición impuesto</label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  no-data-text="No hay datos."
                  no-match-text="No hay resultados."
                  v-model="reception.tax_condition"
                  value-key="id"
                  name="tax_condition"
                  v-validate="'required'"
                  filterable
                  class="form-control"
                >
                  <el-option
                    v-for="tax_condition in tax_conditions"
                    :key="tax_condition.id"
                    :label="tax_condition.name"
                    :value="tax_condition"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('tax_condition')" class="error">
                  {{ errors.first("tax_condition") }}
                </label>
              </div>

              <div
                class="form-group"
                v-if="
                  reception.message.code != 3 &&
                    reception.tax_condition.code != 5
                "
              >
                <label>
                  Monto total impuesto acreditar
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      Se puede utilizar, en los casos que el monto total del
                      impuesto pagado, <br />
                      no forme en su totalidad parte del crédito aplicable.
                    </div>
                    <i class="fa fa-question-circle text-primary"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="reception.tax_credit"
                  v-validate="'decimal'"
                  name="tax_credit"
                ></el-input>
                <label v-show="errors.has('tax_credit')" class="error">
                  {{ errors.first("tax_credit") }}
                </label>
              </div>

              <div
                class="form-group"
                v-if="
                  reception.message.code != 3 &&
                    reception.tax_condition.code != 5
                "
              >
                <label>
                  Monto total de gasto aplicable
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      Se puede utilizar, en los casos que el monto total del
                      comprobante, <br />
                      no forme en su totalidad un gasto o parte del IVA pagado
                      se convierten en gastos.
                    </div>
                    <i class="fa fa-question-circle text-primary"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="reception.applicable_expense"
                  v-validate="'decimal'"
                  name="applicable_expense"
                ></el-input>
                <label v-show="errors.has('applicable_expense')" class="error">
                  {{ errors.first("applicable_expense") }}
                </label>
              </div>

              <div class="form-group">
                <label>
                  Categoría Gasto
                  <a href="#" @click.prevent="newExpenseCategory()">
                    <i class="fa fa-plus"></i>
                    Nueva
                  </a>
                </label>
                <el-select
                  popper-class="el-select-float"
                  placeholder=""
                  v-model="reception.expense_category"
                  value-key="id"
                  name="category"
                  v-validate="'required'"
                  filterable
                  style="width:100%"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category"
                  >
                  </el-option>
                </el-select>
                <label v-show="errors.has('category')" class="error">
                  {{ errors.first("category") }}
                </label>
              </div>

              <div class="text-center" style="padding-top:20px">
                <vs-button button="submit" type="filled">
                  <i class="fa fa-send"></i>
                  Actualizar
                </vs-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </vs-popup>
    <!-- end modal edit message receptor -->

    <!-- modal new expense category -->
    <new-expense-category-modal
      @storeExpenseCategory="storeExpenseCategory"
      @closeModal="closeModal()"
      :company_id="company_default.id"
      :vis="show_new_expense_category_modal"
    ></new-expense-category-modal>
    <!-- end modal new expense category -->
  </div>
</template>

<script>
import receptionsService from "@/services/receptions.service";
import StatusHacienda from "@/components/StatusHacienda.vue";
import ReceptionCondition from "@/components/ReceptionCondition.vue";
import utilitiesService from "@/services/utilities.service";
import CalcPrice from "@/components/CalcPrice";
import helpers from "@/helpers/helpers";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import Modal from "@/components/Modal.vue";
import expensesService from "@/services/expenses.service";
import NewExpenseCategoryModal from "@/components/NewExpenseCategoryModal.vue";
import { mapState } from "vuex";

export default {
  name: "message-receptor",
  components: {
    StatusHacienda,
    ReceptionCondition,
    CalcPrice,
    SearchFilter,
    RegistersPerPage,
    Modal,
    NewExpenseCategoryModal
  },
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 1,
      searchData: {},
      perPage: 10,
      page: 1,
      reception: {
        message: "",
        message_detail: "",
        xml_file: null,
        expense_category: "",
        tax_condition: "",
        tax_credit: "",
        applicable_expense: "",
        id: "",
        type_update_doc: "single"
      },
      message: {},
      conditions: [
        { id: 1, code: 1, name: "Aceptado" },
        { id: 2, code: 2, name: "Aceptado Parcialmente" },
        { id: 3, code: 3, name: "Rechazado" }
      ],
      fileList: [],
      categories: [],
      show_new_expense_category_modal: false,
      newMessageReceptorModal: false,
      editMessageReceptorModal: false,
      messageName: "",
      tax_conditions: [],
      accept_multiples: []
    };
  },
  computed: {
    ...mapState(["company_default"])
  },
  methods: {
    uploadMultipleDocs() {
      this.resetForm();
      this.reception.type_update_doc = "multiple";
      this.editMessageReceptorModal = true;
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getMessages(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getMessages(1, this.searchData);
    },
    getMessages(page = 1, search = {}) {
      receptionsService
        .getDocumentsReception(page, search)
        .then(res => {
          this.items = res.data.data;
          this.pageCount = res.data.last_page;
          this.loading = false;
        })
        .catch(() => {
          alert("error");
          this.loading = false;
        });
    },
    goPage(numPage) {
      this.getMessages(numPage, this.searchData);
    },
    resetForm() {
      let data_form_initial = this.$options.data().reception;
      Object.assign(this.$data.reception, data_form_initial);
      this.$validator.reset();
    },
    newMessage() {
      this.resetForm();
      this.newMessageReceptorModal = true;
      //this.$router.push({name: 'new-message-receptor'});
    },
    listAction(command) {
      switch (command.command) {
        case "upload-xml":
          utilitiesService
            .downloadFileByPath(command.payload.item.upload_xml)
            .then(response => {
              helpers.downloadBlob(
                response.data,
                `${command.payload.item.consecutive}.xml`
              );
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
          break;
        case "send-xml":
          utilitiesService
            .downloadFileByPath(command.payload.item.send_xml)
            .then(response => {
              helpers.downloadBlob(
                response.data,
                `${command.payload.item.consecutive}.xml`
              );
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
          break;
        case "response-xml":
          utilitiesService
            .downloadFileByPath(command.payload.item.response_xml)
            .then(response => {
              helpers.downloadBlob(
                response.data,
                `${command.payload.item.consecutive}.xml`
              );
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
          break;
        //JRA Case para actualizar el documento
        case "update-xml":
          this.resetForm();
          this.reception.type_update_doc = "single";
          this.reception.id = command.payload.item.id;
          this.messageName = require("path").basename(
            command.payload.item.upload_xml
          );
          this.editMessageReceptorModal = true;
          break;

        case "open-pdf":
          let item = command.payload.item;
          this.printNormal(item);
          break;
      }
    },
    printNormal(item) {
      utilitiesService
        .getPdfAutomaticReception(item.id)
        .then(response => {
          helpers.downloadBlob(
            response.data,
            item.key50digits.substr(31, 10) + ".pdf"
          );
        })
        .catch(error => {
          /*this.$notify({
          title: error.message,
          type: 'error'
        })*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: "Este archivo no esta disponible para su descarga",
            type: "error"
          });
        });
    },
    newExpenseCategory() {
      this.show_new_expense_category_modal = true;
    },
    storeExpenseCategory(new_category) {
      this.categories.push(new_category);
      this.reception.expense_category = new_category;
      this.closeModal();
    },
    closeModal() {
      this.show_new_expense_category_modal = false;
    },
    xmlSelect(file) {
      this.fileList.push(file);
      this.reception.xml_file = file.raw;
    },
    xmlExceed(file) {
      this.fileList = [];
      this.fileList.push(file[0]);
      this.reception.xml_file = file[0];
    },
    xmlRemove() {
      (this.fileList = []), (this.reception.xml_file = null);
    },
    getCategories() {
      expensesService
        .getExpenseCategories()
        .then(res => {
          this.categories = res.data;
        })
        .catch(() => {
          alert("error al obtener expense categories");
        });
    },
    storeDocument() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.loading = true;
          let formData = new FormData();
          Object.keys(this.reception).forEach(key => {
            let value;
            if (
              typeof this.reception[key] === "object" &&
              !(this.reception[key] instanceof File)
            ) {
              value = JSON.stringify(this.reception[key]);
            } else {
              value = this.reception[key];
            }
            formData.append(key, value);
          });

          receptionsService
            .storeDocumentReception(formData)
            .then(res => {
              if (res.data.success) {
                /*this.$notify({
                title: res.data.message,
                type: 'success'
              });*/
                //this.$router.push({name: 'message-receptors'});
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                this.getMessages(1, this.searchData);
                this.newMessageReceptorModal = false;
              } else {
                /*this.$notify({
              title: res.data.message,
              type: 'warning',
              duration: 5000
            })*/
                //JRA Cambio de notificacion por mensaje
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                  duration: 5000
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
                type: "error"
              });
              this.loading = false;
            });
        }
      });
    },
    updateDocument() {
      //JRA Actualizacion de la aceptacion de documentos
      this.$validator.validate().then(valid => {
        if (valid) {
          this.loading = true;

          this.reception.accept_multiples = this.accept_multiples;

          let formData = new FormData();
          Object.keys(this.reception).forEach(key => {
            let value;
            if (
              typeof this.reception[key] === "object" &&
              !(this.reception[key] instanceof File)
            ) {
              value = JSON.stringify(this.reception[key]);
            } else {
              value = this.reception[key];
            }
            formData.append(key, value);
          });

          receptionsService
            .updateDocumentReception(formData)
            .then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                this.accept_multiples = [];
                delete this.reception.accept_multiples;
                this.getMessages(1, this.searchData);
                this.editMessageReceptorModal = false;
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                  duration: 5000
                });
              }
              this.loading = false;
            })
            .catch(error => {
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
    async getTaxConditions() {
      try {
        let { data } = await utilitiesService.getTaxConditions();
        this.tax_conditions = data;
      } catch (error) {
        this.$message({
          showClose: true,
          message: error.message,
          type: "error"
        });
      }
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getMessages();
    this.getCategories();
    this.getTaxConditions();
  }
};
</script>

<style scoped>
.con-vs-popup .vs-popup {
  width: 600px !important;
}
</style>

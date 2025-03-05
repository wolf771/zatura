<template>
  <div class="row items">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <!-- <h4 class="font-weight-bold">Lista de artículos</h4> -->
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>
              <search-filter
                @executeSearch="search"
                :options="[]"
              ></search-filter>
            </div>
            <vs-button type="gradient" @click="newItem()">
              <i class="fa fa-user-plus"></i>
              Nuevo Artículo
            </vs-button>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th>Código cabys</vs-th>
                <vs-th>Código interno</vs-th>
                <vs-th>Nombre</vs-th>
                <vs-th>Categoría</vs-th>
                <vs-th>Unidad</vs-th>
                <vs-th>Precio</vs-th>
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
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="
                          item.cabys_code
                            ? `${item.cabys_code.code} - ${item.cabys_code.name} - Impuesto: ${item.cabys_code.tax_rate}%`
                            : 'S/C'
                        "
                        placement="right"
                      >
                        <span>{{
                          item.cabys_code ? item.cabys_code.code : "S/C"
                        }}</span>
                      </el-tooltip>
                    </vs-td>

                    <vs-td>
                      {{ item.code }}
                    </vs-td>

                    <vs-td>
                      {{ item.name | truncateText(0, 25) }}
                    </vs-td>

                    <vs-td>
                      {{ item.category.name }}
                    </vs-td>

                    <vs-td>
                      ({{ item.unit.symbol }}) {{ item.unit.description }}
                    </vs-td>

                    <vs-td> {{ item.currency.symbol }} {{ item.price }} </vs-td>

                    <vs-td class="whitespace-no-wrap">
                      <el-dropdown @command="itemAction">
                        <i class="fa fa-cogs text-primary"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :command="{ action: 'edit', id: item.id }"
                            class="text-success"
                          >
                            <i class="fa fa-edit"></i>
                            Editar
                          </el-dropdown-item>
                          <el-dropdown-item
                            :command="{
                              action: 'delete',
                              payload: { id: item.id }
                            }"
                            class="text-danger"
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

          <div
            class="col-md-12 text-center"
            v-if="!loading && items.length == 0"
          >
            <p>No hay artículos.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal new item -->
    <vs-popup title="Nuevo articulo" :active.sync="newItemModal">
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Guardando por favor espere"
      >
        <form @submit.prevent="storeItem()">
          <div class="row">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="">Información Artículo</h4>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Código Cabys</label>
                      <el-select
                        placeholder=""
                        v-model="item.cabys_code"
                        value-key="id"
                        name="cabys_code"
                        filterable
                        class="form-control items"
                        popper-class="el-select-float"
                        data-vv-as="Código Cabys"
                        remote
                        :remote-method="searchCabysCodes"
                        :loading="loadingSearch"
                        @change="changeTaxType"
                      >
                        <el-option
                          v-for="cabys in cabysCodes"
                          :key="cabys.id"
                          :label="`${cabys.code}-${cabys.name}`"
                          :value="cabys"
                        >
                          <span style="font-weight: bold;">{{
                            cabys.code
                          }}</span
                          >-{{ cabys.name }}
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('cabys_code')" class="error">
                        {{ errors.first("cabys_code") }}
                      </label>
                    </div>

                    <text-input
                      name="code"
                      :label="'Código uso interno'"
                      v-validate="'required'"
                      :error="errors.first('code')"
                      v-model="item.code"
                      data-vv-as="Código uso interno"
                    >
                    </text-input>
                    <text-input
                      name="name"
                      :label="'Nombre'"
                      v-validate="'required'"
                      :error="errors.first('name')"
                      v-model="item.name"
                      data-vv-as="Nombre"
                    >
                    </text-input>

                    <text-input
                      name="description"
                      :label="'Descripción'"
                      v-validate="'required'"
                      :error="errors.first('description')"
                      v-model="item.description"
                      data-vv-as="Descripción"
                    >
                    </text-input>

                    <div class="form-group">
                      <label>Categoría</label>
                      <el-select
                        placeholder=""
                        v-model="item.category"
                        value-key="id"
                        name="category"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                        popper-class="el-select-float"
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

                    <div class="form-group">
                      <label>Unidad</label>
                      <el-select
                        placeholder=""
                        v-model="item.unit"
                        value-key="id"
                        name="unit"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                        popper-class="el-select-float"
                      >
                        <el-option
                          v-for="unit in units"
                          :key="unit.id"
                          :label="unit.description"
                          :value="unit"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('unit')" class="error">
                        {{ errors.first("unit") }}
                      </label>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label>IVA</label>
                      <el-select
                        popper-class="el-select-float"
                        no-data-text="No hay datos."
                        no-match-text="No hay resultados."
                        placeholder=""
                        v-model="item.tax_type"
                        value-key="id"
                        name="tax_type"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="tax_type in tax_types"
                          :key="tax_type.id"
                          :label="tax_type.name"
                          :value="tax_type"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('tax_type')" class="error">
                        {{ errors.first("tax_type") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Moneda</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        no-data-text="No hay datos."
                        no-match-text="No hay resultados."
                        v-model="item.currency"
                        value-key="id"
                        name="currency"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="currency in currencies"
                          :key="currency.id"
                          :label="`${currency.name} (${currency.symbol})`"
                          :value="currency"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('currency')" class="error">
                        {{ errors.first("currency") }}
                      </label>
                    </div>

                    <text-input
                      name="price"
                      :label="'Precio'"
                      v-validate="'required|decimal:2'"
                      :error="errors.first('price')"
                      v-model="item.price"
                      data-vv-as="Precio"
                    >
                    </text-input>
                  </div>

                  <div class="col-md-12 text-center p-t-20">
                    <vs-button button="submit" color="primary" type="filled">
                      <i class="fa fa-save"></i>
                      Guardar
                    </vs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </vs-popup>
    <!-- end modal new item -->

    <!-- modal edit item -->
    <vs-popup :active.sync="editItemModal" title="Editar articulo">
      <div
        class="col-md-12"
        v-loading="loading"
        element-loading-text="Guardando por favor espere"
      >
        <form @submit.prevent="updateItem()">
          <div class="row">
            <div class="card vx-card">
              <div class="card-header bg-white">
                <h4 class="">Información Artículo</h4>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Código Cabys</label>
                      <el-select
                        placeholder=""
                        v-model="item.cabys_code"
                        value-key="id"
                        name="cabys_code"
                        filterable
                        class="form-control"
                        popper-class="el-select-float"
                        data-vv-as="Código Cabys"
                        remote
                        :remote-method="searchCabysCodes"
                        :loading="loadingSearch"
                        @change="changeTaxType"
                      >
                        <el-option
                          v-for="cabys in cabysCodes"
                          :key="cabys.id"
                          :label="`${cabys.code}-${cabys.name}`"
                          :value="cabys"
                        >
                          <span style="font-weight: bold;">{{
                            cabys.code
                          }}</span
                          >-{{ cabys.name }}
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('cabys_code')" class="error">
                        {{ errors.first("cabys_code") }}
                      </label>
                    </div>

                    <text-input
                      name="code"
                      :label="'Código uso interno'"
                      v-validate="'required'"
                      :error="errors.first('code')"
                      v-model="item.code"
                      data-vv-as="Código uso interno"
                    >
                    </text-input>
                    <text-input
                      name="name"
                      :label="'Nombre'"
                      v-validate="'required'"
                      :error="errors.first('name')"
                      v-model="item.name"
                      data-vv-as="Nombre"
                    >
                    </text-input>

                    <text-input
                      name="description"
                      :label="'Descripción'"
                      v-validate="'required'"
                      :error="errors.first('description')"
                      v-model="item.description"
                      data-vv-as="Descripción"
                    >
                    </text-input>

                    <div class="form-group">
                      <label>Categoría</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        v-model="item.category"
                        value-key="id"
                        name="category"
                        v-validate="'required'"
                        filterable
                        class="form-control"
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

                    <div class="form-group">
                      <label>Unidad</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        v-model="item.unit"
                        value-key="id"
                        name="unit"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="unit in units"
                          :key="unit.id"
                          :label="unit.description"
                          :value="unit"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('unit')" class="error">
                        {{ errors.first("unit") }}
                      </label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>IVA</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        v-model="item.tax_type"
                        value-key="id"
                        name="tax_type"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="tax_type in tax_types"
                          :key="tax_type.id"
                          :label="tax_type.name"
                          :value="tax_type"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('tax_type')" class="error">
                        {{ errors.first("tax_type") }}
                      </label>
                    </div>

                    <div class="form-group">
                      <label>Moneda</label>
                      <el-select
                        popper-class="el-select-float"
                        placeholder=""
                        no-data-text="No hay datos."
                        no-match-text="No hay resultados."
                        v-model="item.currency"
                        value-key="id"
                        name="currency"
                        v-validate="'required'"
                        filterable
                        class="form-control"
                      >
                        <el-option
                          v-for="currency in currencies"
                          :key="currency.id"
                          :label="`${currency.name} (${currency.symbol})`"
                          :value="currency"
                        >
                        </el-option>
                      </el-select>
                      <label v-show="errors.has('currency')" class="error">
                        {{ errors.first("currency") }}
                      </label>
                    </div>

                    <text-input
                      name="price"
                      :label="'Precio'"
                      v-validate="'required|decimal:2'"
                      :error="errors.first('price')"
                      v-model="item.price"
                      data-vv-as="Precio"
                    >
                    </text-input>
                  </div>

                  <div class="col-md-12 text-center p-t-20">
                    <vs-button button="submit" color="primary" type="filled">
                      <i class="fa fa-save"></i>
                      Guardar
                    </vs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </vs-popup>
    <!-- end modal edit item -->
  </div>
</template>

<script>
import itemsService from "@/services/items.service.js";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import { mapState, mapActions } from "vuex";
import Modal from "@/components/Modal.vue";
import utilitiesService from "../../services/utilities.service";

export default {
  name: "items",
  data() {
    return {
      cabysCodes: [],
      items: [],
      loadingSearch: false,
      loading: true,
      pageCount: 1,
      perPage: 10,
      page: 1,
      searchData: {},
      item: {
        cabys_code: "",
        code: "",
        name: "",
        description: "",
        category: "",
        unit: "",
        tax_type: "",
        price: "",
        currency: ""
      },
      newItemModal: false,
      editItemModal: false
    };
  },
  computed: {
    ...mapState(["categories", "units", "tax_types", "currencies"]),
    categories() {
      return this.$store.state.categories;
    },
    units() {
      return this.$store.state.units;
    },
    tax_types() {
      return this.$store.state.tax_types;
    },
    currencies() {
      return this.$store.state.currencies;
    }
  },
  methods: {
    ...mapActions([
      "getCategories",
      "getUnits",
      "getTaxTypes",
      "getCurrencies"
    ]),
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getItems(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getItems(1, this.searchData);
    },
    getItems(page = 1, search = {}) {
      this.loading = true;

      itemsService
        .getItems(page, search)
        .then(res => {
          this.items = res.data.data;
          this.loading = false;
          this.pageCount = res.data.last_page;
        })
        .catch(error => {
          this.loading = false;
          if (error.response.status == 401) {
            // localStorage.clear();
            // this.$router.push('login');
          }
        });
    },
    resetForm() {
      let data_form_initial = this.$options.data().item;
      Object.assign(this.$data.item, data_form_initial);
      this.$validator.reset();
    },
    newItem() {
      this.resetForm();
      this.newItemModal = true;
      //this.$router.push('new-item')
    },
    itemAction(command) {
      if (command.action == "edit") {
        //this.$router.push({name: 'edit-item', params: {id: command.id} });
        this.resetForm();
        this.getItemDetail(command.id);
        this.editItemModal = true;
      } else if (command.action == "delete") {
        this.$confirm("¿ Deseas eliminar el artículo ?", "Eliminar Artículo", {
          confirmButtonText: "Si, continuar",
          cancelButtonText: "Cancelar",
          type: "warning",
          center: true
        })
          .then(() => {
            this.loading = true;
            let index = this.items.findIndex(i => i.id === command.payload.id);
            itemsService
              .deleteItem(command.payload.id)
              .then(() => {
                this.loading = false;
                this.items.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "Artículo eliminado"
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
      }
    },
    goPage(numPage) {
      this.getItems(numPage, this.searchData);
    },
    storeItem() {
      this.$validator.validate().then(valid => {
        if (valid) {
          let data = this.item;
          this.loading = true;
          itemsService
            .storeItem(data)
            .then(() => {
              this.loading = false;
              this.$message({
                showClose: true,
                message: "Artículo Guardado correctamente",
                type: "success",
                duration: 1500
              });
              this.getItems(1, this.searchData);
              this.newItemModal = false;
            })
            .catch(function(error) {
              this.loading = false;
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
    getItemDetail(id) {
      itemsService
        .getItemDetail(id)
        .then(res => {
          this.item = res.data.item;
          if (this.item.cabys_code) this.cabysCodes.push(this.item.cabys_code);
        })
        .catch(error => {
          //this.$snotify.error(error.response.data.message);
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    updateItem() {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.loading = true;
          let data = this.item;
          itemsService
            .updateItem(data)
            .then(() => {
              this.loading = false;
              this.$message({
                showClose: true,
                message: "Artículo actualizado correctamente",
                type: "success",
                duration: 1500
              });
              this.getItems(1, this.searchData);
              this.editItemModal = false;
            })
            .catch(error => {
              this.loading = false;
              /*this.$notify({
              title: 'Error',
              message: error.message,
              type: 'error',
              duration: 1500
            });*/
              //JRA Cambio de notificacion por mensaje
              this.$message({
                showClose: true,
                message: error.message,
                type: "error",
                duration: 1500
              });
            });
        }
      });
    },
    getCategories() {
      this.$store.dispatch("getCategories", {});
    },
    getUnits() {
      this.$store.dispatch("getUnits", {});
    },
    getTaxTypes() {
      this.$store.dispatch("getTaxTypes", {});
    },
    getCurrencies() {
      this.$store.dispatch("getCurrencies", {});
    },
    searchCabysCodes(search) {
      this.loadingSearch = true;
      this.getCabysCodes(search);
    },
    //Get cabys codes
    getCabysCodes(search = false) {
      utilitiesService
        .getCabysCodes(search)
        .then(res => {
          this.loadingSearch = false;
          this.cabysCodes = res.data;
        })
        .catch(error => {
          this.loadingSearch = false;
          this.$message({
            showClose: true,
            message: error.response.data.message,
            type: "error"
          });
        });
    },
    changeTaxType(val) {
      const tt = this.tax_types.find(i => i.rate == val.tax_rate);
      console.log(tt);
      this.item.tax_type = tt;
    }
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getItems();
    this.getCategories();
    this.getUnits();
    this.getTaxTypes();
    this.getCurrencies();
    this.getCabysCodes();
  },
  components: {
    SearchFilter,
    RegistersPerPage,
    Modal
  }
};
</script>

<style>
.box-shadow {
  box-shadow: 0 0 2px rgb(136, 124, 124) !important;
}

.oculto {
  display: none;
}

.con-vs-popup .vs-popup {
  width: 700px !important;
}
.el-select-dropdown__item {
  max-width: 600px;
  position: static;
  white-space: break-spaces;
  text-overflow: none;
  /* height: auto !important; */
  height: auto;
  max-height: 60px;
}
</style>

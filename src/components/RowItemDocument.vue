<template>
  <transition name="slide-fade">
    <!--<tr class="slide-fade" style="position: relative !important">
      <td>
        <autocomplete
          v-model="item_row.name"
          :items="items"
          :selected="selected"
          :index="index"
          v-validate="{ required: isItemRequired }"
          :name="'name_' + index"
          @selectItem="addItem"
        >
        </autocomplete>
        <label v-show="errors.has('new-document.name_' + index)" class="error">
          {{ errors.first("new-document.name_" + index) }}
        </label>
      </td>

      <td>
        <el-input-number
          v-validate="{ required: isItemRequired }"
          controls-position="right"
          :name="'quantity_' + index"
          :min="0.1"
          v-model="item_row.quantity"
          :max="100000"
        ></el-input-number>
        <label
          v-show="errors.has('new-document.quantity_' + index)"
          class="error"
        >
          {{ errors.first("new-document.quantity_" + index) }}
        </label>
      </td>

      <td>
        <el-input-number
          @change="changeTarifa()"
          v-validate="{ required: isItemRequired, min_value: min_value_price }"
          :min="0"
          :max="1000000000000"
          :controls="false"
          :name="'price_' + index"
          v-model.trim="item_row.calculate_price"
        ></el-input-number>
        <label v-show="errors.has('new-document.price_' + index)" class="error">
          {{ errors.first("new-document.price_" + index) }}
        </label>
      </td>

      <td>
        <el-input-number
          v-validate="{ required: isItemRequired }"
          style="width:60px !important"
          :min="0"
          :max="100"
          :controls="false"
          :name="'discount_' + index"
          v-model="item_row.discount"
        ></el-input-number>
        <label
          v-show="errors.has('new-document.discount_' + index)"
          class="error"
        >
          {{ errors.first("new-document.discount_" + index) }}
        </label>
      </td>

      <td>
        <el-select
          style="width:92px;margin:0"
          no-data-text="No hay datos."
          no-match-text="No hay resultados."
          placeholder=""
          v-model="item_row.tax_type"
          value-key="id"
          :name="'tax_type_' + index"
          v-validate="{ required: isItemRequired }"
          filterable
          class="form-control"
        >
          <el-option
            v-for="tax_type in tax_types"
            :key="tax_type.id"
            :label="tax_type.rate + '%'"
            :value="tax_type"
          >
          </el-option>
        </el-select>
        <label v-show="errors.has('tax_type_' + index)" class="error">
          {{ errors.first("tax_type_" + index) }}
        </label>
      </td>

      <span @click="addExoneration()" style="height:40px;width:100%;line-height:40px; background:white;padding:.7em;cursor:pointer;border:1px solid #c0c4cc">0</span>

      <td class="last-column">
        <el-button
          @click.prevent="removeItem()"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          circle
          class="btn-delete-item"
        >
        </el-button>
        {{
          (((item_row.calculate_price * item_row.quantity -
            (item_row.calculate_price * item_row.quantity * item_row.discount) /
              100) *
            item_row.tax_type.rate) /
            100 +
            (item_row.calculate_price * item_row.quantity -
              (item_row.calculate_price *
                item_row.quantity *
                item_row.discount) /
                100))
            | currency({ symbol: selected_currency.symbol })
        }}
      </td>
    </tr>-->

    <div class="rTableRow" style="position: relative">
      <div
        class="rTableCell table_economic_activity"
        v-if="company_default.apply_ac_for_item"
      >
        <div
          :class="[
            'form-group',
            { 'has-danger': errors.has('economic_activity') }
          ]"
        >
          <el-select
            v-model="item.economic_activity"
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

      <div
        :class="
          'rTableCell ' +
            (!company_default.apply_ac_for_item
              ? 'table_cabys_code'
              : 'table_cabys_code_ac')
        "
      >
        <el-select
          v-validate="'required'"
          placeholder=""
          v-model="item_row.cabys_code"
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
            :label="`${cabys.code} - ${cabys.name}`"
            :value="cabys"
          >
            <span style="font-weight: bold;">{{ cabys.code }}</span
            >-{{ cabys.name }}
          </el-option>
        </el-select>
        <label v-show="errors.has('new-document.cabys_code')" class="error">
          {{ errors.first("new-document.cabys_code") }}
        </label>
      </div>

      <div class="rTableCell table_name">
        <autocomplete
          v-model="item_row.name"
          :items="items"
          :selected="selected"
          :index="index"
          v-validate="{ required: isItemRequired }"
          :name="'name_' + index"
          @selectItem="addItem"
        >
        </autocomplete>
        <label v-show="errors.has('new-document.name_' + index)" class="error">
          {{ errors.first("new-document.name_" + index) }}
        </label>
        <label class="mt-2" style="position:absolute;left:5px;top:45px"
          ><input
            type="checkbox"
            name="exoneration"
            v-model="item_row.exoneration"
            class="mr-1"
            :disabled="item_row.tax_type.rate <= 0"
          />Tiene exoneración</label
        >
      </div>

      <div class="rTableCell table_quantity">
        <el-input-number
          v-validate="{ required: isItemRequired }"
          controls-position="right"
          :name="'quantity_' + index"
          :min="0.1"
          v-model="item_row.quantity"
          :max="9999999999999"
        ></el-input-number>
        <label
          v-show="errors.has('new-document.quantity_' + index)"
          class="error"
        >
          {{ errors.first("new-document.quantity_" + index) }}
        </label>
      </div>

      <div class="rTableCell table_amount">
        <el-input-number
          @change="changeTarifa()"
          v-validate="{ required: isItemRequired, min_value: min_value_price }"
          :min="0"
          :max="1000000000000"
          :controls="false"
          :name="'price_' + index"
          v-model.trim="item_row.calculate_price"
        ></el-input-number>
        <label v-show="errors.has('new-document.price_' + index)" class="error">
          {{ errors.first("new-document.price_" + index) }}
        </label>
      </div>

      <div class="rTableCell table_discount">
        <el-input-number
          v-validate="{ required: isItemRequired }"
          style="width:60px !important"
          :min="0"
          :max="100"
          :controls="false"
          :name="'discount_' + index"
          v-model="item_row.discount"
        ></el-input-number>
        <label
          v-show="errors.has('new-document.discount_' + index)"
          class="error"
        >
          {{ errors.first("new-document.discount_" + index) }}
        </label>
      </div>

      <div class="rTableCell table_tax">
        <el-select
          style="width:92px;margin:0"
          no-data-text="No hay datos."
          no-match-text="No hay resultados."
          placeholder=""
          v-model="item_row.tax_type"
          value-key="id"
          :name="'tax_type_' + index"
          v-validate="{ required: isItemRequired }"
          filterable
          class="form-control"
        >
          <el-option
            v-for="tax_type in tax_types"
            :key="tax_type.id"
            :label="tax_type.rate + '%'"
            :value="tax_type"
          >
          </el-option>
        </el-select>
        <label v-show="errors.has('tax_type_' + index)" class="error">
          {{ errors.first("tax_type_" + index) }}
        </label>
      </div>
      <div class="rTableCell table_total last-column" style="position:relative">
        <el-button
          @click.prevent="removeItem()"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          circle
          class="btn-delete-item"
        >
        </el-button>
        {{ totalRow | currency({ symbol: selected_currency.symbol }) }}
      </div>

      <!-- Exoneration -->
      <div
        class="rTableCell w-100 row border-bottom mb-2"
        style="height:195px"
        v-if="item_row.exoneration"
      >
        <div class="col-md-3">
          <label>Tipo de exoneración</label>
          <el-select
            placeholder=""
            no-data-text="No hay datos."
            no-match-text="No hay resultados."
            v-model="item_row.exoneration_document_type"
            value-key="id"
            :name="'exoneration_type_document_' + index"
            v-validate="{ required: item_row.exoneration }"
            filterable
            class="form-control"
            data-vv-as="tipo de exoneración"
          >
            <el-option
              v-for="exoneration_type in exoneration_types"
              :key="exoneration_type.id"
              :label="exoneration_type.name"
              :value="exoneration_type"
            >
            </el-option>
          </el-select>
          <label
            v-show="
              errors.has('new-document.exoneration_type_document_' + index)
            "
            class="error"
          >
            {{
              errors.first("new-document.exoneration_type_document_" + index)
            }}
          </label>
        </div>
        <div class="col-md-3">
          <div>
            <label>Número documento</label>
            <el-input
              :name="'exoneration_document_number_' + index"
              v-model.number="item_row.exoneration_document_number"
              autocomplete="off"
              v-validate="{ required: item_row.exoneration }"
              data-vv-as="número documento"
            ></el-input>
            <label
              v-show="
                errors.has('new-document.exoneration_document_number_' + index)
              "
              class="error"
            >
              {{
                errors.first(
                  "new-document.exoneration_document_number_" + index
                )
              }}
            </label>
          </div>
        </div>
        <div class="col-md-3">
          <div>
            <div class="form-group">
              <label>Fecha del documento</label>
              <el-date-picker
                style="width:100%"
                :name="'exoneration_document_date_' + index"
                v-validate="{ required: item_row.exoneration }"
                v-model="item_row.exoneration_document_date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                placeholder="Fecha documento"
                data-vv-as="fecha del documento"
              >
              </el-date-picker>
            </div>
            <label
              v-show="
                errors.has('new-document.exoneration_document_date_' + index)
              "
              class="error"
            >
              {{
                errors.first("new-document.exoneration_document_date_" + index)
              }}
            </label>
          </div>
        </div>
        <div class="col-md-3">
          <div>
            <label>Nombre de la institución</label>
            <el-input
              :name="'exoneration_institution_name_' + index"
              v-model.number="item_row.exoneration_institution_name"
              autocomplete="off"
              v-validate="{ required: item_row.exoneration }"
              data-vv-as="nombre de la institución"
            ></el-input>
            <label
              v-show="
                errors.has('new-document.exoneration_institution_name_' + index)
              "
              class="error"
            >
              {{
                errors.first(
                  "new-document.exoneration_institution_name_" + index
                )
              }}
            </label>
          </div>
        </div>
        <div class="col-md-3">
          <div>
            <label>Porcentaje exoneración</label>
            <el-input
              style="width: 100%"
              :name="'exoneration_percentage_' + index"
              v-model.number="item_row.exoneration_percentage"
              autocomplete="off"
              v-validate="{
                required: item_row.exoneration,
                max_value: item_row.tax_type.rate,
                min_value: 0
              }"
              data-vv-as="porcentaje exoneración"
              :controls="false"
            ></el-input>
            <label
              v-show="
                errors.has('new-document.exoneration_percentage_' + index)
              "
              class="error"
            >
              {{ errors.first("new-document.exoneration_percentage_" + index) }}
            </label>
          </div>
        </div>

        <div class="col-md-3">
          <div v-if="item_row.exoneration_percentage">
            <label>Porcentaje exoneración</label>
            <div style="font-weight: bold;">
              {{
                (((item_row.calculate_price * item_row.quantity -
                  (item_row.calculate_price *
                    item_row.quantity *
                    item_row.discount) /
                    100) *
                  parseFloat(item_row.exoneration_percentage)) /
                  100)
                  | currency({ symbol: selected_currency.symbol })
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <!-- <exoneration-modal @exonerationExecuted="executedExoneration" @closeModal="closeModal()" :vis="exoneration_modal"></exoneration-modal> -->
  </transition>
</template>

<script>
import Autocomplete from "@/components/Autocomplete.vue";
import SearchItem from "@/components/SearchItem.vue";
import { mapState, mapActions } from "vuex";
// import { ExonerationModal } from '@/components/ExonerationModal.vue';
import helpers from "@/helpers/helpers";
import utilitiesService from "@/services/utilities.service";

export default {
  inject: ["$validator"],
  name: "row-item-document",
  data() {
    return {
      loadingSearch: false,
      cabysCodes: [],
      exoneration_modal: false,
      economic_activities: []
    };
  },
  components: {
    Autocomplete,
    SearchItem
    // ExonerationModal
  },
  props: {
    items: {
      required: true
    },
    index: {
      required: true
    },
    selected_currency: {
      required: true
    },
    item: {
      required: false
    },
    exoneration_types: {
      required: true
    }
  },
  computed: {
    ...mapState([
      "tax_types",
      "units",
      "exchange_rate",
      "selected_items",
      "company_default"
    ]),
    //El id del item actual para el autocomplete
    totalRow() {
      let subtotal = this.item_row.calculate_price * this.item_row.quantity;
      let discount = (subtotal * this.item_row.discount) / 100;
      let tax = ((subtotal - discount) * this.item_row.tax_type.rate) / 100;
      //tax = helpers.truncateTwoDecimalWithoutRound(tax)
      return subtotal - discount + tax;
    },
    selected() {
      return this.item.id;
    },
    item_row() {
      return this.item;
    },
    isItemRequired() {
      let required = true;
      if (this.selected_items.length >= 1) {
        this.selected_items.forEach(i => {
          if (i.name !== "" && i.calculate_price >= 0.1) {
            required = false;
          }
        });
      }
      return required;
    },
    min_value_price() {
      let min = 0.1;
      if (this.selected_items.length >= 1) {
        this.selected_items.forEach(i => {
          if (i.name !== "" && i.calculate_price >= 0.1) {
            min = 0;
          }
        });
      }
      return min;
    }
  },
  methods: {
    ...mapActions(["getUnits", "getTaxTypes"]),
    addExoneration() {
      this.exoneration_modal = true;
    },
    executedExoneration() {
      this.exoneration_modal = false;
      //this.transaction.paymen
    },
    closeModal() {
      this.exoneration_modal = false;
    },
    changeTarifa() {
      let item = this.item_row;
      item = JSON.parse(JSON.stringify(item));

      item.price = item.calculate_price;
      this.updateItem(item);
      let selected_items = JSON.parse(JSON.stringify(this.selected_items));
      this.$store.dispatch("loadItems", { selected_items: selected_items });
    },
    addItem(item, index) {
      item = JSON.parse(JSON.stringify(item));
      item.calculate_price = this.calculated_price(item.price, item.currency);
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
        this.$store.dispatch("updateItems", { item: item, index: index });
        if (item.cabys_code) {
          this.cabysCodes.push(item.cabys_code);
        }
      }
    },
    updateAllItems() {
      let selected_items = JSON.parse(JSON.stringify(this.selected_items));
      let updated_items = selected_items.map(i => {
        i.calculate_price = this.calculated_price(i.price, i.currency);
        return i;
      });
      this.$store.dispatch("loadItems", { selected_items: updated_items });
    },
    updateItem() {
      let item = this.item_row;
      this.$store.dispatch("updateItems", { item: item, index: this.index });
    },
    removeItem() {
      let items = this.selected_items;
      if (items.length === 1) return;
      items.splice(this.index, 1);
      this.$store.dispatch("deleteItem", { selected_items: items });
    },
    calculated_price(price, currency) {
      let value = 0;
      if (currency.id === this.selected_currency.id) {
        return price;
      }

      if (this.selected_currency.id === 1) {
        value = price / this.exchange_rate;
      } else if (this.selected_currency.id === 2) {
        value = price * this.exchange_rate;
      }
      return parseFloat(value).toFixed(2);
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
      this.item_row.tax_type = tt;
    },
    getEconomicActivities() {
      utilitiesService
        .getEconomicActivities()
        .then(res => {
          this.economic_activities = res.data;
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  watch: {
    item_row: {
      deep: true,
      handler(item, oldItem) {
        oldItem = JSON.parse(JSON.stringify(oldItem));
        item = JSON.parse(JSON.stringify(item));
        if (item.id === 0) {
          if (item.price === 0) {
            item.price = oldItem.calculate_price;
          }
        }

        this.updateItem(item);
      }
    },
    selected_currency() {
      this.updateAllItems();
    }
  },
  mounted() {
    this.getTaxTypes();
    this.getUnits();
    this.getCabysCodes();
    this.getEconomicActivities();
  }
};
</script>

<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-100px);
  opacity: 0;
}
.slide-fade {
  position: relative;
}
.last-column {
  position: relative;
}
.btn-delete-item {
  position: absolute;
  top: 21px;
  right: 5px;
  display: none;
}
.last-column:hover .btn-delete-item {
  display: block !important;
}
</style>

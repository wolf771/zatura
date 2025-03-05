<template>
  <transition name="slide-fade">
    <div
      v-if="item"
      :class="['rTableRow', { rTableRowOdd: index % 2 !== 0 }]"
    >
      <!-- <div
        class="rTableCell"

      >
        <div
        >
         Actividad economica
        </div>
      </div>

      -->
      <!-- <div class="rTableCell">
        <b-form-group label="Cod. Cabys" label-for="row-cabys">
          <validation-provider
            #default="{ errors, touched }"
            name="Cod. Cabys"
            rules="required"
          >
            <b-form-select
              id="row-cabys"
              v-model="item.cabysCode"
              :options="[]"
              value-field="id"
              text-field="name"
              @change="updateItem"
            ></b-form-select>

            <small v-show="errors[0] && touched" class="text-danger">{{
              errors[0]
            }}</small>
          </validation-provider>
        </b-form-group>
      </div> -->

      <div class="rTableCell table_name position-relative">
        <b-form-input
          v-model="item.name"
          @keyup="updateItem"
        />

        <b-form-checkbox
          v-model="item.have_exoneration"
          class="mt-2"
          style="position: absolute; left: 10px; bottom: -22px"
          @change="updateItem"
        >Tiene exoneración</b-form-checkbox>
      </div>

      <div class="rTableCell table_quantity">
        <b-form-input
          v-model="item.quantity"
          type="number"
          @keyup="updateItem"
        />
      </div>

      <div class="rTableCell table_amount">
        <b-form-input
          v-model="item.price"
          @keyup="updateItem"
        />
      </div>

      <div class="rTableCell table_discount">
        <b-form-input
          v-model="item.discount"
          type="number"
          @keyup="updateItem"
        />
      </div>

      <div class="rTableCell table_tax">
        <div
          v-for="(tax, index) in item.taxes"
          :key="index"
          style="width: 80%"
        >
          <span
            :id="`${item.id}-tax-item-index-${index}`"
          >{{ tax.tax_type.rate }}%</span>

          <b-tooltip
            :target="`${item.id}-tax-item-index-${index}`"
            placement="top"
          >
            {{ tax.tax_code.name }}<br>
            {{ tax.tax_type.name }}
          </b-tooltip>

          <b-button
            variant="link"
            style="color: red; padding: 5px 1px 5px 5px"
            @click="removeTaxItem(index)"
          >
            <feather-icon
              size="1.3x"
              icon="MinusCircleIcon"
              style="margin-right: 5px"
            />
          </b-button>
        </div>

        <div>
          <b-button
            variant="link"
            style="color: green; padding: 5px 1px 5px 5px; float: right"
            @click="addTaxItem"
          >
            <feather-icon
              size="1.3x"
              icon="PlusCircleIcon"
              style="margin-right: 5px"
            />
          </b-button>
        </div>
      </div>
      <div
        class="rTableCell table_total last-column"
        style="position: relative"
      >
        {{ numberFormat(total) }}

        <!-- remove item -->

        <b-button
          class="btn-delete-item"
          variant="link"
          @click="removeRow"
        >
          <feather-icon
            size="1.3x"
            icon="Trash2Icon"
            style="margin-right: 5px"
          />
        </b-button>
      </div>

      <!-- Exoneration -->
      <div
        v-if="item.have_exoneration"
        class="rTableCell w-100 row mt-3 ml-1"
        style="height: 195px"
      >
        <div class="col-md-3">
          <b-form-group
            label="Tipo de exoneración"
            label-for="row-exoneration-type"
          >
            <validation-provider
              #default="{ errors, touched }"
              name="Tipo de exoneración"
              rules="required"
            >
              <b-form-select
                id="row-exoneration-type"
                v-model="item.exoneration.type"
                :options="exonerationTypes"
                value-field="id"
                text-field="name"
                @change="updateItem"
              />

              <small
                v-show="errors[0] && touched"
                class="text-danger"
              >{{
                errors[0]
              }}</small>
            </validation-provider>
          </b-form-group>
        </div>
        <div class="col-md-3">
          <b-form-group
            label="Número de documento"
            label-for="row-exoneration-type"
          >
            <validation-provider
              #default="{ errors, touched }"
              name="Número de documento"
              rules="required"
            >
              <b-form-input
                v-model="item.exoneration.number"
                @keyup="updateItem"
              />

              <small
                v-show="errors[0] && touched"
                class="text-danger"
              >{{
                errors[0]
              }}</small>
            </validation-provider>
          </b-form-group>
        </div>
        <div class="col-md-3">
          <b-form-group
            label="Nombre de la institución"
            label-for="row-exoneration-type"
          >
            <validation-provider
              #default="{ errors, touched }"
              name="Nombre de la institución"
              rules="required"
            >
              <b-form-datepicker
                v-model="item.exoneration.date"
                locale="es"
                @input="updateItem"
              />

              <small
                v-show="errors[0] && touched"
                class="text-danger"
              >{{
                errors[0]
              }}</small>
            </validation-provider>
          </b-form-group>
        </div>
        <div class="col-md-3">
          <b-form-group
            label="Nombre de la institución"
            label-for="row-exoneration-type"
          >
            <validation-provider
              #default="{ errors, touched }"
              name="Nombre de la institución"
              rules="required"
            >
              <b-form-input
                v-model="item.exoneration.institution"
                @keyup="updateItem"
              />

              <small
                v-show="errors[0] && touched"
                class="text-danger"
              >{{
                errors[0]
              }}</small>
            </validation-provider>
          </b-form-group>
        </div>
        <div class="col-md-3">
          <b-form-group
            label="Porcentaje exoneración"
            label-for="row-exoneration-type"
          >
            <validation-provider
              #default="{ errors, touched }"
              name="Porcentaje exoneración"
              rules="required"
            >
              <b-form-input
                v-model="item.exoneration.percentage"
                @keyup="updateItem"
              />

              <small
                v-show="errors[0] && touched"
                class="text-danger"
              >{{
                errors[0]
              }}</small>
            </validation-provider>
          </b-form-group>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  BFormInput,
  BButton,
  BSidebar,
  BTooltip,
  BFormCheckbox,
  BFormGroup,
  BFormSelect,
  BFormDatepicker,
} from 'bootstrap-vue'
import numberMixins from '@/mixins/numberMixins'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'RowItemDocument',
  components: {
    BFormInput,
    BButton,
    BSidebar,
    BTooltip,
    BFormCheckbox,
    BFormGroup,
    BFormSelect,
    ValidationObserver,
    ValidationProvider,
    BFormDatepicker,
  },
  mixins: [numberMixins],
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    exonerationTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },

  computed: {
    total() {
      const subtotal = this.item.quantity * this.item.price
      const discount = subtotal * (this.item.discount / 100)
      const taxes = this.item.taxes.reduce((total, tax) => {
        const taxAmount = (subtotal - discount) * (tax.tax_type.rate / 100)
        return total + taxAmount
      }, 0)
      return subtotal - discount + taxes
    },
  },
  watch: {},
  mounted() {},
  methods: {
    addTaxItem() {
      this.$emit('addTax', this.item)
    },
    removeTaxItem(index) {
      this.$store.dispatch('invoicing/updateItem', {
        index: this.index,
        item: {
          ...this.item,
          taxes: this.item.taxes.filter((_, i) => i !== index),
        },
      })
    },
    removeRow() {
      this.$store.dispatch('invoicing/removeItem', this.index)
    },
    updateItem() {
      this.$store.dispatch('invoicing/updateItem', {
        index: this.index,
        item: { ...this.item, discount: this.item.discount },
      })
    },
  },
}
</script>

<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.5s ease;
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
  color: red;
  padding: 5px 1px 5px 5px;
  position: absolute;
  right: 5px;
  top: 0px;
  display: none;
}
.rTableRow:hover .btn-delete-item {
  display: block !important;
}
</style>

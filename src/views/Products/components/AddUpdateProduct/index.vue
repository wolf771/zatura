<template>
  <div>
    <validation-observer ref="createProductForm">
      <b-form
        class="mt-2"
        @submit.prevent="createProduct"
      >
        <b-container>
          <b-row>
            <b-col>
              <b-form-group
                label="Código uso interno"
                label-for="product-code"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Código uso interno"
                  rules="required"
                >
                  <b-form-input
                    id="product-code"
                    v-model="product.code"
                    :state="errors.length > 0 ? false : null"
                    name="product-code"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Código cabys"
                label-for="product-cabys-code"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Código_cabys"
                  rules="required"
                >
                  <v-select
                    v-model="product.cabys"
                    label="descripcion"
                    :options="options"
                    :filterable="false"
                    @search="fetchOptions"
                  >
                    <template #option="{ codigo, descripcion }">
                      <p style="margin: 0">
                        {{ codigo }} - {{ descripcion }}
                      </p>
                    </template>

                    <template #selected-option="{ codigo, descripcion }">
                      <p style="margin: 0">
                        {{ codigo }} - {{ descripcion }}
                      </p>
                    </template>
                  </v-select>

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Categoría"
                label-for="product-category"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Categoría"
                  rules="required"
                >
                  <b-form-select
                    id="product-category"
                    v-model="product.category"
                    :options="productCategories"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Unidad"
                label-for="product-unit"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Unidad"
                  rules="required"
                >
                  <b-form-select
                    id="product-unit"
                    v-model="product.unit"
                    :options="units"
                    value-field="id"
                    text-field="description"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Nombre"
                label-for="product-name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Nombre"
                  rules="required"
                >
                  <b-form-input
                    id="product-name"
                    v-model="product.name"
                    :state="errors.length > 0 ? false : null"
                    name="product-name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Descripción"
                label-for="product-description"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Descripción"
                  rules="required"
                >
                  <b-form-input
                    id="product-description"
                    v-model="product.description"
                    :state="errors.length > 0 ? false : null"
                    name="product-description"
                    multiline
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Moneda"
                label-for="product-currency"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Moneda"
                  rules="required"
                >
                  <b-form-select
                    id="product-currency"
                    v-model="product.currency"
                    :options="currencies"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Precio"
                label-for="product-price"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Precio"
                  rules="required"
                >
                  <b-form-input
                    id="product-price"
                    v-model="product.price"
                    :state="errors.length > 0 ? false : null"
                    name="product-price"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col>
              <h4>Impuestos</h4>
              <ul class="list-group">
                <li
                  v-for="t, index in product.taxes"
                  :key="index"
                  class="list-group-item list-group-item"
                >
                  {{ t.tax_code.name }} - {{ t.tax_type.name }}
                  <feather-icon
                    icon="XCircleIcon"
                    size="1.2x"
                    class="float-right text-danger cursor-pointer"
                    @click="deleteTax(index)"
                  />
                </li>
              </ul>
              <b-form-group
                label="Tipo de impuesto"
                label-for="product-tax_code"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Tipo de impuesto"
                >
                  <b-form-select
                    id="product-tax_code"
                    v-model="tax.tax_code"
                    :options="taxCodes"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label="Tarifa impuesto"
                label-for="product-tax_type"
              >
                <validation-provider
                  #default="{ errors, touched }"
                  name="Tarifa impuesto"
                >
                  <b-form-select
                    id="product-tax_type"
                    v-model="tax.tax_type"
                    :options="taxTypes"
                    value-field="id"
                    text-field="name"
                  />

                  <small
                    v-show="errors[0] && touched"
                    class="text-danger"
                  >
                    {{ errors[0] }}
                  </small>
                </validation-provider>
              </b-form-group>
              <b-button
                variant="primary"
                class="px-1"
                @click="addTax()"
              >
                <feather-icon
                  size="1.2x"
                  icon="PlusIcon"
                />
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div
                class="d-flex justify-content-center align-items-center py-5"
              >
                <b-button
                  type="submit"
                  variant="primary"
                >Guardar</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import {
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BFormSelect,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import vSelect from 'vue-select'
import { mapState } from 'vuex'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

const productData = {
  id: null,
  code: null,
  cabys: null,
  category: null,
  unit: null,
  name: null,
  description: null,
  currency: 1,
  price: null,
  taxes: [],
  taxesD: [],
}
export default {
  components: {
    BContainer,
    BRow,
    BCol,
    ValidationObserver,
    ValidationProvider,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
    vSelect,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      product: JSON.parse(JSON.stringify(productData)),
      tax: {
        tax_code: '',
        tax_type: '',
      },
      taxD: [],
      options: [],
    }
  },
  computed: {
    ...mapState({
      cabysCodes: state => state.app.cabysCodes,
      productCategories: state => state.app.initData.product_categories,
      units: state => state.app.initData.units,
      currencies: state => state.app.initData.currencies,
      taxCodes: state => state.app.initData.tax_codes,
      taxTypes: state => state.app.initData.tax_types,
    }),
  },
  watch: {
    item: {
      async handler(val) {
        if (val) {
          console.log(val)
          this.product = Object.assign(productData, val)
          this.product.currency = val.currency_id
          this.product.category = val.product_category_id
          // this.product.cabys = val.cabys_code
          this.product.unit = val.unit_id

          const res = await this.$store.dispatch('app/getCabysCodes', {
            search: val.cabys_code,
          })
          if (res && res.length > 0) {
            const [cabys] = res
            this.product.cabys = cabys
            this.options = res
          }
        } else {
          this.product = {
            id: null,
            code: null,
            cabys: null,
            category: null,
            unit: null,
            name: null,
            description: null,
            currency: null,
            price: null,
            taxes: [],
            taxesD: [],
          }
          this.tax = {
            tax_code: '',
            tax_type: '',
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // ADD TAX
    addTax() {
      const taxType = this.taxTypes.find(i => i.id === this.tax.tax_type)
      const taxCode = this.taxCodes.find(i => i.id === this.tax.tax_code)

      this.product.taxes.push({
        tax_code: taxCode,
        tax_type: taxType,
      }) // JSON.parse(JSON.stringify(this.tax))
    },
    // DELETE TAX
    deleteTax(index) {
      this.taxD = this.product.taxes[index]
      console.log(this.taxD)
      if (this.taxD?.id) this.product.taxesD.push(this.taxD)
      this.product.taxes.splice(index, 1)
    },
    // CREATE PRODUCT
    createProduct() {
      this.$refs.createProductForm.validate().then(async success => {
        console.log(success)
        console.log(this.product)
        if (success) {
          const res = await this.$store.dispatch('products/save', {
            ...this.product,
            cabys: this.product.cabys.codigo || this.product.cabys_code,
            taxesD: this.product.taxesD.map(i => i.id),
          })
          this.product = JSON.parse(JSON.stringify(productData))
          this.tax = {
            tax_code: '',
            tax_type: '',
          }
          this.$refs.createProductForm.reset()
          this.$emit('saved', res)

          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Producto guardado correctamente',
              icon: 'CheckCircleIcon',
              variant: 'success',
            },
          })
        }
      })
    },
    async fetchOptions(search, loading) {
      if (search) {
        loading(true)
        const res = await this.$store.dispatch('app/getCabysCodes', {
          search,
        })
        loading(false)
        this.options = res
        return res
      }
      return null
    },
  },
}
</script>

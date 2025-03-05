<template>
  <b-card>
    <b-row class="pb-1">
      <b-col
        md="3"
        cols="6"
      >
        <b-form-input
          v-model="searchValue"
          placeholder="Buscar"
          debounce="400"
        />
      </b-col>
      <b-col
        md="9"
        cols="6"
        class="text-right"
      >
        <b-button
          v-b-tooltip.hover.bottom="'Nuevo Articulo'"
          variant="primary"
          class="px-1"
          @click="create()"
        >
          <feather-icon
            size="1.2x"
            icon="PlusIcon"
          />
        </b-button>
      </b-col>
    </b-row>
    <b-table
      hover
      responsive="sm"
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :busy="loading"
      show-empty
    >
      <template #cell(price)="data">
        <format-price
          :price="data.item.price"
          :currency="data.item.currency_id"
        />
      </template>

      <template #cell(actions)="data">
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content>
            <feather-icon icon="SettingsIcon" />
          </template>
          <b-dropdown-item
            @click="edit(data.item)"
          >Editar
          </b-dropdown-item>
          <b-dropdown-item
            @click="deleteItem(data.item)"
          >Eliminar
          </b-dropdown-item>
        </b-dropdown>
      </template>

      <template #table-busy>
        <div class="text-center text-primary my-5 pt-3">
          <b-spinner
            type="grow"
            class="align-middle"
          />
          <strong class="ml-1">Cargando</strong>
        </div>
      </template>

      <template #empty>
        <div
          class="text-center my-5 pt-3 d-flex w-100 justify-content-center align-items-center"
        >
          <feather-icon
            icon="AlertCircleIcon"
            size="1.5x"
          />
          <strong class="ml-1">No hay registros para mostrar</strong>
        </div>
      </template>
    </b-table>
    <b-row
      v-show="items.length > 0 && !loading"
    >
      <b-col
        md="2"
        sm="12"
        class="d-none d-sm-block"
      >
        <b-form-group class="mb-0">
          <label class="d-inline-block mr-50">Por página</label>
          <b-form-select
            id="perPageSelect"
            :value="perPage"
            size="sm"
            :options="pageOptions"
            style="width: auto"
            @change="perPageChange"
          />
        </b-form-group>
      </b-col>
      <b-col
        v-show="totalRows > perPage"
        md="10"
        sm="12"
      >
        <b-pagination
          striped
          hover
          responsive
          first-number
          last-number
          :value="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          size="sm"
          class="my-0"
          @change="changePage"
        />
      </b-col>
    </b-row>

    <b-sidebar
      v-model="open"
      width="40%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <template
        #title
      >
        Nuevo producto
      </template>

      <AddUpdateProduct
        :item="item"
        @saved="() => openSidebar(false)"
      />
    </b-sidebar>
  </b-card>
</template>

<script>
import {
  BCard,
  BTable,
  BCol,
  BPagination,
  BRow,
  BFormGroup,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BFormInput,
  BButton,
  BSidebar,
  VBToggle,
  BSpinner,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
import FormatPrice from '@/components/format-price/index.vue'
import { confirmAlert } from '@/helpers/utils'
import AddUpdateProduct from './components/AddUpdateProduct/index.vue'

export default {
  components: {
    BCard,
    BTable,
    BCol,
    BPagination,
    BRow,
    BFormGroup,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BFormInput,
    BButton,
    BSidebar,
    BSpinner,
    FormatPrice,
    AddUpdateProduct,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      open: false,
      searchValue: '',
      item: null,
      fields: [
        {
          key: 'cabys_code',
          label: 'Código cabys',
          sortable: true,
        },
        {
          key: 'code',
          label: 'Código interno',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nombre',
          sortable: true,
        },
        {
          key: 'unit.symbol',
          label: 'Unidad',
          sortable: true,
        },
        {
          key: 'price',
          label: 'Precio',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Acciones',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      items: state => state.products.items,
      perPage: state => state.products.perPage,
      currentPage: state => state.products.currentPage,
      totalRows: state => state.products.totalRows,
      pageOptions: state => state.products.pageOptions,
      searchTerm: state => state.products.searchTerm,
      loading: state => state.products.loading,
    }),
  },
  watch: {
    searchValue(value) {
      this.$store.dispatch('products/searchTermChange', value)
      this.getItems()
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    getItems(page = 1) {
      this.$store.dispatch('products/get', {
        currentPage: page,
      })
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    create() {
      this.item = null
      this.openSidebar()
    },
    async deleteItem(item) {
      const res = await confirmAlert('¿Está seguro de eliminar este registro?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('products/delete', {
          id: item.id,
        })
        console.log(r)
        this.$swal('Eliminado', 'El registro ha sido eliminado', 'success')
      }
    },
    openSidebar(open = true) {
      this.open = open
    },
    changePage(page) {
      console.log(page)
      this.getItems(page)
    },
    perPageChange(perPage) {
      this.$store.dispatch('products/perPageChange', perPage)
      this.getItems()
    },
    search(value) {
      console.log(value)
    },
  },

}
</script>

<style></style>

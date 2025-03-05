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
          v-b-tooltip.hover.bottom="'Nuevo Cliente'"
          variant="link"
          class="p-0 m-o"
          @click="create()"
        >
          <svg-icon
            type="mdi"
            :path="path"
            style="
            border: none;
            height: 37px;
            width: 37px;
            margin-bottom:-10px;
            margin-top:-5px;
            "
          />
        </b-button>
        <!-- <b-button
          v-b-tooltip.hover.bottom="'Nuevo Cliente'"
          variant="primary"
          class="px-1"
          @click="create()"
        >
          <feather-icon
            size="1.2x"
            icon="PlusIcon"
          />
        </b-button> -->
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
      <template #cell(name)="data">
        <router-link :to="{name: 'client-detail', params:{id : data.item.id}}">
          {{ data.item.name }}
        </router-link>
      </template>
      <template #cell(balance)>
        0
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
          <b-dropdown-item @click="edit(data.item)">
            Editar
          </b-dropdown-item>
          <b-dropdown-item
            @click="deleteItem(data.item)"
          >Eliminar</b-dropdown-item>
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
    ><b-col
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
      <AddUpdateClient
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
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlusCircle } from '@mdi/js'

// eslint-disable-next-line import/no-extraneous-dependencies
import { confirmAlert } from '@/helpers/utils'
import AddUpdateClient from './components/AddUpdateClient.vue'

export default {
  components: {
    SvgIcon,
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
    AddUpdateClient,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      path: mdiPlusCircle,
      open: false,
      searchValue: '',
      item: null,
      fields: [
        {
          key: 'name',
          label: 'Nombre',
          sortable: true,
        },
        {
          key: 'identification',
          label: 'Identificación',
          sortable: true,
        },
        {
          key: 'email',
          label: 'Email',
          sortable: true,
        },
        {
          key: 'phone',
          label: 'Teléfono',
          sortable: true,
        },
        {
          key: 'balance',
          label: 'Balance',
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
      items: state => state.clients.items,
      perPage: state => state.clients.perPage,
      currentPage: state => state.clients.currentPage,
      totalRows: state => state.clients.totalRows,
      pageOptions: state => state.clients.pageOptions,
      searchTerm: state => state.clients.searchTerm,
      loading: state => state.clients.loading,
    }),
  },
  watch: {
    searchValue(value) {
      this.$store.dispatch('clients/searchTermChange', value)
      this.getItems()
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    openClient() {
      console.log('hola')
    },
    create() {
      this.item = null
      this.openSidebar()
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    async deleteItem(item) {
      const res = await confirmAlert('¿Está seguro de eliminar este registro?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('clients/delete', {
          id: item.id,
        })
        console.log(r)
        this.$swal('Eliminado', 'El registro ha sido eliminado', 'success')
      }
    },
    openSidebar(open = true) {
      this.open = open
    },
    getItems(page = 1) {
      this.$store.dispatch('clients/get', {
        currentPage: page,
      })
    },
    changePage(page) {
      console.log(page)
      this.getItems(page)
    },
    perPageChange(perPage) {
      this.$store.dispatch('clients/perPageChange', perPage)
      this.getItems()
    },
    search(value) {
      console.log(value)
    },
  },
}
</script>

<style></style>

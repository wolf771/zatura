<template>
  <b-card>
    <b-row class="pb-1">
      <b-col md="3" cols="6">
        <b-form-input
          v-model="searchValue"
          placeholder="Buscar"
          debounce="400"
        />
      </b-col>
      <b-col md="9" cols="6" class="text-right">
        <b-button variant="primary" class="px-1" v-b-toggle.new-client-sidebar>
          <feather-icon size="1.2x" icon="PlusIcon" />
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
      small
      stacked="md"
    >
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
          <b-dropdown-item @click="actionList({
                              action: 'edit-company',
                              data:data.item
                            })">Editar</b-dropdown-item>
          <b-dropdown-item href="#">Eliminar</b-dropdown-item>
        </b-dropdown>
      </template>

      <template #table-busy>
        <div class="text-center text-primary my-5 pt-3">
          <b-spinner type="grow" class="align-middle"></b-spinner>
          <strong class="ml-1">Cargando</strong>
        </div>
      </template>

      <template #empty>
        <div
          class="text-center my-5 pt-3 d-flex w-100 justify-content-center align-items-center"
        >
          <feather-icon icon="AlertCircleIcon" size="1.5x" />
          <strong class="ml-1">No hay registros para mostrar</strong>
        </div>
      </template>
    </b-table>
    <b-row v-show="items.length > 0 && !loading"
      ><b-col md="2" sm="12" class="d-none d-sm-block">
        <b-form-group class="mb-0">
          <label class="d-inline-block mr-50">Por página</label>
          <b-form-select
            id="perPageSelect"
            :value="perPage"
            size="sm"
            :options="pageOptions"
            @change="perPageChange"
            style="width: auto"
          />
        </b-form-group>
      </b-col>
      <b-col v-show="totalRows > perPage" md="10" sm="12">
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

    <b-sidebar id="new-client-sidebar" v-model="completed" class="new-client-sidebar" bg-variant="white" right backdrop shadow lazy>
      <Register :isSideView="true" @onComplete="handleComplete"></Register>
    </b-sidebar>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardText,
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
import Register from '@/views/register/index.vue'
export default {
  components: {
    BCard,
    BCardText,
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
    Register
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      searchValue: '',
      fields: [
        {
          key: 'name',
          label: 'Nombre',
          sortable: true,
        },

        {
          key: 'email',
          label: 'Email',
          sortable: true,
        },
        {
          key: 'identification',
          label: 'Identificación',
          sortable: true,
        },
        {
          key: 'phone',
          label: 'Teléfono',
          sortable: true,
        },
        {
          key: 'Registrado por',
          label: 'Registrado por',
          sortable: true,
        },
        {
          key: 'year_docs',
          label: 'Docs. año',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Acciones',
          sortable: false,
        },
      ],
      completed:false
    }
  },
  computed: {
    ...mapState({
      items: state => state.companies.items,
      perPage: state => state.companies.perPage,
      currentPage: state => state.companies.currentPage,
      totalRows: state => state.companies.totalRows,
      pageOptions: state => state.companies.pageOptions,
      searchTerm: state => state.companies.searchTerm,
      loading: state => state.companies.loading,
    }),
  },
  methods: {
    getItems(page = 1) {
      this.$store.dispatch('companies/get', {
        currentPage: page,
      })
    },
    changePage(page) {
      console.log(page)
      this.getItems(page)
    },
    perPageChange(perPage) {
      this.$store.dispatch('companies/perPageChange', perPage)
      this.getItems()
    },
    search(value) {
      console.log(value)
    },
    handleComplete(){
      this.completed = false;
      this.getItems();
    },
    actionList(command){
      console.log(command);
      switch(command.action){
        case'edit-company':{
          this.$router.push({ path: `company-configurations/${command.data.id}` })
        }
        break;
      }
    }
  },
  mounted() {
    this.getItems()
  },
  watch: {
    searchValue(value) {
      this.$store.dispatch('companies/searchTermChange', value)
      this.getItems()
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-companies.scss';
</style>

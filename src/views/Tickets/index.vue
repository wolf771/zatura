<template>
  <div>
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
            v-b-tooltip.hover.bottom="'Nuevo Tiquete'"
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
        <template #cell(reference)="data">
          <b-button
            variant="link"
            class="p-0"
            @click="showDocumentDetail(data.item)"
          >
            {{ data.item.reference }}
          </b-button>
        </template>

        <template #cell(client)="data">
          <span class="text-capitalize">{{ data.item.client.name }}</span>
        </template>

        <template #cell(created_at)="data">
          {{ dateFormat(data.item.created_at) }}
        </template>

        <template #cell(comment)>
          {{ 'No pagado' }}
        </template>

        <template #cell(total)="data">
          {{ numberFormat(data.item.total) }} {{ data.item.currency.symbol }}
        </template>

        <template #cell(payment_amount)>
          -
        <!-- Todo -->
        <!-- {{ numberFormat(data.item.payment_amount) }} -->
        </template>

        <template #cell(hacienda)="data">
          <status-hacienda :status="data.item.hacienda" />
        </template>

        <template #cell(actions)="data">
          <b-dropdown
            size="lg"
            variant="link"
            toggle-class="text-decoration-none"
            no-caret
            right
          >
            <template #button-content>
              <feather-icon icon="SettingsIcon" />
            </template>
            <b-dropdown-item @click.stop.prevent="handleAction({type:'pay',data:data.item})"><feather-icon
              icon="DollarSignIcon"
              class="text-primary"
              size="1.2x"
            /> Pagar</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="InfoIcon"
              class="text-primary"
              size="1.2x"
            /> Recordatorio de pago</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="MinusCircleIcon"
              class="text-primary"
              size="1.2x"
            /> Nota de credito</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="PlusCircleIcon"
              class="text-primary"
              size="1.2x"
            /> Nota de debito</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="CopyIcon"
              class="text-primary"
              size="1.2x"
            /> Clonar</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="RepeatIcon"
              class="text-primary"
              size="1.2x"
            /> Hacer recurrente</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="MailIcon"
              class="text-primary"
              size="1.2x"
            /> Enviar por correo</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="DownloadCloudIcon"
              class="text-primary"
              size="1.2x"
            /> Descargar PDF</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="DownloadCloudIcon"
              class="text-primary"
              size="1.2x"
            /> Descargar XML enviado</b-dropdown-item>
            <b-dropdown-item><feather-icon
              icon="DownloadCloudIcon"
              class="text-primary"
              size="1.2x"
            /> Descargar XML respuesta</b-dropdown-item>
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
    </b-card>
    <b-sidebar
      id="action-sidebar"
      :visible="actionSidebarVisible"
      class="action-sidebar"
      bg-variant="white"
      right
      backdrop
      shadow
      :lazy="true"
    >
      <component
        :is="resolveSidebarComponent(action)"
        :document="document"
      />
    </b-sidebar>
  </div>

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
  VBToggle,
  BSpinner,
  BSidebar,
} from 'bootstrap-vue'
import { mapState } from 'vuex'

// eslint-disable-next-line import/no-extraneous-dependencies
import { confirmAlert, resolveSidebarComponent } from '@/helpers/utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import numberMixins from '@/mixins/numberMixins'
// eslint-disable-next-line import/no-extraneous-dependencies
import StatusHacienda from '@/components/StatusHacienda/Index.vue'
import PaySidebar from './components/PaySidebar.vue'

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
    BSpinner,
    StatusHacienda,
    BSidebar,
    PaySidebar,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  mixins: [numberMixins],
  data() {
    return {
      open: false,
      searchValue: '',
      item: null,
      document: '',
      actionSidebarVisible: false,
      action: '',
      fields: [
        {
          key: 'reference',
          label: 'NÚMERO',
          sortable: true,
        },
        {
          key: 'client',
          label: 'Cliente',
          sortable: true,
        },
        {
          key: 'total',
          label: 'Total',
          sortable: true,
        },
        {
          key: 'payment_amount',
          label: 'Monto pagado',
          sortable: true,
        },
        {
          key: 'comment', // Estado
          label: 'Estado',
          sortable: true,
        },
        {
          key: 'hacienda',
          label: 'Hacienda',
          sortable: true,
        },
        {
          key: 'created_at',
          label: 'Fecha',
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
      items: state => state.tickets.items,
      perPage: state => state.tickets.perPage,
      currentPage: state => state.tickets.currentPage,
      totalRows: state => state.tickets.totalRows,
      pageOptions: state => state.tickets.pageOptions,
      searchTerm: state => state.tickets.searchTerm,
      loading: state => state.tickets.loading,
    }),
  },
  watch: {
    searchValue(value) {
      this.$store.dispatch('tickets/searchTermChange', value)
      this.getItems()
    },
  },
  mounted() {
    this.getItems()
  },
  setup() {
    return {
      resolveSidebarComponent,
    }
  },
  methods: {
    showDocumentDetail(document) {
      this.$router.push({
        name: 'document-detail',
        params: { id: document.id, type: 'ticket' },
      })
    },
    create() {
      this.$router.push({
        name: 'document',
        params: { type: 'ticket', action: 'new' },
      })
    },
    edit(item) {
      this.item = item
      this.openSidebar()
    },
    async deleteItem(item) {
      const res = await confirmAlert('¿Está seguro de eliminar este registro?')
      console.log(res)
      if (res.value) {
        const r = await this.$store.dispatch('tickets/delete', {
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
      this.$store.dispatch('tickets/get', {
        currentPage: page,
      })
    },
    changePage(page) {
      console.log(page)
      this.getItems(page)
    },
    perPageChange(perPage) {
      this.$store.dispatch('tickets/perPageChange', perPage)
      this.getItems()
    },
    search(value) {
      console.log(value)
    },
    handleAction({ type, data }) {
      this.action = type
      this.actionSidebarVisible = true
      this.document = data
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-invoices.scss';
</style>

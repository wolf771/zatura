<template>
  <div>
    <b-table
      hover
      responsive="sm"
      :items="client.invoices"
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
        {{ numberFormat(data.item.total) }}
      </template>

      <template #cell(payment_amount)>
        -
        <!-- Todo -->
        <!-- {{ numberFormat(data.item.payment_amount) }} -->
      </template>

      <template #cell(hacienda)="data">
        <status-hacienda :status="data.item.hacienda" />
      </template>

      <template #cell(actions)>
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
          <b-dropdown-item v-b-toggle.pay-sidebar><feather-icon
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
    <b-sidebar
      id="pay-sidebar"
      v-model="completed"
      class="pay-sidebar"
      bg-variant="white"
      right
      backdrop
      shadow
      lazy
    >
      Pagar
    </b-sidebar>
  </div>
</template>

<script>
import {
  BTable,
  BCol,
  BPagination,
  BRow,
  BFormGroup,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BButton,
  VBToggle,
  BSpinner,
  BSidebar,
} from 'bootstrap-vue'
import { mapState } from 'vuex'

// eslint-disable-next-line import/no-extraneous-dependencies
import { confirmAlert } from '@/helpers/utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import numberMixins from '@/mixins/numberMixins'
// eslint-disable-next-line import/no-extraneous-dependencies
import StatusHacienda from '@/components/StatusHacienda/Index.vue'

export default {
  components: {
    BTable,
    BCol,
    BPagination,
    BRow,
    BFormGroup,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BButton,
    BSpinner,
    StatusHacienda,
    BSidebar,
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
      completed: false,
      fields: [
        {
          key: 'reference',
          label: 'NÚMERO',
          sortable: true,
        },
        {
          key: 'client.name',
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
      client: state => state.clients.client,
      items: state => state.invoices.items,
      perPage: state => state.invoices.perPage,
      currentPage: state => state.invoices.currentPage,
      totalRows: state => state.invoices.totalRows,
      pageOptions: state => state.invoices.pageOptions,
      searchTerm: state => state.invoices.searchTerm,
      loading: state => state.invoices.loading,
    }),
  },
  watch: {
    searchValue(value) {
      this.$store.dispatch('invoices/searchTermChange', value)
      this.getItems()
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    showDocumentDetail(document) {
      this.$router.push({
        name: 'document-detail',
        params: { id: document.id, type: 'invoice' },
      })
    },
    create() {
      this.$router.push({
        name: 'document',
        params: { type: 'invoice', action: 'new' },
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
        const r = await this.$store.dispatch('invoices/delete', {
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
      this.$store.dispatch('invoices/get', {
        currentPage: page,
      })
      this.$store.dispatch('clients/getDetail', {
        id: this.$route.params.id,
      })
    },
    changePage(page) {
      console.log(page)
      this.getItems(page)
    },
    perPageChange(perPage) {
      this.$store.dispatch('invoices/perPageChange', perPage)
      this.getItems()
    },
    search(value) {
      console.log(value)
    },

  },
}
</script>

<style></style>

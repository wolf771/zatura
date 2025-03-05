<template>
  <div class="row">
  <div class="col-md-12">
    <div class="card vx-card">
      <div class="card-body" v-loading="loading">
        <div class="d-flex justify-content-between">
          <div>
            <registers-per-page @changeNumPerPage="changeNumPerPage"></registers-per-page>
            <!-- <h4 class="font-weight-bold">Lista de pagos</h4> -->
            <search-filter @executeSearch="search" :options="[]"></search-filter>
          </div>
        </div>

        <div id="data-list-list-view" class="data-list-container mt-5" v-if="items.length">
          <vs-table ref="table" :max-items="perPage" :data="items">
            <template slot="thead">
              <vs-th>Número</vs-th>
              <vs-th>Factura</vs-th>
              <vs-th>Cliente</vs-th>
              <vs-th>Metodo de pago</vs-th>
              <vs-th sort-key="amount">Monto</vs-th>
              <vs-th sort_key="reference">Referencia</vs-th>
              <vs-th sort-key="created_at">Fecha</vs-th>
              <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
              <tbody>
                <vs-tr :data="item" :key="item.id" v-for="(item, index) in data">
                  <vs-td>
                    {{ index + 1 }}
                  </vs-td>
                  <vs-td>
                    <router-link class="link" :to="{name: 'detail-transaction', params: {type: 'invoice', id: item.paymentable.id}}">
                      {{ item.paymentable.reference }}
                    </router-link>
                  </vs-td>
                  <vs-td>
                    <router-link class="link" :to="{name: 'client-detail', params: {id: item.paymentable.client.id}}">
                      {{ item.paymentable.client.name | truncateText(0, 25) }}
                    </router-link>
                  </vs-td>
                  <vs-td>
                      {{ item.payment_method.name }}
                  </vs-td>
                  <vs-td>
                    <calc-price :price="item.amount" :currency="item.currency_id" :exchange_rate="item.exchange_rate"></calc-price> 
                  </vs-td>
                  <vs-td>{{ item.reference }}</vs-td>
                  <vs-td>{{ item.created_at | moment('DD-MM-YYYY')}}</vs-td>
                  
                  <vs-td>
                    <el-dropdown @command="listAction">
                      
                      <i class="fa fa-cogs text-primary"></i>
                      
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{command: 'delete', payload: {id: item.id}}" class="text-danger">
                          <i class="fa fa-minus-circle"></i>
                          Eliminar
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </vs-td>
                </vs-tr>
              </tbody>
            </template>
          </vs-table>
          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>
        </div>

        <div class="col-md-12 text-center" v-if="!loading && items.length == 0">
          <p>No se han registrado pagos</p>
        </div>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loading  from "@/components/Loading.vue";
import CalcPrice  from "@/components/CalcPrice.vue";
import paymentsService from '@/services/payments.service';
import SearchFilter from '@/components/SearchFilter.vue';
import RegistersPerPage from '@/components/RegistersPerPage';
import { mapState } from 'vuex'

export default {
  name: 'payments',
  data() {
    return {
      items: [],
      loading: false,
      pageCount: 0,
      searchData: {},
      perPage: 10,
      page: 1
    }
  },
  computed: {
    ...mapState([
      'datatable_current_page'
    ])
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num
      this.searchData = searchData
      this.getPayments(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage
      this.getPayments(1, this.searchData);
    },
    getPayments(page = 1, search = {}) {
      this.loading = true;
      paymentsService.getPayments(page, search)
      .then(res => {
        this.items = res.data.data;
        this.pageCount = res.data.last_page
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        alert('error')
      })
    },
    goPage(page) {
      this.$store.dispatch('updateCurrentPageDatatable', { page: page, section: 'payments' })
      this.getPayments(page, this.searchData);
    },
    listAction(command) {
      switch(command.command) {
        case 'delete':
        
        this.$confirm('¿ Deseas eliminar el pago ?', 'Eliminar Pago', {
          confirmButtonText: 'Si, continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading = true;
          let item = this.items.find(i => i.id === command.payload.id);
          paymentsService.deletePayment(item.id)
          .then(() => {
            this.loading = false;
            let index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$message({
              type: 'success',
              message: 'Pago eliminado'
            });
          })
          .catch(() => {
            this.loading = false;
            this.$message({
              type: 'error',
              message: 'Ocurrio un problema'
            });
          });
        }).catch(() => {
          this.loading = false;
          this.$message({
            type: 'info',
            message: 'Acción cancelada'
          });
        });
          break;               
      }
    }
  },
  components: {
    Loading,
    CalcPrice,
    SearchFilter,
    RegistersPerPage
  },
  watch: {
    page(newVal) {
      this.goPage(newVal)
    }
  },
  created() {
    this.getPayments(this.datatable_current_page.payments);
  }
}
</script>

<style>

</style>

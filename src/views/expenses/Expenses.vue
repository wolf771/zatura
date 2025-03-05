<template>
  <div class="row">
  <div class="col-md-12">
    <div class="card vx-card">
      <div class="card-body" v-loading="loading">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <registers-per-page @changeNumPerPage="changeNumPerPage"></registers-per-page>
            <!-- <h4 class="font-weight-bold">Lista de gastos</h4> -->
            <search-filter @executeSearch="search" :options="[]"></search-filter>
          </div>
          <vs-button type="gradient" @click="newExpense()">
            <i class="fa fa-plus"></i>
            Nuevo gasto
          </vs-button>
        </div>

        <div id="data-list-list-view" class="data-list-container mt-5" v-if="items.length">
          <vs-table ref="table" :max-items="perPage" :data="items">
            <template slot="thead">
              <vs-th sort-key="id">#</vs-th>
              <vs-th sort-key="description">Descripcion</vs-th>
              <vs-th sort-key="amount">Monto</vs-th>
              <vs-th sort-key="date">Fecha</vs-th>
              <vs-th sort-key="reference">Referencia</vs-th>
              <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
              <tbody>
                <vs-tr :data="item" :key="item.id" v-for="(item, index) in data">
                  <vs-td>
                    {{ index + 1 }}
                  </vs-td>
                  <vs-td>
                    {{ item.description }}
                  </vs-td>
                  <vs-td>
                    <calc-price :price="item.amount" :currency="item.currency_id" :exchange_rate="item.exchange_rate"></calc-price> 
                  </vs-td>
                  <vs-td>
                      {{ item.date }}
                  </vs-td>
                  <vs-td>
                    {{ item.reference ? item.reference : 'S/R' }}
                  </vs-td>
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
          <p>No se han registrado gastos.</p>
        </div>

      </div>
    </div>
  </div>
  
  <expense-modal @expenseExecuted="updateList" @closeModal="closeModal()" :vis="expense_modal_visible"></expense-modal>
</div>
</template>

<script>
import CalcPrice  from "@/components/CalcPrice.vue";
import expensesService from '@/services/expenses.service';
import ExpenseModal from '@/components/ExpenseModal.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import RegistersPerPage from '@/components/RegistersPerPage';


export default {
  name: 'expenses',
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 0,
      expense_modal_visible: false,
      searchData: {},
      perPage: 10,
      page: 1
    }
  },
  methods: {
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num
      this.searchData = searchData
      this.getExpenses(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage
      this.getExpenses(1, this.searchData);
    },
    getExpenses(page = 1, search = {}) {
      this.loading = true
      expensesService.getExpenses(page, search)
      .then(res => {
        this.items = res.data.data;
        this.loading = false;
        this.pageCount = res.data.last_page;
        this.page = res.data.current_page
      })
      .catch(() => {
        this.loading = true;
        alert('error')
      })
    },
    goPage(page) {
      this.getExpenses(page, this.searchData);
    },
    closeModal() {
      this.expense_modal_visible = false;
    },
    newExpense() {
      this.expense_modal_visible = true;
    },
    updateList(item) {
      this.items.push(item);
      this.expense_modal_visible = false;
    },
    listAction(command) {
      switch(command.command) {
        case 'delete':
        this.$confirm('¿ Deseas eliminar el gasto ?', 'Eliminar Gasto', {
          confirmButtonText: 'Si, continuar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading = true;
          let item = this.items.find(i => i.id === command.payload.id);
          expensesService.deleteExpense(item.id)
          .then(() => {
            this.loading = false;
            let index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$message({
              type: 'success',
              message: 'Gasto eliminado'
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
    CalcPrice,
    ExpenseModal,
    SearchFilter,
    RegistersPerPage
  },
  watch: {
    page(newVal) {
      this.goPage(newVal)
    }
  },
  created() {
    this.getExpenses();
  }
}
</script>

<style>

</style>

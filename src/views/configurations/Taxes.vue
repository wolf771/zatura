<template>
<div class="row">
  <div class="col-md-12">
    <div class="card vx-card">
      <div class="card-body" v-loading="loading">
        <div class="d-flex justify-content-between">
          <h4 class="font-weight-bold">Lista de IVA</h4>
          <button class="btn btn-info btn-rounded" @click="newTax()">
            <i class="fa fa-user-plus"></i>
            Nuevo IVA
          </button>
        </div>
        <hr />
        <div class="d-flex"  v-if="items.length">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Porcentaje</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.rate }} %</td>
                  <td>
                    <el-dropdown @command="itemAction">
                      <el-button type="primary">
                        Acciones
                      <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{action: 'edit', id: item.id}" class="text-success">
                          <i class="fa fa-edit"></i>
                          Editar
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-md-12 text-center" v-if="!loading && items.length == 0">
          <p>No hay IVA.</p>
        </div>

        <div class="col-md-12 text-center"  v-if="!loading && pageCount > 10">
          <template>
            <paginate
              :pageCount="pageCount"
              :pageRange="3"
              :marginPages="2"
              :clickHandler="goPage"
              :prevText="'«'"
              :nextText="'»'"
              :containerClass="'pagination justify-content-center'"
              :pageClass="'page-item'">
            </paginate>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- modal new tax -->
  <new-tax-modal :vis="showModal" @storeTax="storeTax" @closeModal="closeModal"></new-tax-modal>
</div>
</template>

<script>
import configurationsService from '@/services/configurations.service'
import NewTaxModal from '@/components/NewTaxModal.vue'

export default {
  components: { NewTaxModal },
  name: 'taxes',
  data() {
    return {
      items: [],
      loading: true,
      pageCount : 1,
      showModal: false
    }
  },
  methods: {
    getTaxes(page = 1) {
      configurationsService.getTaxes(page).then(res => {
        this.items = res.data
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        if(error.response.status == 401) {
          // localStorage.clear();
          // this.$router.push('login');
        }
      })
    },
    newTax() {
      this.showModal = !this.showModal;
    },
    storeTax(item) {
      this.items.push(item);
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    itemAction(command) {
      if(command.action === 'edit') {
        //this.$router.push({name: 'edit-item', params: {id: command.id} });
        alert('editar')
      }
    },
    goPage(numPage) {
      this.getTaxes(numPage);
    }
  },
  created() {
    this.getTaxes();
  }
}
</script>


<template>
  <div class="row">
  <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-success card-header-icon">
              <div class="card-icon">
                <i class="material-icons">add_shopping_cart</i>
              </div>
              <h4 class="card-title">
                <strong>
                  Información factura
                  <span class="text-primary">#{{ $store.state.consecutives.fe }}</span>
                  </strong>
                <span class="float-right">
                  <i class="fa fa-calendar text-primary"></i>
                  {{ new  Date() | moment('DD/MM/YYYY hh:mm a') }}
                </span>
              </h4>
            </div>
            <hr />

            <div class="card-body">

              <!-- add items -->
                <add-items-document 
                  :items="items"
                  :type="'invoice'">
                </add-items-document>
              <!-- end add items -->
              
            </div>
          </div>

        </div>
      </div>
  </div>
</div>
</template>

<script>
import  itemsService from "../../services/items.service";
import AddItemsDocument from '@/components/AddItemsDocument.vue';
import { mapState } from 'vuex';


export default {
  name: 'new-invoice',
  components: {
    AddItemsDocument
  },
  data () {
    return {
      items: [],
    }
  },
  computed: {
    ...mapState(['tax_types', 'selected_items'])
  },
  methods: {
    getTaxTypes() {
      this.$store.dispatch('getTaxTypes', {});
    },
    getItems(page = 1) {
      itemsService.getItems(page).then(res => {
        this.items = res.data.data;
      }).catch(error => {
        if(error.response.status == 401) {
          // localStorage.clear();
          // this.$router.push('login');
        }
      })
    }
  },
  created() {
    this.getItems();
    this.getTaxTypes();
  }
}
</script>

<style scoped>
  .form-group label {
    font-weight: bold;
  }
</style>

<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card vx-card">
            <div class="card-header bg-white">
              <h4 class="card-title">
                <strong>
                  Información factura {{ preselect_client }}
                  <span class="text-primary"
                    >#{{ $store.state.consecutives.fe }}</span
                  >
                </strong>

                <span
                  class="font-weight-normal ml-10"
                  v-if="$store.state.company_default.permission == 4"
                  >Este año has emitido:
                  {{ $store.state.company_default.year_num_documents }}</span
                >
                <span class="float-right">
                  <i class="fa fa-calendar text-primary"></i>
                  {{ new Date() | moment("DD/MM/YYYY hh:mm a") }}
                </span>
              </h4>
            </div>

            <div class="card-body">
              <!-- add items -->
              <add-items-document
                :items="items"
                :type="'invoice'"
                :preselect_client="preselect_client"
              >
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
import itemsService from "../../services/items.service";
import AddItemsDocument from "@/components/AddItemsDocument.vue";
import { mapState } from "vuex";

export default {
  name: "new-invoice",
  components: {
    AddItemsDocument
  },
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapState(["tax_types", "selected_items"]),
    preselect_client() {
      return this.$route.query.id;
    }
  },
  methods: {
    getTaxTypes() {
      this.$store.dispatch("getTaxTypes", {});
    },
    getItems(page = 0) {
      itemsService
        .getItems(page)
        .then(res => {
          this.items = res.data;
        })
        .catch(error => {
          if (error.response.status == 401) {
            // localStorage.clear();
            // this.$router.push('login');
          }
        });
    }
  },
  created() {
    this.getItems();
    this.getTaxTypes();
  }
};
</script>

<style scoped>
.form-group label {
  font-weight: bold;
}
</style>

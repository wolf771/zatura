<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card vx-card">
            <div class="card-header bg-white">
              <h4 class="card-title">
                <strong>
                  Información tiquete
                  <span class="text-primary"
                    >#{{ $store.state.consecutives.te }}</span
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
                :type="'ticket'"
                :preselect_client="preselect_client"
                @imprimio="imprimio"
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
  name: "new-quotation",
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
    getRandom(length) {
      return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
      );
    },
    imprimio(countUidItem) {
      let selected_items = [
        {
          uid: parseInt(this.getRandom(9)),
          id: 0,
          name: "",
          price: 0,
          calculate_price: 0,
          quantity: 1,
          discount: 0,
          tax_type: {
            id: 1,
            rate: 0
          },
          currency: {
            id: 2,
            symbol: "₡"
          }
        }
      ];
      this.$store.commit("updateSelectedItems", {
        selected_items: selected_items
      });
    },
    getTaxTypes() {
      this.$store.dispatch("getTaxTypes", {});
    },
    getItems(page = 0) {
      itemsService
        .getItems()
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

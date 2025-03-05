<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card vx-card">
        <div class="card-body" v-loading="loading">
          <div class="d-flex justify-content-between">
            <div>
              <registers-per-page
                @changeNumPerPage="changeNumPerPage"
              ></registers-per-page>

              <!-- <h4 class="font-weight-bold">Lista de notas</h4> -->
              <search-filter
                @executeSearch="search"
                :options="optionsFilter"
              ></search-filter>
            </div>
          </div>

          <div
            id="data-list-list-view"
            class="data-list-container mt-5"
            v-if="items.length"
          >
            <vs-table ref="table" :max-items="perPage" :data="items">
              <template slot="thead">
                <vs-th>Número</vs-th>
                <vs-th>Tipo</vs-th>
                <vs-th>Pertenece a</vs-th>
                <vs-th>Cliente</vs-th>
                <vs-th>Total</vs-th>
                <!-- <vs-th>Pagado</vs-th> -->
                <vs-th>Fecha</vs-th>
                <vs-th>Hacienda</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="item"
                    :key="indextr"
                    v-for="(item, indextr) in data"
                  >
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: { type: 'note', id: item.id }
                        }"
                      >
                        {{ item.reference }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      {{ item.type.toUpperCase() }}
                    </vs-td>
                    <vs-td>
                      <router-link
                        class="link"
                        :to="{
                          name: 'detail-transaction',
                          params: {
                            type:
                              item.documentable_type === 'App\\Invoice'
                                ? 'invoice'
                                : 'ticket',
                            id: item.documentable.id
                          }
                        }"
                      >
                        {{ on_document(item.documentable_type)
                        }}{{ item.documentable.reference }}
                      </router-link>
                    </vs-td>
                    <vs-td>
                      <router-link
                        v-if="!item.client.deleted_at"
                        class="link"
                        :to="{
                          name: 'client-detail',
                          params: { id: item.client.id }
                        }"
                      >
                        {{ item.client.name }}
                      </router-link>
                      <span v-else>
                        {{ item.client.name }}
                      </span>
                    </vs-td>
                    <vs-td>
                      <calc-price
                        :price="item.total"
                        :currency="item.currency_id"
                        :exchange_rate="item.exchange_rate"
                      ></calc-price>
                    </vs-td>
                    <!-- <vs-td>{{ 0 | currency }}</vs-td> -->
                    <vs-td>{{ item.created_at | moment("DD/MM/YYYY") }}</vs-td>
                    <vs-td>
                      <status-hacienda
                        :status="item.hacienda"
                      ></status-hacienda>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
          </div>

          <div class="mt-4 text-center zatura-pagination" v-if="pageCount > 1">
            <vs-pagination :total="pageCount" v-model="page"></vs-pagination>
          </div>

          <div class="col-md-12 text-center" v-if="items.length == 0">
            <p>No hay Notas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import notesService from "@/services/notes.service";
import StatusHacienda from "@/components/StatusHacienda.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import RegistersPerPage from "@/components/RegistersPerPage";
import { mapState } from "vuex";

export default {
  name: "notes",
  data() {
    return {
      items: [],
      loading: true,
      pageCount: 0,
      optionsFilter: [
        { label: "Notas Credito", value: "credito" },
        { label: "Notas Debito", value: "debito" },
        { label: "Aceptado", value: "aceptado" },
        { label: "Rechazado", value: "rechazado" }
      ],
      searchData: {},
      perPage: 10,
      page: 1
    };
  },
  computed: {
    ...mapState(["datatable_current_page"])
  },
  methods: {
    on_document(type) {
      let on_document = "FEC-";
      if (type === "App\\Invoice") {
        on_document = "FE-";
      } else if (type === "App\\Ticket") {
        on_document = "TE-";
      }
      return on_document;
    },
    changeNumPerPage(num) {
      let searchData = this.searchData;
      searchData.perPage = num;
      this.searchData = searchData;
      this.getNotes(1, this.searchData);
    },
    search(search) {
      this.searchData = search;
      this.searchData.perPage = this.perPage;
      this.getNotes(1, this.searchData);
    },
    getNotes(page = 1, search = {}) {
      notesService
        .getNotes(page, search)
        .then(res => {
          this.items = res.data.data;
          this.pageCount = res.data.last_page;
          this.loading = false;
        })
        .catch(() => {
          alert("error");
        });
    },
    goPage(page) {
      this.$store.dispatch("updateCurrentPageDatatable", {
        page: page,
        section: "notes"
      });
      this.getNotes(page, this.searchData);
    }
  },
  components: {
    CalcPrice,
    StatusHacienda,
    SearchFilter,
    RegistersPerPage
  },
  watch: {
    page(newVal) {
      this.goPage(newVal);
    }
  },
  created() {
    this.getNotes(this.datatable_current_page.notes);
  }
};
</script>

<style></style>

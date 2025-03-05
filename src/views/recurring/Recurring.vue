<template>
  <div class="row">
  <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card vx-card">
            <div class="card-header bg-white">
              <h4 class="card-title">
                  <strong>
                    Información {{ document_type_letter }}
                    <span class="text-primary">#{{ consecutive }}</span>
                  </strong>
                <span class="float-right">
                  <i class="fa fa-calendar text-primary"></i>
                  {{ new  Date() | moment('DD/MM/YYYY hh:mm a') }}
                </span>
              </h4>
              <div>
                <p style="color: black;font-size:15px">Haciendo recurrente Factura: #{{document.reference}}</p>
              </div>
            </div>

            <div class="card-body">

              <!-- add items -->
                <add-items-document 
                  :items="items"
                  :type="document_type"
                  :document="document"
                  :is_recurring="true">
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
import utilitiesService from '@/services/utilities.service';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'new-note',
  components: {
    AddItemsDocument
  },
  data () {
    return {
      items: [],
      document: {},
      is_recurring: true
    }
  },
  computed: {
    ...mapState(['tax_types', 'selected_items']),  
    document_id() {
      return this.$route.params.document_id;
    },
    document_type() {
      return this.$route.params.document_type;
    },
    document_type_letter() {
      let value = "";
      if(this.document_type === 'invoice' && !this.is_recurring) {
        value = 'Factura';
      } else if(this.document_type === 'ticket') {
        value = 'Tiquete';
      } else if(this.document_type === 'quotation') {
        value = 'Cotización';
      } else if(this.document_type === 'simple') {
        value = 'Simplificado';
      } else if(this.document_type === 'invoice' && this.is_recurring) {
        value = 'Factura recurrente';
      }
      return value;
    },
    consecutive() {
      let value = "";
      if(this.document_type === 'invoice' && !this.is_recurring) {
        value = this.$store.state.consecutives.fe;
      } else if(this.document_type === 'ticket') {
        value = this.$store.state.consecutives.te;
      } else if(this.document_type === 'quotation') {
        value = this.$store.state.consecutives.qt
      } else if(this.document_type === 'simple') {
        value = this.$store.state.consecutives.fec
      } else if(this.document_type === 'invoice' && this.is_recurring) {
        value = this.$store.state.consecutives.fr
      }
      return value;
    }
  },
  methods: {
    ...mapActions(['getTaxTypes']),

    getItems(page = 1) {
      itemsService.getItems(page).then(res => {
        this.items = res.data.data;
      }).catch(error => {
        if(error.response.status == 401) {
         
        }
      })
    },
    getDocument() {
      utilitiesService.getDetailTransaction(this.$route.params.document_type, this.document_id)
      .then(res => {
        let document = res.data.data;
        document.document_type = this.document_type;
        document.document_id = this.document_id;
        this.document = document;
      })
      .catch(() => {
        alert('error')
      })
    }  
  },
  created() {
    this.getItems();
    this.getTaxTypes();
    this.getDocument();
  }
}
</script>

<style scoped>
  .form-group label {
    font-weight: bold;
  }
</style>

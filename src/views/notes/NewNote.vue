<template>
  <div class="row">
  <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card vx-card">
            <div class="card-header bg-white">
              
              <h4 class="card-title">
                  <strong>
                    Información nota de {{ note_type_letter }}
                    <span class="text-primary">#{{ consecutive }}</span>
                  </strong>
                <span class="float-right">
                  <i class="fa fa-calendar text-primary"></i>
                  {{ new  Date() | moment('DD/MM/YYYY hh:mm a') }}
                </span>
              </h4>
              <div>
                <p style="color: black;font-size:15px">{{ document_type_letter }}: #{{document.key50digits}}</p>
              </div>
            </div>

            <div class="card-body">

              <!-- add items -->
                <add-items-document 
                  :items="items"
                  :type="note_type"
                  :document="document"
                  :is_simple="is_simple">
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
      document: {}
    }
  },
  computed: {
    ...mapState(['tax_types', 'selected_items']),
    note_type() {
      return this.$route.params.note_type;
    },
    note_type_letter() {
      return this.$route.params.note_type == 'nc' ? 'crédito' : 'débito';
    },
    document_id() {
      return this.$route.params.document_id;
    },
    document_type() {
      return this.$route.params.document_type;
    },
    is_simple() {
      let value = false;
      if(this.document_type === 'simple') {
        value = true;
      }
      return value;
    },
    document_type_letter() {
      let value = "";
      if(this.document_type === 'invoice') {
        value = 'Factura';
      } else if(this.document_type === 'ticket') {
        value = 'Tiquete';
      } else if(this.document_type === 'simple') {
        value = 'Simplificado';
      }
      return value;
    },
    consecutive() {
      let value = "";
      if(this.note_type === 'nc') {
        value = this.$store.state.consecutives.nc;
      } else if(this.note_type === 'nd') {
        value = this.$store.state.consecutives.nd;
      }
      return value;
    }
  },
  methods: {
    ...mapActions(['getTaxTypes']),

    getItems(page = 0) {
      itemsService.getItems(page).then(res => {
        this.items = res.data;
      }).catch(error => {
        if(error.response.status == 401) {
          // localStorage.clear();
          // this.$router.push('login');
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

<template>
  <div class="container">
   <div class="paper" ref="documento" v-loading="loading">

        <el-tooltip placement="top">
          <!-- <div slot="content" class="text-center">Este documento fue generado<br>con tipo de moneda {{ transaction.currency_id === 2 ? 'Colones (CRC).' : 'Dolares (USD).'}}<br>
            {{ $store.state.current_currency.id === transaction.currency_id ? '' : `La moneda actual del sitema esta en ${$store.state.current_currency.name}` }} 
          </div> -->
          <span class="badge badge-info original-currency-document" style="position:absolute;right: 5px;top:5px;padding:3px;color:white;font-size:12px;">
            {{ transaction.currency_id === 2 ? 'CRC' : 'USD'}}
          </span>
        </el-tooltip>
        <!-- ribbon status hacienda -->
        <div class="box" v-if="transaction.hacienda && (document_type !== 'quotation')">
          <ribbon-document :status="transaction.hacienda"></ribbon-document>
        </div>

        <div class="header">
          <div class="left">
            <div class="data-company">
              <figure class="mp-0 mb-4" v-if="!no_exist_logo">
                <img class="logo" :src="url_logo+transaction.company.logo" alt="logo" />
              </figure>
              <ul class="">
                <li><b>{{ transaction.company.name}}</b></li>
                <li>Cédula Jurídica: {{ transaction.company.identification}}</li>
                <li>Teléfono: {{ transaction.company.phone}}</li>
                <li>Email: {{ transaction.company.email}}</li>
                <li>Costa Rica</li>
              </ul>
            </div>
            
            <div>
              <p class="mp-0">Facturar a: {{ transaction.client.name }}</p>
              <p class="mp-0">Cédula: {{ transaction.client.identification }}</p>
            </div>
          </div>

          <div class="right">
            <div class="identification">
              <p style="font-size:42px">{{ document_type_letras.singular }}</p>
              <p style="margin:0">
              <b style="letter-spacing:1px">
                # {{ transaction.reference }}</b>
              </p>
              <!-- code QR -->
              <div class="flex justify-end pt-4">
                <qr-code size="80" :text="url_qr"></qr-code> 
              </div>
              <!-- end code qr -->
            </div>

            <div>
              <p class="mp-0">Fecha {{ document_type.singular }}: {{ transaction.created_at | moment('DD/MM/YYYY hh:mm A')}}</p>
              <p class="mp-0">Metodo de pago: {{ transaction.payment_method.name }}</p>
              <p class="mp-0">Medio de pago: {{ transaction.payment_form.name }}</p>
              <p class="mp-0">Fecha vencimiento: {{ transaction.expiration_date | moment('DD/MM/YYYY') }}</p>
              <p v-if="transaction.currency_id !== 2" class="mp-0">Tasa de cambio: ¢ {{ transaction.exchange_rate }}</p>

            </div>
         </div>
        </div> <!-- end header -->

        <div class="mt-10"></div>

        <div class="p-1" v-if="document_type === 'note'">
          <span><b>Nota sobre {{ transaction.documentable_type === 'App\\Invoice' ? 'Factura' : 'Tiquete'}}:</b> {{ transaction.documentable ? transaction.documentable.key50digits : '' }}</span>
        </div>

        <div class="p-1" v-if="document_type !== 'quotation'">
          <span><b>Clave:</b> {{ transaction.key50digits }}</span>
        </div>

        <div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <!-- <th>Unid.</th> -->
                <th>Cant.</th>
                <th>Tarifa</th>
                <th>DTO.(%)</th>
                <th>IVA(%)</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in transaction.transaction_details" :key="item.id">
                <td style="width:60%">
                  {{ item.name }} {{ item.description }}
                </td>
                <!-- <td>
                  {{ item.unit.description }}
                </td> -->
                <td>
                  {{ item.quantity }}
                </td>
                <td>
                  <calc-price :price="item.price"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
                <td>
                  {{ item.discount }}%
                </td>
                 <td>
                  {{ item.tax }}%
                </td>
                <td>
                  <calc-price :price="item.price * item.quantity"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
              </tr>
              <tr>
                <td colspan="6"></td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td>Subtotal:</td>
                <td>
                  <calc-price :price="transaction.subtotal"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
              </tr>

              <tr>
                <td colspan="4"></td>
                <td>Descuento:</td>
                <td>
                  <calc-price :price="transaction.discount"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
              </tr>

              <tr>
                <td colspan="4"></td>
                <td>IVA:</td>
                <td>
                  <calc-price :price="transaction.tax"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
              </tr>


              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td> <span>Total:</span></td>
                <td>
                  <calc-price :price="transaction.total"
                    :currency="transaction.currency_id"
                    :exchange_rate="transaction.exchange_rate">
                  </calc-price>
                </td>
              </tr>

              <tr v-if="transaction.currency_id !== 2">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td> <span>Total Colones:</span></td>
                <td>
                  ¢{{ (transaction.total * transaction.exchange_rate) | formatPrice }}
                </td>
              </tr>

            </tbody>
          </table> <!-- end table -->

          <div class="totals row">
            
            <!-- <p>
              <span>Descuento:</span>
              <calc-price :price="transaction.discount"
                :currency="transaction.currency_id"
                :exchange_rate="transaction.exchange_rate">
              </calc-price>
            </p>
            <p>
              <span>IVA:</span>
              <calc-price :price="transaction.tax"
                :currency="transaction.currency_id"
                :exchange_rate="transaction.exchange_rate">
              </calc-price>
            </p> -->
          
           
          </div>
        </div> <!-- end body -->

        <!--comment and terms -->
        <div>
          <div v-if="transaction.comment">
            <p class="font-weight-bold mp-0">Nota:</p>
            <p>{{ transaction.comment }}</p>
          </div>
          <div v-if="transaction.term">
            <p class="font-weight-bold mp-0">Terminos y condiciones:</p>
            <p>{{ transaction.term }}</p>
          </div>
        </div>
        <!--End comment and terms -->

        <!-- autorizado hacienda -->

        <div class="resolution">
            <p>Autorizada mediante resolución No DGT-R-48-2016 del 7 de octubre de 2016.</p>
        </div>

        <!-- <div v-if="transaction.notes && transaction.notes.length">
          <h3>* Con Nota:</h3>
          <ul>
            <li class="m-1" v-for="note in transaction.notes" :key="note.id">
              Nota de {{ note.type === 'nc' ? 'crédito' : 'débito'}}: # 
              <el-button @click.prevent="viewNote('note', note.id)">
                {{note.key50digits}}
              </el-button>
            
            </li>
          </ul>
        </div>  -->
      </div>
      </div>
</template>

<script>
import CalcPrice from '@/components/CalcPrice.vue'
import utilitiesService from '@/services/utilities.service'
import RibbonDocument from '@/components/RibbonDocument.vue'
import Config from '@/config'


export default {
  name: 'query-public-document',
  components: {
    CalcPrice,
    RibbonDocument
  },
  data() {
    return {
      transaction: {
        client: {},
        payment_method: {},
        payment_form: {},
        company: {}
      },
      document_type: ""
    }
  },
  computed: {
    url_qr() {
      let str = `${this.type}AA${this.id}AA${this.transaction.company_id}`
      let code64 =  window.btoa(encodeURIComponent(str));
      return `https://titan2.zaturacr.com/query-public/${code64}`
    },
     no_exist_logo() {
      return !this.transaction.company.logo || (`companies/${this.transaction.company.id}/` == this.transaction.company.logo);
    },
    url_logo() {
      return Config.url_files;
    },
    code64() {
      return this.$route.params.code64;
    },
    document_type_letras() {
      let $type = {};
      if(this.document_type === 'quotation') {
        $type = {singular: "Cotización", plural: "Cotizaciones"};
      } else if (this.document_type === 'invoice') {
        $type = {singular: "Factura", plural: "Facturas"};
      } else if (this.document_type ==='ticket') {
        $type = {singular: "Tiquete", plural: "Tiquetes"};
      } else if (this.document_type === 'note') {
          let note_singular = 'Nota';
          if(this.document_type === 'note') {
            if(this.transaction.type === 'nc') {
              note_singular = 'Nota Credito';
            } else {
              note_singular = 'Nota Debito';
            }
          }

        $type = {singular: note_singular, plural: "Notas"};
      }
      return $type;
    }
  },
  methods: {
    getDetailTransaction() {
      this.loading = true;
      utilitiesService.getDetailTransactionPublic(this.code64)
      .then(res => {
        this.transaction = res.data.data;
        this.document_type = res.data.document_type;
        this.loading = false;
      })
      .catch(() => {
        alert('No hay información')
        this.loading = false;
      })
    },
  },
  created() {
    this.getDetailTransaction();
  }
}
</script>

<style scoped>

  .active {
   background-color: rgba(0, 25, 134, 0.171);
  }
  .container-detail-transaction {
    display: flex;
   
    justify-content: space-between;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .menu {
    display: block;
    text-align: right;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid rgb(212, 212, 212);
    position: relative;
  }

  .title-list {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    height:61px;
    border-bottom: 1px solid rgb(212, 212, 212);
    font-weight: bold;
  }

  .list-transactions {
    width: 30%;
    border-right: 1px solid rgb(228, 227, 227);
  }

  .transaction-area {
    width: 100%;
  }

  table {
    border-collapse: collapse;
  }

    .container {
     /* min-width: 600px; */
     width: 100%;
     overflow: scroll;
     position: relative;
  }

  .paper {
    min-width: 510px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    padding: 28px 15px 15px 15px;
    margin: 2px;
    position: relative;
    font-size: 12px;
    line-height: 16px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
  }

  .header .logo {
    display: block;
    max-width:230px;
    max-height:100px;
    width: auto;
    height: auto;
  }

  .header .data-company {
    padding-bottom: 80px;
  }

  .header .left, .right {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .header .left ul {
    list-style: none;
    padding: 0;
  }


  .header .right .identification {
    text-align: right;
  }


  .header .right .identification h3 {
    margin: 0;
    font-weight: bold;
  }

  table thead tr {
    background-color: #3c3d3a;
    color: white;
    font-weight: bold;
  }

  table thead th {
    font-size: 12px;
    padding: 5px;
  }

  .totals {
    margin-top: 30px;
    display: flex;
    flex-wrap:  wrap;
    justify-content: flex-end;
  }

  .totals p {
    text-align: right;
    width: 100%;
  }

  .totals p span {
    margin-right: 50px
  }

  .list-transactions ul {
    list-style: none;
    padding: 0;
    font-size: 12px;
  }

  .list-transactions .list-item {
    padding: 5px 10px;
    border-bottom: 1px solid rgb(228, 227, 227);
    cursor: pointer;
    
  }

  .list-transactions p {
    margin: 0;
  }

  .list-transactions .list-item .total {
    float: right;
  }

  .status {
    float: right;
  }

  .client {
    font-size: 14px;
    text-transform: capitalize;
  }

  .search-input {
    display: block !important;
    width: 100% !important;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .mp-0 {
    margin: 0;
    padding: 0;
  }
  .hide-desktop {
    display: none;
  }

  .resolution {
    text-align:center;
    font-weight: bold;
    margin-top:5px;
  }
 

@media screen and (max-width: 600px) {
  .container {
    padding: 2px;
  }
  

}

</style>

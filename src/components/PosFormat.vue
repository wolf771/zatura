<template>
  <div style="display:none" ref="printArea">
    <div>
      <ul>
        <li v-if="company.fantasy_name">
          <h2 class="company-name">{{ company.fantasy_name }}</h2>
        </li>
        <li>
          <h2 class="company-name" v-if="!company.fantasy_name">
            {{ company.name }}
          </h2>
          <p v-else>
            {{ company.name }}
          </p>
        </li>
        <li>{{ identification_type_letters }}: {{ company.identification }}</li>
        <li>Teléfono: {{ company.phone }}</li>
        <li>Email: {{ company.email }}</li>
        <li>Dirección: {{ company.other_signs }}</li>

        <li>Cliente: {{ transaction.client.name }}</li>
        <li>
          {{ document_type ? document_type.singular : "Documento Electronico" }}
          <b style="letter-spacing:1px"> # {{ transaction.reference }} </b>
        </li>
        <li>
          Fecha: {{ transaction.created_at | moment("DD/MM/YYYY hh:mm A") }}
        </li>
      </ul>
    </div>

    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Cant</th>
          <th>Tarifa</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transaction.transaction_details" :key="item.id">
          <td>
            {{ item.name }}
          </td>

          <td>
            {{ item.quantity }}
          </td>
          <td>
            <calc-price
              :price="item.price"
              :currency="transaction.currency_id"
              :exchange_rate="transaction.exchange_rate"
            >
            </calc-price>
          </td>
          <td>
            <calc-price
              :price="item.price * item.quantity"
              :currency="transaction.currency_id"
              :exchange_rate="transaction.exchange_rate"
            >
            </calc-price>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- end table -->

    <div class="print-totals">
      <p>
        Subtotal:
        <calc-price
          :price="transaction.subtotal"
          :currency="transaction.currency_id"
          :exchange_rate="transaction.exchange_rate"
        >
        </calc-price>
      </p>
      <p>
        Descuento:
        <calc-price
          :price="transaction.discount"
          :currency="transaction.currency_id"
          :exchange_rate="transaction.exchange_rate"
        >
        </calc-price>
      </p>
      <p>
        IVA:
        <calc-price
          :price="transaction.tax"
          :currency="transaction.currency_id"
          :exchange_rate="transaction.exchange_rate"
        >
        </calc-price>
      </p>
      <p v-if="transaction.iva_devuelto > 0">
        IVA Devuelto:
        <calc-price
          :price="transaction.iva_devuelto"
          :currency="transaction.currency_id"
          :exchange_rate="transaction.exchange_rate"
        >
        </calc-price>
      </p>
      <p>
        Total:
        <calc-price
          :price="transaction.total - transaction.iva_devuelto"
          :currency="transaction.currency_id"
          :exchange_rate="transaction.exchange_rate"
        >
        </calc-price>
      </p>
    </div>

    <div>
      <p class="key50digits"><b>Clave:</b> {{ transaction.key50digits }}</p>
    </div>

    <div v-if="transaction.comment">
      <p class="key50digits"><b>Nota:</b> {{ transaction.comment }}</p>
    </div>

    <div class="resolution">
      <p>
        Autorizada mediante resolucion DGT-R-033-2019 del 20 de junio de 2019
        version 4.3
      </p>
    </div>

    <!-- code QR -->
    <div class="code-qr">
      <qr-code :size="120" :text="url_qr"></qr-code>
    </div>
    <!-- end code qr -->

    <div class="thanks-purchase">
      <p>*** Gracias por tu compra ***</p>
    </div>
  </div>
</template>

<script>
import CalcPrice from "@/components/CalcPrice.vue";
import { Printd } from "printd";

export default {
  name: "pos-format",
  components: {
    CalcPrice
  },
  props: {
    company: {
      default: () => ({})
    },
    transaction: {
      default: () => ({})
    },
    url_qr: {
      default: ""
    },
    document_type: {
      default: null
    }
  },
  computed: {
    identification_type_letters() {
      let type = this.company.identification_type;
      let cedula = "";
      if (type === "01") {
        cedula = "cédula física";
      } else if (type === "02") {
        cedula = "cédula jurídica";
      } else if (type === "03") {
        cedula = "DIMEX";
      } else if (type === "04") {
        cedula = "NITE";
      }
      return cedula;
    }
  },
  methods: {
    printPos() {
      const d = new Printd();

      // text or urls is supported
      const styles = [
        `
        body {
          font-size: 19px;
        }
        @page {
          size:  auto;   
          margin: 1px;
        }
        .company-name: {
          font-size: 20px;
        }
        ul {
          text-align: center;
          list-style: none;
        }
        table {
          width:100%;
          text-align: left;
        }

         tr, td {
          border-top: 1px dashed black;
          padding: 5px;
        }

        .print-totals {
          text-align: right;
        }

        .resolution {
          text-align: center;
          margin-top:8px;
        }

        .thanks-purchase {
          text-align: center;
          margin:10px;
          padding: 5px;
        }

        .key50digits {
          text-align: center;
        }
        .code-qr {
          display: flex;
          justify-content: center;
        }
      `
      ];
      // text or urls is supported
      const scripts = [
        `
        (() => console.log('Hello from IFrame!'))()
      `
      ];

      // trigger the print dialog on demand
      const printCallback = ({ launchPrint, element }) => {
        element.style.display = "block";
        launchPrint();
      };
      d.print(this.$refs.printArea, styles, scripts, printCallback);
    }
  }
};
</script>

<style></style>

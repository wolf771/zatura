<template>
  <div>
    <b-row>
      <!-- Details -->
      <b-col cols="4">
        <feather-icon
          size="25"
          icon="UserIcon"
          class="float-left mr-1 text-primary"
        />
        <h2
          class="ml-1 text-primary"
        >{{ client.name }}
          <feather-icon
            v-b-tooltip.hover.top="'Editar Detalles'"
            size="22"
            icon="Edit3Icon"
            class="mr-1 text-primary"
            @click="edit()"
          />
        </h2>
        <br>
        <!-- type ID -->
        <b-row>
          <b-col
            cols="6"
            class="pr-0 mr-0"
          >
            <feather-icon
              size="20"
              icon="CreditCardIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="pr-0 typeID" />
          </b-col>
          <b-col
            cols="6"
            class="p-0 m-0"
          >
            <h5 v-if="client.identification_type === '01'">
              Cédula Física
            </h5>
            <h5 v-else-if="client.identification_type === '02'">
              Cédula Jurídica
            </h5>
            <h5 v-else-if="client.identification_type === '03'">
              DIMEX
            </h5>
            <h5 v-else-if="client.identification_type === '04'">
              NITE
            </h5>
          </b-col>
        </b-row>
        <!-- ID -->
        <b-row>
          <b-col
            class="pr-0"
            cols="6"
          >
            <feather-icon
              size="20"
              icon="CreditCardIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1 numID" />
          </b-col>
          <b-col
            class="p-0 m-0"
            cols="6"
          >
            <h5>{{ client.identification }}</h5>
          </b-col>
        </b-row>
        <!-- Email -->
        <b-row>
          <b-col
            class="pr-0"
            cols="6"
          >
            <feather-icon
              size="20"
              icon="MailIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-2">
              Correo:
            </h5>
          </b-col>
          <b-col
            cols="6"
            class="p-0 m-0"
          >
            <h5>{{ client.email }}</h5>
          </b-col>
        </b-row>
        <!-- Telephone -->
        <b-row>
          <b-col
            class="pr-0"
            cols="6"
          >
            <feather-icon
              size="20"
              icon="PhoneIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1">
              Telefono:
            </h5>
          </b-col>
          <b-col
            cols="6"
            class="p-0"
          >
            <h5>{{ client.phone }}</h5>
          </b-col>
        </b-row>
        <!-- Balance -->
        <b-row>
          <b-col
            class="pr-0"
            cols="6"
          >
            <feather-icon
              size="20"
              icon="DollarSignIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1 text-warning">
              Balance:
            </h5>
          </b-col>
          <b-col
            cols="6"
            class="p-0 m-0"
          >
            <h5
              class="text-success"
            >{{ client.balance }}</h5>
          </b-col>
        </b-row>
      </b-col>
      <!-- Location -->
      <b-col cols="4">
        <feather-icon
          size="25"
          icon="MapIcon"
          class="float-left mr-1 text-primary"
          style=": primary"
        />
        <h2
          class="ml-1 text-primary"
        >Ubicación
        </h2>
        <br>
        <!-- Pais -->
        <b-row>
          <b-col cols="5">
            <feather-icon
              size="20"
              icon="MapPinIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1">
              País
            </h5>
          </b-col>
          <b-col>
            <h5>{{ client.country.name }}</h5>
          </b-col>
        </b-row>
        <!-- Provincia -->
        <b-row>
          <b-col cols="5 ml-0">
            <feather-icon
              size="20"
              icon="BookmarkIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1">
              Provincia
            </h5>
          </b-col>
          <b-col>
            <h5>{{ client.province.name }}</h5>
          </b-col>
        </b-row>
        <!-- Cantón -->
        <b-row>
          <b-col cols="5">
            <feather-icon
              size="20"
              icon="FlagIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-2">
              Cantón
            </h5>
          </b-col>
          <b-col>
            <h5>{{ client.canton.name }}</h5>
          </b-col>
        </b-row>
        <!-- Distrito -->
        <b-row>
          <b-col cols="5">
            <feather-icon
              size="20"
              icon="FlagIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1">
              Distrito
            </h5>
          </b-col>
          <b-col>
            <h5>{{ client.district.name }}</h5>
          </b-col>
        </b-row>
        <!-- Barrio -->
        <b-row>
          <b-col cols="5">
            <feather-icon
              size="20"
              icon="FilterIcon"
              class="float-left mr-1 text-primary"
            />
            <h5 class="ml-1">
              Barrio
            </h5>
          </b-col>
          <b-col>
            <h5>{{ client.barrio.name }}</h5>
          </b-col>
        </b-row>
      </b-col>
      <!-- Estadisticas -->
      <b-col cols="4">
        <feather-icon
          size="25"
          icon="TrendingUpIcon"
          class="float-left mr-1 text-primary"
          style=": primary"
        />
        <h2
          class="ml-1 text-primary"
        >Graficos Estadisticos</h2>
        <br>
      </b-col>
    </b-row>
    <b-sidebar
      v-model="open"
      width="40%"
      bg-variant="white"
      right
      backdrop
      shadow
    >
      <AddUpdateClient
        :item="client"
        @saved="onSaved"
      />
    </b-sidebar>
  </div>
</template>
<script>
import {
  BRow,
  BCol,
  BSidebar,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
// eslint-disable-next-line import/no-extraneous-dependencies
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import AddUpdateClient from './AddUpdateClient.vue'

export default {
  components: {
    BRow,
    BCol,
    FeatherIcon,
    BSidebar,
    AddUpdateClient,
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    ...mapState({
      identificationTypes: state => state.app.identificationTypes,
      items: state => state.clients.items,
      client: state => state.clients.client,
    }),
  },
  watch: {},
  mounted() {
    this.getItems()
  },
  methods: {
    getItems() {
      this.$store.dispatch('clients/getDetail', {
        id: this.$route.params.id,
      })
    },
    edit() {
      this.openSidebar()
    },
    openSidebar(open = true) {
      this.open = open
    },
    onSaved(res) {
      console.log(res)
      this.$store.dispatch('clients/updateCurrentClientDetail', res)
      this.openSidebar(false)
    },
  },
}
</script>
<style type="text/css">
.typeID {
  visibility: hidden;
}
.numID {
  visibility: hidden;
}
@media only screen and (max-width:1400px) {
  .typeID::before {
    content: "Tipo de ID:";
  visibility: visible;
}
.numID::before {
    content: "Numero de ID:";
  visibility: visible;
}
}
@media only screen and (min-width:1400px) {
  .typeID::before {
    content: "Tipo de identificación:";
  visibility: visible;
  }
  .numID::before {
    content: "Numero de identificación:";
  visibility: visible;
  }
}
</style>

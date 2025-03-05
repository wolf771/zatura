<template>
  <div>
    <b-row>
      <b-col
        v-for="(contact, index) in client.contacts"
        :key="index"
        md="2"
        class="col1"
      >
        <b-card
          border-variant="primary"
          class="text-center card1"
        >
          <feather-icon
            size="22"
            icon="UserCheckIcon"
            class="text-primary float-left iconContact"
          />
          <h5>
            <strong>{{ contact.name }}</strong>
          </h5>
          <feather-icon
            size="20"
            icon="AtSignIcon"
            class="text-primary float-left iconContact1"
          />
          <h5>
            <strong>{{ contact.email }}</strong>
          </h5>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
} from 'bootstrap-vue'
import { mapState } from 'vuex'
// eslint-disable-next-line import/no-extraneous-dependencies
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    FeatherIcon,
  },
  data() {
    return {
      open: false,
      item: null,
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
  },
}
</script>
<style type="text/css">
@media only screen and (max-width:1400px) {
   .iconContact, .iconContact1{
    margin-left: -10px;
  }
  .iconContact1{
    margin-left: -12px;
  }
   .col1{
    margin-right: 3%;
  }
  .card1{
    padding: -10%;
    width: 135%;
  }
  .card1 > .card-body{
    margin: -8px -7px -12px 0px;
  }
}
@media only screen and (min-width:1400px) {
  .iconContact1{
    margin-left: -3px;
  }
  .col1{
    margin-right: -3.3%;
  }
  .card1{
    width: 85%;
  }
  .card1 > .card-body{
    margin: -8px 0px -12px 0px;
  }
}
</style>

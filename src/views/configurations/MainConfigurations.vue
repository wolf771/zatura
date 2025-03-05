<template>
  <vx-card>
    <vs-tabs>
      <vs-tab label="Generales" icon-pack="feather" icon="icon-info">
        <all-configurations-company></all-configurations-company>
      </vs-tab>
      <vs-tab
        v-if="user.rol === 'admin'"
        label="Servidor Email"
        icon-pack="feather"
        icon="icon-at-sign"
      >
        <config-email></config-email>
      </vs-tab>
      <vs-tab label="Plantilas Email" icon-pack="feather" icon="icon-mail">
        <template-email></template-email>
      </vs-tab>
      <vs-tab
        label="Terminos y Condiciones"
        icon-pack="feather"
        icon="icon-edit-2"
      >
        <terms></terms>
      </vs-tab>
      <vs-tab
        v-if="user.rol === 'admin'"
        label="Recepción Email"
        icon-pack="feather"
        icon="icon-inbox"
      >
        <recep-email></recep-email>
      </vs-tab>
    </vs-tabs>
  </vx-card>
</template>

<script>
import ConfigGenerals from "@/views/configurations/Generals.vue";
import ConfigEmail from "@/views/configurations/Email.vue";
import TemplateEmail from "@/views/configurations/TemplateEmail.vue";
import Terms from "@/views/configurations/Terms.vue";
import Taxes from "@/views/configurations/Taxes.vue";
import AllConfigurationsCompany from "@/views/configurations/AllConfigurationsCompany.vue";
import { mapState } from "vuex";
import RecepEmail from "@/views/configurations/ReceptionEmail.vue";

export default {
  name: "main-configurations",
  components: {
    ConfigGenerals,
    ConfigEmail,
    TemplateEmail,
    Terms,
    Taxes,
    AllConfigurationsCompany,
    RecepEmail
  },
  data() {
    return {
      activeName: "first"
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style></style>

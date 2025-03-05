<template>
  <b-tabs
    content-class="mt-3"
    lazy
  >
    <b-tab active>
      <template #title>
        <feather-icon
          icon="AlertCircleIcon"
          size="1x"
        />Generales
      </template>
      <all-configurations-company />
    </b-tab>
    <b-tab>
      <template #title>
        <feather-icon
          icon="AtSignIcon"
          size="1x"
        />Servidor Email
      </template>
      <email-configuration-company />
    </b-tab>
    <b-tab>
      <template #title>
        <feather-icon
          icon="MailIcon"
          size="1x"
        />Plantillas Email
      </template>
      <email-templates-configuration-company />
    </b-tab>
    <b-tab>
      <template #title>
        <feather-icon
          icon="Edit2Icon"
          size="1x"
        />Términos y Condiciones
      </template>
      <terms-configuration-company />
    </b-tab>
    <b-tab>
      <template #title>
        <feather-icon
          icon="InboxIcon"
          size="1x"
        />Recepción Email
      </template>
      <email-reception-configuration-company />
    </b-tab>
    <b-tab>
      <template #title>
        <feather-icon
          icon="BriefcaseIcon"
          size="1x"
        />Configuración de hacienda
      </template>
      <hacienda-configuration-company />
    </b-tab>
  </b-tabs>
</template>

<script>
import EmailConfigurationCompany from '@/views/MyCompanies/components/Email.vue'
import HaciendaConfigurationCompany from '@/views/MyCompanies/components/Hacienda.vue'
import EmailTemplatesConfigurationCompany from '@/views/MyCompanies/components/TemplateEmail.vue'
import TermsConfigurationCompany from '@/views/MyCompanies/components/Terms.vue'
import AllConfigurationsCompany from '@/views/MyCompanies/components/AllConfigurationsCompany.vue'
import EmailReceptionConfigurationCompany from '@/views/MyCompanies/components/ReceptionEmail.vue'

import { mapState } from 'vuex'
import { BTabs, BTab } from 'bootstrap-vue'

export default {
  name: 'MainConfigurations',
  components: {
    EmailConfigurationCompany,
    HaciendaConfigurationCompany,
    EmailTemplatesConfigurationCompany,
    TermsConfigurationCompany,
    AllConfigurationsCompany,
    BTabs,
    BTab,
    EmailReceptionConfigurationCompany,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    id() {
      return this.$route.params.company_id
    },
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-configs-company.scss';
</style>

<template>
  <div>
    <new-document
      :id="this.$route.params.id"
      :type="this.$route.params.type"
      :action="this.$route.params.action"
      :client-id="clientId"
    />
  </div>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import NewDocument from '@/components/NewDocument/Index.vue'

export default {
  components: {
    NewDocument,
  },
  data() {
    return {}
  },
  computed: {
    clientId() {
      // get query param clientId
      return this.$route.query.clientId?.toString()
    },
  },
  watch: {},
}
</script>

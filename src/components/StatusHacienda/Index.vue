<template>
  <div class="ml-2">
    <feather-icon icon="CheckCircleIcon"  size="1.2x" class="text-success" v-if="this.status != null"></feather-icon>
    <feather-icon icon="XCircleIcon"  size="1.2x" class="text-danger" v-if="this.status == null"></feather-icon>
  </div>
</template>

<script>
export default {
  name: 'StatusHacienda',
  props: {
    status: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  watch: {},
}
</script>

<template>
  <input 
    type="text"
    :value="dato"
    @input="updateData($event.target.value)"/>
</template>

<script>
export default {
  name: 'search-item',
  props: ['dato'],
  methods: {
    updateData(val) {
      this.$emit('input', val);
    }
  }
}
</script>

<style>

</style>

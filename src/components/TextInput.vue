<template>
  <div :class="['form-group', {'has-danger': error, 'is-focused': value} ]">
    <label v-if="label">{{ label }}</label>
    <input type="text" :value="value" @input="updateSelf($event.target.value)" class="form-control">
    <!-- <input @blur="floatLabelBlur($event.target)"  @focus="floatLabelFocus($event.target)" :value="value" @input="updateSelf($event.target.value)" class="form-control" ref="input"> -->
    <label v-show="error" class="error">
      {{ error }}
    </label>
  </div>
</template>

<script>
export default {
   $_veeValidate: {
    name() {
      return this.label;
    },
    value() {
      return this.value;
    }
  },
  name: 'textinput',
  props: ['error','label', 'value'],
  methods: {
    updateSelf (value) {
      this.$emit('input', value)
    },
    floatLabelFocus(e) {
      e.parentNode.classList.add('is-focused');
    },
    floatLabelBlur(e) {
      if(!this.value) {
        e.parentNode.classList.remove('is-focused');
      }
    }
  } 

}
</script>

<style scoped>
  .form-control {
    border: 1px solid #d0d3d8 !important;
    padding: 5px !important;
  }
</style>

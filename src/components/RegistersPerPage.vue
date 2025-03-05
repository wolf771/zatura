<template>
  <span class="select-per-page" style="display:inline-block; margin:2px;">
    <vs-select @change="changeOption" width="65px" v-model="selectedDefault">
      <vs-select-item
        v-for="num in nums"
        :key="num"
        :value="num"
        :text="num"
      ></vs-select-item>
    </vs-select>
  </span>
</template>

<script>
export default {
  name: "registers-per-page",
  props: {
    perPage: {
      default: 10
    }
  },
  data() {
    return {
      nums: [10, 20, 30, 50, 100],
      selectedDefault: 10
    };
  },
  computed: {
    perPageValue: {
      get() {
        return this.perPageValue;
      },
      set(newVal) {
        this.selectedDefault = newVal;
      }
    }
  },
  methods: {
    changeOption() {
      //console.log(this.selectedDefault)
      this.$emit("changeNumPerPage", this.selectedDefault);
    }
  }
};
</script>

<style>
.select-per-page {
  padding-right: 5px;
}
.select-per-page .vs-select--input {
  border-radius: 100px;
}
</style>

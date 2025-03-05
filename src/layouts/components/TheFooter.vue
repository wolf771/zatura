<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <span
      >COPYRIGHT @ {{ new Date().getFullYear() }}
      <a href="http://zaturacr.com" target="_blank" rel="nofollow"
        >ZATURA</a
      ></span
    >
    <span class="md:flex hidden items-center">
      <feather-icon
        icon="HeartIcon"
        svgClasses="stroke-current text-danger w-6 h-6"
        class="ml-2"
      />
      <span style="margin-left:2px"> v3.0</span>
    </span>
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String
    }
  }
};
</script>

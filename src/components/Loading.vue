<template>
  <div class="col-md-12 text-center">
    <div :class="['lds-dual-ring', {visible: display}]"></div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: ['visible'],
  data() {
    return {
    }
  },
  computed: {
    display: function() {
      return this.visible
    }
  }
}
</script>

<style scope>
  .lds-dual-ring {
    display: none;
    width: 64px;
    height: 64px;
    z-index: 10000;
  }

  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid rgb(0, 112, 168);
    border-color: rgb(0, 112, 168) transparent rgb(0, 112, 168) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .visible {
    display: inline-block;
  }
</style>

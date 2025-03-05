<template>
  <div class="wrapper">
      <!-- sidebar -->
      <side-bar></side-bar>
      <div class="main-panel">
          <!-- top bar -->
          <top-bar></top-bar>
          <div class="content">
            <div class="container-fluid">
              <router-view></router-view>
            </div>  
          </div>    
      </div>
    </div>  
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import TopBar from '@/components/TopBar.vue';

export default {
  name: 'home-layout',
  components: {
    TopBar,
    SideBar
  }
}
</script>

<style>

</style>

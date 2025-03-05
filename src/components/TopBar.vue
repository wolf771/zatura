<template>
        <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
        <div class="container-fluid">
          <div class="navbar-wrapper">
            <div class="navbar-minimize">
              <button id="minimizeSidebar" class="btn btn-just-icon btn-white btn-fab btn-round" @click="toggleSidebar()">
                <i class="material-icons text_align-center visible-on-sidebar-regular">more_vert</i>
                <i class="material-icons design_bullet-list-67 visible-on-sidebar-mini">view_list</i>
              </button>
            </div>
            <a class="navbar-brand text-primary font-weight-bold" href="#">{{ $route.meta.name_section }}</a>
          </div>
          <button class="navbar-toggler" @click.prevent="mobileSidebarToggler()" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
            <span class="navbar-toggler-icon icon-bar"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end">
          
            <ul class="navbar-nav">
              <li v-if="false">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="fa fa-bell text-primary" style="font-size:1.5em;margin-right:1em"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(n, i) in notifications" :key="i">
                    <div class="notifications">
                      <p :class="['n-title', n.classes]">
                        <i class="fa fa-bell"></i>
                        {{ n.title }}
                      </p>
                      <p class="n-body">{{ n.body }}</p>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              </li>
             <li>
              <el-dropdown @command="dropdownUser">
                <span class="el-dropdown-link">
                  <i class="fa fa-user text-primary" style="font-size:1.5em;margin-right:1em"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="logout">
                    Salir
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- End Navbar -->
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'topbar',
  computed: {
    ...mapState(['notifications'])
  },
  methods: {
    toggleSidebar() {
      document.body.classList.toggle('sidebar-mini');
    },
    toggleUserProfile() {
      document.getElementById('toggleProfile').classList.toggle('show');
    },
    mobileSidebarToggler() {
      document.body.classList.toggle('nav-open');
    },
    logout() {
      let defaultState = {
          token: null,
          countries: [],
          provinces: [],
          cantons: [],
          districts: [],
          identification_types: [
            {value: '01', text: 'Cédula Física'},
            {value: '02', text: 'Cédula Juridica'},
            {value: '03', text: 'DIMEX'},
            {value: '04', text: 'NITE'}
          ],
          categories: [],
          units: [],
          tax_types: [],
          user: "",
          currencies: [],
          selected_items: [
            {
              uid: 1,
              id: 0,
              name: "",
              price: 0,
              calculate_price: 0,
              quantity: 1,
              discount: 0,
              tax_type: {
                id: 1,
                rate: 0
              },
              currency: {
                id: 2,
                symbol: "₡"
              }
            }
          ],
          payment_methods: [],
          payment_terms: [],
          payment_forms: [],
          consecutives: {
            fe: 0,
            nc: 0,
            nd: 0,
            te: 0,
            cce: 0,
            cpce: 0,
            rce: 0,
            qt : 0
          },
          exchange_rate: "",
          current_currency: {
            id: 1,
            symbol: "$",
            name: ""
          },
          company_default: {},
          general_configurations: {},
          notifications: [
            {'title': 'Documento aceptado', 'body': 'El documento 000000001 fue rechazado por el ministerio de hacienda...', 'classes':'text-success'},
            {'title': 'Documento rechazado', 'body': 'El documento 000000002 fue aceptado por el ministerio de hacienda...', 'classes': 'text-danger'}
          ],
          templates_email: [],
          terms: []
        }
        
      localStorage.clear();

      this.$store.commit('resetState', {defaultState: defaultState})

      this.$router.push({name: 'login'});
    },
    dropdownUser(command) {
      if(command == 'logout') {
        this.logout();
      }
    }
  }


}
</script>

<style scoped>
  .notifications {
    padding: 5px;
    width: 300px;
    border-bottom: 1px solid rgb(195, 212, 212);
  }
  .notifications p {
    margin: 0;
    padding: 0;
  }
  .notifications .n-title, .n-body {
    padding: 1px;
  }

 .notifications .n-title {
    font-size: 16px;
  }

  .notifications .n-body {
    font-weight: normal;
     line-height: 1.2em
  }
</style>

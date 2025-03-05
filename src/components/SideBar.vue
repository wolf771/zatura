<template>
  <div
    class="sidebar"
    data-color="purple"
    data-background-color="black"
    data-image="#"
  >
    <div class="logo">
      <a href="#" class="simple-text logo-mini">
        ZT
      </a>

      <el-tooltip
        class="item"
        effect="dark"
        :content="user ? user.company_default.name : 'zatura'"
        placement="top-start"
      >
        <a href="#" class="simple-text logo-normal" title>
          {{
            user ? user.company_default.name : "zatura" | truncateText(0, 13)
          }}
        </a>
      </el-tooltip>
    </div>

    <div class="sidebar-wrapper">
      <!-- <div class="user">
          <div class="photo">
            <img src="../assets/img/faces/avatar.jpg" />
          </div>
          <div class="user-info">
            <a data-toggle="collapse" href="#collapseExample" class="username">
              <span>
                Tania Andrew
                <b class="caret"></b>
              </span>
            </a>
            <div class="collapse" id="collapseExample">
              <ul class="nav">
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <span class="sidebar-mini"> MP </span>
                    <span class="sidebar-normal"> My Profile </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <span class="sidebar-mini"> EP </span>
                    <span class="sidebar-normal"> Edit Profile </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <span class="sidebar-mini"> S </span>
                    <span class="sidebar-normal"> Settings </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div> -->
      <ul class="nav">
        <li class="nav-item">
          <a href="#">
            <i class="material-icons">show_chart</i>
            <p class="text-white">TCO: 1$ = ₡ {{ exchange_rate }}</p>
          </a>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'dashboard' }" class="nav-link">
            <i class="material-icons">dashboard</i>
            <p>Dashboard</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'clients' }" class="nav-link">
            <i class="material-icons">people</i>
            <p>Clientes</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'items' }" class="nav-link">
            <i class="material-icons">assignment</i>
            <p>Artículos</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'quotations' }" class="nav-link">
            <i class="material-icons">description</i>
            <p>
              {{ $store.state.general_configurations.custom_quotation_name }}
            </p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'invoices' }" class="nav-link">
            <i class="material-icons">assignment</i>
            <p>Facturas</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'tickets' }" class="nav-link">
            <i class="material-icons">receipt</i>
            <p>Tiquetes</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'notes' }" class="nav-link">
            <i class="material-icons">receipt</i>
            <p>Notas</p>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link :to="{ name: 'message-receptors' }" class="nav-link">
            <i class="material-icons">receipt</i>
            <p>Recepción Documentos</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'payments' }" class="nav-link">
            <i class="material-icons">money</i>
            <p>Pagos</p>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'expenses' }" class="nav-link">
            <i class="fa fa-heartbeat"></i>
            <p>Gastos</p>
          </router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="toggleReportList()">
            <i class="fa fa-ruler"></i>
            <p>Reportes<b class="caret"></b></p>
          </a>
          <div :class="['collapse', { show: menuReportList }]">
            <ul class="nav">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'report-tickets' }"
                >
                  Reporte Tiquetes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'report-invoices' }"
                >
                  Reporte Facturas
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'report-expenses' }"
                >
                  Informe de gastos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'report-items' }"
                >
                  Reporte Productos
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'companies' }" class="nav-link">
            <i class="material-icons">home</i>
            <p>Mis Compañias</p>
          </router-link>
        </li>
        <li class="nav-item" v-if="user.rol === 'admin'">
          <a href="#" class="nav-link" @click.prevent="toggleAdminList()">
            <i class="fa fa-ruler"></i>
            <p>Administrador<b class="caret"></b></p>
          </a>
          <div :class="['collapse', { show: menuAdminList }]">
            <ul class="nav">
              <li class="nav-item">
                <router-link class="nav-link" href="#" :to="{ name: 'users' }">
                  Usuarios
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'all-companies' }"
                >
                  Todas Compañias
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'assign-company' }"
                >
                  Asignar Compañia
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  href="#"
                  :to="{ name: 'update-cabys-codes' }"
                >
                  Actualizar codigos cabys
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="sidebar-background"
      style="background-image: url('../assets/img/sidebar-1.jpg')"
    ></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      menuReportList: false,
      menuAdminList: false
    };
  },
  computed: {
    ...mapState(["user", "exchange_rate"])
  },
  methods: {
    ...mapActions(["getExchangeRate"]),
    toggleReportList() {
      this.menuReportList = !this.menuReportList;
    },
    toggleAdminList() {
      this.menuAdminList = !this.menuAdminList;
    }
  },
  created() {
    this.getExchangeRate();
  }
};
</script>

<style scoped>
.router-link-exact-active {
  background-color: #4caf50 !important;
}
</style>

<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center  d-none d-lg-flex"
    >
      <dark-Toggler class="d-none d-lg-block" />
      <b-badge
        v-b-tooltip.hover
        pill
        variant="link"
        title="Tasa de cambio actualizada con el Banco Central de Costa Rica"
      >
        <p
          class="text-primary my-0"
          style="font-size: 14px"
        >
          <i class="fa fa-chart-line" />
          1$ = ₡ {{ exchangeRate }}
        </p>
      </b-badge>
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-dropdown
        id="dropdown-user-companies"
        variant="link"
        :text="activeCompany ? activeCompany.name : ''"
        class="mr-1"
      >
        <b-dropdown-item
          v-for="c of companies"
          :key="c.id"
          :class="c.id === activeCompany.id ? 'bg-success' : ''"
          @click="changeActiveCompany(c.id)"
        >{{ c.name }}</b-dropdown-item>
      </b-dropdown>

      <b-dropdown
        id="dropdown-user-companies"
        no-caret
        variant="link"
      >
        <template #button-content>
          <feather-icon
            icon="BellIcon"
            size="1.5x"
          />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center">
          Notificaciones
        </b-dropdown-item>
      </b-dropdown>

      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <!-- <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ user ? user.name : '' }}
            </p>
            <span class="user-status">Admin</span>
          </div> -->
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/avatars/user-placeholder.jpg')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Perfil</span>
        </b-dropdown-item>
        <!--
        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MailIcon" class="mr-50" />
          <span>Inbox</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="CheckSquareIcon" class="mr-50" />
          <span>Task</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MessageSquareIcon" class="mr-50" />
          <span>Chat</span>
        </b-dropdown-item> -->

        <b-dropdown-divider />

        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="logout()"
        >
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Salir</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
  BDropdown,
  BBadge,
  VBToggle,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
    BDropdown,

    // Navbar Components
    DarkToggler,
    BBadge,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      companies: state => state.auth.companies,
      activeCompany: state => state.auth.company,
      exchangeRate: state => state.auth?.company?.exchange_rate ?? 0,
    }),
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    ...mapActions({
      changeActiveCompany: 'auth/changeActiveCompany',
    }),
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
}
</script>
<style scoped>
.active {
  background: red !important;
}
</style>

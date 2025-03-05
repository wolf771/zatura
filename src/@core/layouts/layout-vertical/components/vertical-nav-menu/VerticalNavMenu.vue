<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      {
        expanded:
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered),
      },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light',
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row">
          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link
              class="navbar-brand"
              to="/"
            >
              <span class="brand-logo">
                <!-- <b-img
                  :src="appLogoImage"
                  alt="logo"
                /> -->
                <svg
                  class="logo-side"
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="968.000000pt"
                  height="607.000000pt"
                  viewBox="0 0 968.000000 607.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <metadata>
                    Created by potrace 1.15, written by Peter Selinger 2001-2017
                  </metadata>
                  <g
                    transform="translate(0.000000,607.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path
                      d="M5183 6055 c-133 -36 -272 -137 -349 -253 -21 -31 -51 -95 -67 -142
-25 -72 -30 -100 -30 -185 0 -180 55 -317 178 -441 126 -126 270 -180 460
-172 93 4 122 10 190 36 188 74 325 233 371 429 21 90 14 243 -15 335 -59 184
-228 342 -423 394 -68 18 -247 17 -315 -1z"
                    />
                    <path
                      d="M3838 5915 c-155 -42 -282 -165 -329 -316 -35 -113 -22 -265 33 -374
27 -52 122 -151 176 -182 97 -57 246 -79 361 -52 118 27 243 122 299 227 150
281 16 606 -287 696 -65 19 -186 20 -253 1z"
                    />
                    <path
                      d="M6590 5306 c-161 -35 -268 -94 -385 -211 -154 -153 -219 -311 -219
-530 0 -219 65 -376 219 -530 154 -154 312 -219 530 -219 145 0 213 16 345 81
80 39 109 60 185 137 100 100 154 190 197 326 19 64 23 95 22 210 0 125 -2
142 -33 229 -41 122 -88 198 -175 289 -139 144 -310 221 -510 228 -72 2 -134
-1 -176 -10z"
                    />
                    <path
                      d="M2775 5296 c-104 -26 -187 -82 -252 -170 -127 -172 -106 -423 47
-574 279 -275 750 -78 750 313 0 290 -266 500 -545 431z"
                    />
                    <path
                      d="M8646 4669 c-295 -28 -669 -149 -837 -271 -35 -25 -39 -33 -39 -72 0
-57 27 -90 93 -112 76 -26 250 -23 462 9 410 62 875 104 875 79 0 -5 -102 -56
-227 -115 -1556 -724 -3321 -1354 -4879 -1741 -1245 -309 -2360 -473 -3409
-501 l-220 -6 200 91 c110 50 275 125 368 167 154 70 171 80 222 135 136 147
139 267 8 312 -66 22 -75 21 -220 -28 -439 -151 -787 -329 -941 -482 -73 -73
-101 -129 -102 -201 0 -67 8 -87 73 -175 68 -92 145 -164 202 -189 156 -69
1157 -87 1791 -33 l71 6 73 -122 c493 -825 1193 -1305 2046 -1405 176 -20 643
-20 819 0 834 98 1518 493 1927 1116 111 169 158 262 291 574 166 390 258 769
283 1162 l6 112 42 16 c302 121 1293 611 1462 724 310 207 535 433 584 584 7
22 10 68 8 103 -4 73 -33 118 -107 168 -44 30 -186 64 -361 86 -118 15 -445
21 -564 9z m-2040 -2193 c-3 -57 -16 -159 -27 -227 -138 -851 -635 -1442
-1438 -1710 -191 -63 -293 -85 -461 -99 -303 -25 -651 30 -961 151 -437 170
-896 536 -1093 871 l-67 113 28 7 c15 4 123 19 238 33 992 126 2079 381 3140
737 246 82 615 214 623 223 20 20 24 -5 18 -99z"
                    />
                    <path
                      d="M2120 4315 c-331 -93 -372 -558 -62 -703 50 -24 69 -27 162 -27 93 0
112 3 161 26 79 37 133 90 173 169 124 248 -37 528 -314 546 -40 2 -86 -2
-120 -11z"
                    />
                    <path
                      d="M1944 3281 c-96 -25 -188 -101 -227 -189 -28 -65 -34 -175 -13 -243
33 -103 122 -192 220 -221 23 -7 74 -12 113 -11 135 0 256 85 304 212 30 79
24 204 -13 276 -32 61 -103 130 -165 157 -49 22 -169 32 -219 19z"
                    />
                  </g>
                </svg>
              </span>
              <h2 class="brand-text">
                {{ appName }}
              </h2>
            </b-link>
          </li>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive"
              />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon"
                @click="toggleCollapsed"
              />
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div
      :class="{ 'd-block': shallShadowBottom }"
      class="shadow-bottom"
    />
    <!-- Fast Action dropdown -->
    <div
      style="
        width: 100%;
        display:flex;
        align-items:center;
        justify-content:center;
      "
      class="text-center mt-1 menu-sidebar"
    >
      <b-dropdown
        size="sm"
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
        dropright
      >
        <template #button-content>
          <b-button
            v-b-tooltip.hover.bottom="'Acciones Rapidas'"
            variant="link"
            style="padding: 6px 12px"
          >
            <svg-icon
              type="mdi"
              :path="path"
              style="
            border: none;
            height: 35px;
            width: 35px;
            margin-bottom:-5px;
            margin-top:-10px;
            "
            /><!--<a class="mt-0 mb-2 pt-0"> Nuevo</a>-->
          </b-button>
        </template>
        <b-dropdown-item active>
          ¿Qué Deseas hacer?
        </b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'quotation',action:'new-document'})">
          <feather-icon
            icon="FileIcon"
            class="text-primary"
            size="1.2x"
          /> Cotización</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'invoice',action:'new-document'})">
          <feather-icon
            icon="TagIcon"
            class="text-primary"
            size="1.2x"
          /> Factura</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'recurring-invoices',action:'new-document'})">
          <feather-icon
            icon="FilePlusIcon"
            class="text-primary"
            size="1.2x"
          /> Factura Recurrente</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'note',action:'new-document'})">
          <feather-icon
            icon="FileMinusIcon"
            class="text-primary"
            size="1.2x"
          /> Nota</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'ticket',action:'new-document'})">
          <feather-icon
            icon="FileTextIcon"
            class="text-primary"
            size="1.2x"
          /> Tiquetes</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({action:'add-update-client'})">
          <feather-icon
            icon="UserIcon"
            class="text-primary"
            size="1.2x"
          /> Cliente</b-dropdown-item>
        <b-dropdown-item @click.stop.prevent="handleAction({type:'product',action:'AddUpdateProduct'})">
          <feather-icon
            icon="ShoppingBagIcon"
            class="text-primary"
            size="1.2x"
          /> Articulo</b-dropdown-item>
      </b-dropdown>
    </div>

    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        evt => {
          shallShadowBottom = evt.srcElement.scrollTop > 0
        }
      "
    >
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiRocketLaunch } from '@mdi/js'

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {
  BLink, BDropdownItem, BDropdown, BButton,
} from 'bootstrap-vue'
import { provide, computed, ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeConfig } from '@themeConfig'
import navMenuItems from '@/navigation/vertical'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'

export default {
  components: {
    SvgIcon,
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BDropdownItem,
    BDropdown,
    BLink,
    BButton,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      path: mdiRocketLaunch,
    }
  },
  methods: {
    handleAction({ type, action }) {
      this.$store.dispatch('multiAction/setAction', {
        action,
        type,
      })
    },
  },
  setup(props, { root: { $store } }) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'))

    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    // Get exchange rate of state
    const exchangeRate = computed(
      () => $store.state.auth?.company?.exchange_rate ?? 0,
    )

    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
      exchangeRate,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/core/menu/menu-types/vertical-menu.scss';

.logo-side {
  width: 40px;
  height: 40px;
}

.logo-side path {
  fill: #7367f0;
}
</style>

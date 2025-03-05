<template>
  <div
    class="vertical-layout h-100"
    :class="[layoutClasses]"
    :data-col="isNavMenuHidden ? '1-column' : null"
  >
    <!-- Navbar -->
    <b-navbar
      :toggleable="false"
      :variant="navbarBackgroundColor"
      class="header-navbar navbar navbar-shadow align-items-center"
      :class="[navbarTypeClass]"
    >
      <slot
        name="navbar"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :navbarBackgroundColor="navbarBackgroundColor"
        :navbarTypeClass="[...navbarTypeClass, 'header-navbar navbar navbar-shadow align-items-center']"
      >
        <app-navbar-vertical-layout :toggle-vertical-menu-active="toggleVerticalMenuActive" />
      </slot>
    </b-navbar>
    <!--/ Navbar -->

    <!-- Vertical Nav Menu -->
    <vertical-nav-menu
      v-if="!isNavMenuHidden"
      :is-vertical-menu-active="isVerticalMenuActive"
      :toggle-vertical-menu-active="toggleVerticalMenuActive"
    >
      <template #header="slotProps">
        <slot
          name="vertical-menu-header"
          v-bind="slotProps"
        />
      </template>
    </vertical-nav-menu>
    <!-- /Vertical Nav Menu -->

    <!-- Vertical Nav Menu Overlay -->
    <div
      class="sidenav-overlay"
      :class="overlayClasses"
      @click="isVerticalMenuActive = false"
    />
    <!-- /Vertical Nav Menu Overlay -->

    <!-- Content -->

    <!-- CONTENT TYPE: Left -->
    <transition
      :name="routerTransition"
      mode="out-in"
    >
      <component
        :is="layoutContentRenderer"
        :key="layoutContentRenderer === 'layout-content-renderer-left' ? $route.meta.navActiveLink || $route.name : null"
      >
        <template
          v-for="(index, name) in $scopedSlots"
          v-slot:[name]="data"
        >
          <slot
            :name="name"
            v-bind="data"
          />
        </template>
      </component>
    </transition>
    <!--/ Content -->

    <!-- Multi action sidebar -->
    <b-sidebar
      id="multi-action-sidebar"
      :visible="multiActionSidebarVisible"
      bg-variant="white"
      right
      backdrop
      shadow
      :class="[{'multi-action-sidebar-80': componentData.action === 'new-document'}, {'multi-action-sidebar-35': !(componentData.action === 'new-document')},'multi-action-sidebar']"
      :lazy="true"
      @change="handleSidebarVisibilityChange"
    >
      <component
        :is="componentData.action"
        v-if="componentData.action === 'new-document'"
        :type="componentData.type"
      />
      <component
        :is="componentData.action"
        v-else
        @saved="handleSidebarVisibilityChange(false)"
      />
    </b-sidebar>
    <!-- /Multi action sidebar -->

    <!-- Footer -->
    <footer
      class="footer footer-light"
      :class="[footerTypeClass]"
    >
      <slot name="footer">
        <app-footer />
      </slot>
    </footer>
    <!-- /Footer -->

    <slot name="customizer" />
  </div>
</template>

<script>
import { onUnmounted } from '@vue/composition-api'
import AppNavbarVerticalLayout from '@core/layouts/components/app-navbar/AppNavbarVerticalLayout.vue'
import AppFooter from '@core/layouts/components/AppFooter.vue'
import useAppConfig from '@core/app-config/useAppConfig'
import { BNavbar, BSidebar } from 'bootstrap-vue'
import LayoutContentRendererDefault from '@core/layouts/components/layout-content-renderer/LayoutContentRendererDefault.vue'
import LayoutContentRendererLeft from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeft.vue'
import LayoutContentRendererLeftDetached from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeftDetached.vue'
import { mapState } from 'vuex'
import NewDocument from '@/components/NewDocument/Index.vue'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import useVerticalLayout from './useVerticalLayout'
import mixinVerticalLayout from './mixinVerticalLayout'
import AddUpdateClient from '@/views/Clients/components/AddUpdateClient.vue'
import AddUpdateProduct from '@/views/Products/components/AddUpdateProduct/index.vue'

export default {
  components: {
    // AppBreadcrumb,
    AppNavbarVerticalLayout,
    AppFooter,
    VerticalNavMenu,
    BNavbar,
    LayoutContentRendererLeftDetached,
    LayoutContentRendererLeft,
    LayoutContentRendererDefault,
    NewDocument,
    BSidebar,
    AddUpdateClient,
    AddUpdateProduct,
  },
  mixins: [mixinVerticalLayout],
  computed: {
    layoutContentRenderer() {
      const rendererType = this.$route.meta.contentRenderer
      if (rendererType === 'sidebar-left') return 'layout-content-renderer-left'
      if (rendererType === 'sidebar-left-detached') return 'layout-content-renderer-left-detached'
      return 'layout-content-renderer-default'
    },
    ...mapState({
      multiActionSidebarVisible: state => state.multiAction.multiActionSidebarVisible,
      componentData: state => state.multiAction.componentData,
    }),

  },
  methods: {
    handleSidebarVisibilityChange(visible) {
      this.$store.dispatch('multiAction/updateVisibility', visible)
    },
  },
  setup() {
    const {
      routerTransition, navbarBackgroundColor, navbarType, footerType, isNavMenuHidden,
    } = useAppConfig()

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      layoutClasses,
      overlayClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    // Resize handler
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/themes/bordered-layout.scss";
@import '@core/scss/vue/custom-layout/layout-vertical.scss';
</style>

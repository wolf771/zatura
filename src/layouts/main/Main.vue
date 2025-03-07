<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="layout--main"
    :class="[navbarClasses, footerClasses, { 'app-page': isAppPage }]"
  >
    <vue-snotify></vue-snotify>

    <vx-tour :steps="steps" v-if="!disableThemeTour" />

    <Suggestion> </Suggestion>

    <the-customizer
      @updateNavbar="updateNavbar"
      @updateNavbarColor="updateNavbarColor"
      :navbarType="navbarType"
      :navbarColor="navbarColor"
      :footerType="footerType"
      @updateFooter="updateFooter"
      :routerTransition="routerTransition"
      @updateRouterTransition="updateRouterTransition"
      v-if="!disableCustomizer"
      :hideScrollToTop="hideScrollToTop"
      @toggleHideScrollToTop="toggleHideScrollToTop"
    />
    <vx-sidebar
      :sidebarItems="sidebarItems"
      :logo="require('@/assets/images/logo/logo.png')"
      title="Vuesax"
      parent=".layout--main"
    />

    <div
      id="content-area"
      :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]"
    >
      <div id="content-overlay"></div>

      <div class="content-wrapper">
        <the-navbar
          :navbarColor="navbarColor"
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark }
          ]"
        />

        <div class="router-view">
          <div
            class="router-content"
            :class="{ 'mt-0': navbarType == 'hidden' }"
          >
            <transition :name="routerTransition">
              <div
                class="alert alert-warning"
                style="position:relative;z-index: 30000;display: flex;left:0;right:0;justify-content: center;"
                v-if="
                  Object.keys(company_default).length !== 0 &&
                    !company_default.active
                "
              >
                <p class="font-weight-bold">
                  <i class="fa fa-exclamation-triangle mr-2"></i>Esta compañía
                  se encuentra desactivada, favor contactarte con tu asesor de
                  servicio.
                </p>
              </div>

              <div
                class="router-header flex flex-wrap items-center mb-6"
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
              >
                <div
                  class="content-area__heading"
                  :class="{
                    'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light':
                      $route.meta.breadcrumb
                  }"
                >
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>
                <vx-breadcrumb
                  class="ml-4 md:block hidden"
                  v-if="$route.meta.breadcrumb"
                />
                <vs-dropdown
                  class="ml-auto md:block hidden cursor-pointer"
                  vs-trigger-click
                >
                  <vs-button
                    radius
                    icon="icon-settings"
                    icon-pack="feather"
                  ></vs-button>

                  <vs-dropdown-menu class="w-32">
                    <vs-dropdown-item
                      ><router-link
                        to="/pages/profile"
                        class="flex items-center"
                        ><feather-icon
                          icon="UserIcon"
                          class="inline-block mr-2"
                          svgClasses="w-4 h-4"
                        /><span>Profile</span></router-link
                      ></vs-dropdown-item
                    >
                    <vs-dropdown-item
                      ><router-link to="/apps/todo" class="flex items-center"
                        ><feather-icon
                          icon="CheckSquareIcon"
                          class="inline-block mr-2"
                          svgClasses="w-4 h-4"
                        /><span>Tasks</span></router-link
                      ></vs-dropdown-item
                    >
                    <vs-dropdown-item
                      ><router-link to="/apps/email" class="flex items-center"
                        ><feather-icon
                          icon="MailIcon"
                          class="inline-block mr-2"
                          svgClasses="w-4 h-4"
                        /><span>Inbox</span></router-link
                      ></vs-dropdown-item
                    >
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </transition>
            <div class="content-area__content">
              <back-to-top
                bottom="5%"
                visibleoffset="500"
                v-if="!hideScrollToTop"
              >
                <vs-button
                  icon-pack="feather"
                  icon="icon-arrow-up"
                  class="shadow-lg"
                />
              </back-to-top>
              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle"></router-view>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <the-footer></the-footer>
    </div>
  </div>
</template>

<script>
import VxSidebar from "@/layouts/components/vx-sidebar/VxSidebar.vue";
import TheCustomizer from "../components/customizer/TheCustomizer.vue";
import TheNavbar from "../components/TheNavbar.vue";
import TheFooter from "../components/TheFooter.vue";
import themeConfig from "@/../themeConfig.js";
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";
import BackToTop from "vue-backtotop";
import Suggestion from "@/layouts/components/Suggestion.vue";
import { mapState } from "vuex";
const VxTour = () => import("@/components/VxTour.vue");

export default {
  data() {
    return {
      navbarType: themeConfig.navbarType || "floating",
      navbarColor: themeConfig.navbarColor || "#fff",
      footerType: themeConfig.footerType || "static",
      routerTransition: themeConfig.routerTransition || "none",
      isNavbarDark: false,
      routeTitle: this.$route.meta.pageTitle,
      sidebarItems: sidebarItems,
      disableCustomizer: themeConfig.disableCustomizer,
      windowWidth: window.innerWidth, //width of windows
      hideScrollToTop: themeConfig.hideScrollToTop,
      disableThemeTour: themeConfig.disableThemeTour,
      steps: [
        {
          target: "#btnSidebarToggler",
          content: "Toggle Collapse Sidebar."
        },
        {
          target: ".vx-navbar__starred-pages",
          content:
            "Create your own bookmarks. You can also re-arrange them using drag & drop."
        },
        {
          target: ".i18n-locale",
          content: "You can change language from here."
        },
        {
          target: ".navbar-fuzzy-search",
          content: "Try fuzzy search to visit pages in flash."
        },
        {
          target: ".customizer-btn",
          content: "Customize template based your preference",
          params: {
            placement: "left"
          }
        }
      ]
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      if (this.navbarColor == "#fff" && val) {
        this.updateNavbarColor("#10163a");
      } else {
        this.updateNavbarColor("#fff");
      }
    }
  },
  computed: {
    ...mapState(["company_default"]),
    isAppPage() {
      if (this.$route.path.includes("/apps/")) return true;
      else return false;
    },
    isThemeDark() {
      return this.$store.state.theme == "dark";
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.sidebarWidth == "default") return "content-area-default";
      else if (this.sidebarWidth == "reduced") return "content-area-reduced";
      else if (this.sidebarWidth) return "content-area-full";
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType == "hidden",
        "navbar-sticky": this.navbarType == "sticky",
        "navbar-static": this.navbarType == "static",
        "navbar-floating": this.navbarType == "floating"
      };
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType == "hidden",
        "footer-sticky": this.footerType == "sticky",
        "footer-static": this.footerType == "static"
      };
    }
  },
  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbar(val) {
      this.navbarType = val;
    },
    updateNavbarColor(val) {
      this.navbarColor = val;
      if (val == "#fff") this.isNavbarDark = false;
      else this.isNavbarDark = true;
    },
    updateFooter(val) {
      this.footerType = val;
    },
    updateRouterTransition(val) {
      this.routerTransition = val;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
        this.disableThemeTour = true;
      } else if (this.windowWidth < 1200) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
      }
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val;
    }
  },
  components: {
    VxSidebar,
    TheNavbar,
    TheFooter,
    TheCustomizer,
    BackToTop,
    Suggestion,
    VxTour
  },
  created() {
    this.setSidebarWidth();
    if (this.navbarColor == "#fff" && this.isThemeDark) {
      this.updateNavbarColor("#10163a");
    } else {
      this.updateNavbarColor(this.navbarColor);
    }
  }
};
</script>

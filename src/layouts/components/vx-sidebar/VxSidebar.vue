<!-- =========================================================================================
    File Name: VxSidebar.vue
    Description: Sidebar Component
    Component Name: VxSidebar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="parentx">
    <vs-sidebar
      ref="mainSidebar"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      default-index="-1"
      class="sidebarx main-menu-sidebar items-no-padding"
      v-model="isSidebarActive"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
    >
      <!-- <div
        style="background: transparent;position:absolute;left:0;right:0;top:0:bottom: 0;height: 100%;z-index:200000"
      >
        {{ company_default.active }}
      </div> -->
      <div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
        <div
          class="header-sidebar flex items-end justify-between"
          slot="header"
        >
          <div class="logo flex items-center">
            <!-- <img src="@/assets/logo-nuevo-morado.png" alt="logo" width="50"> -->
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
            <span
              style="padding-left:0.3em"
              class="logo-text"
              v-show="isMouseEnter || !reduce"
              v-if="user"
              >{{ user ? "ZATURA" : "ZATURA" | truncateText(0, 8) }}</span
            >
          </div>
          <div>
            <template v-if="showCloseButton">
              <feather-icon
                icon="XIcon"
                class="m-0 cursor-pointer"
                @click="$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)"
              ></feather-icon>
            </template>
            <template v-else-if="!showCloseButton && !sidebarItemsMin">
              <feather-icon
                icon="DiscIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="!reduce"
                @click="toggleReduce(true)"
                id="btnSidebarToggler"
              ></feather-icon>
              <feather-icon
                icon="CircleIcon"
                class="mr-0 cursor-pointer"
                svg-classes="stroke-current"
                v-show="reduce"
                @click="toggleReduce(false)"
                id="btnSidebarToggler"
              ></feather-icon>
            </template>
          </div>
        </div>

        <div class="shadow-bottom" v-show="showShadowBottom"></div>

        <!-- exchage rate -->
        <div style="width:100%;padding-left: 40px;font-weight: bold">
          <p class="text-primary">
            <i class="fa fa-chart-line"></i>
            TCO: 1$ = ₡ {{ exchange_rate }}
          </p>
        </div>

        <VuePerfectScrollbar
          ref="mainSidebarPs"
          class="scroll-area--main-sidebar pt-2"
          :settings="settings"
          @ps-scroll-y="psSectionScroll"
        >
          <template v-for="(sidebarItem, index) in itemsSidebarPermission">
            <!-- GROUP ITEM HEADER -->
            <span
              style="margin:0;padding:10px;"
              :key="`header-${index}`"
              v-if="sidebarItem.header && !sidebarItemsMin"
              class="navigation-header truncate"
              >{{ $t(sidebarItem.i18n) || sidebarItem.header }}</span
            >
            <template v-else-if="!sidebarItem.header">
              <!-- IF IT'S SINGLE ITEM -->
              <vx-sidebar-item
                ref="sidebarLink"
                :key="`sidebarItem-${index}`"
                v-if="!sidebarItem.submenu"
                :index="index"
                :to="sidebarItem.slug != 'external' ? sidebarItem.url : ''"
                :href="sidebarItem.slug == 'external' ? sidebarItem.url : ''"
                :icon="sidebarItem.icon"
                :target="sidebarItem.target"
                :isDisabled="
                  !company_default.active &&
                    user.rol !== 'admin' &&
                    sidebarItem.name !== 'Mis compañias'
                "
              >
                <span v-show="!sidebarItemsMin" class="truncate">{{
                  $t(sidebarItem.i18n) || sidebarItem.name
                }}</span>
                <vs-chip
                  class="ml-auto"
                  :color="sidebarItem.tagColor"
                  v-if="sidebarItem.tag && (isMouseEnter || !reduce)"
                  >{{ sidebarItem.tag }}</vs-chip
                >

                <span
                  class="new-item"
                  v-if="sidebarItem.new_item"
                  @click.prevent="newItem(sidebarItem)"
                >
                  <a :href="sidebarItem.new_item" class="text-success">
                    <i class="fa fa-plus"></i>
                  </a>
                </span>
              </vx-sidebar-item>

              <!-- IF HAVE SUBMENU / DROPDOWN -->
              <template v-else>
                <vx-sidebar-group
                  ref="sidebarGrp"
                  :key="`group-${index}`"
                  :openHover="openGroupHover"
                  :group="sidebarItem"
                  :groupIndex="index"
                  :open="isGroupActive(sidebarItem)"
                  v-if="
                    (sidebarItem.name == 'Administrador' &&
                      user.rol == 'admin') ||
                      sidebarItem.name == 'Reportes' ||
                      sidebarItem.name == 'Simplificado'
                  "
                ></vx-sidebar-group>
              </template>
            </template>
          </template>
          <div style="height:50px;"></div>
        </VuePerfectScrollbar>
      </div>
    </vs-sidebar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VxSidebarGroup from "./VxSidebarGroup.vue";
import VxSidebarItem from "./VxSidebarItem.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "vx-sidebar",
  props: {
    sidebarItems: {
      type: Array,
      required: true
    },
    title: {
      type: String
    },
    logo: {
      type: String
    },
    parent: {
      type: String
    },
    openGroupHover: {
      type: Boolean,
      default: false
    },
    reduceNotRebound: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    clickNotClose: false, // disable close sidebar on outside click
    reduce: false, // determines if sidebar is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    isMouseEnter: false,
    settings: {
      // perfectscrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    windowWidth: window.innerWidth, //width of windows
    showShadowBottom: false
  }),
  computed: {
    ...mapState(["user", "exchange_rate", "company_default"]),
    itemsSidebarPermission() {
      if (
        this.company_default.permission == 1 ||
        this.company_default.permission == 4 ||
        this.company_default.permission == 3
      ) {
        if (this.company_default.permission == 3) {
          let firts_items = this.sidebarItems.slice(0, 2);
          let last_items = this.sidebarItems.slice(2, this.sidebarItems.length);
          firts_items.push({
            url: "/students",
            name: "Estudiantes",
            slug: "/students",
            icon: "UsersIcon",
            i18n: "Estudiantes"
            //new_item: 'new-student'
          });

          return firts_items.concat(last_items);
        }
        return this.sidebarItems;
      } else {
        return [
          {
            url: "/dashboard",
            name: "Dashboard",
            slug: "dashboard",
            icon: "HomeIcon",
            i18n: "Dashboard"
          },
          {
            url: "/message-receptors",
            name: "Recepción Documentos",
            slug: "/message-receptors",
            icon: "FileTextIcon",
            i18n: "Recepción Documentos",
            new_item: "new-message-receptor"
          },
          {
            url: null,
            name: "Reportes",
            slug: "reports",
            icon: "ActivityIcon",
            i18n: "Reportes",
            submenu: [
              {
                url: "/report-expenses",
                name: "Reporte gastos",
                slug: "/report-expenses",
                i18n: "Reporte gastos"
              }
            ]
          }
        ];
      }
    },
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", val);
      }
    },
    reduceSidebar() {
      return Boolean(this.reduce && this.reduceButton);
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      }
    },
    sidebarItemsMin() {
      return this.$store.state.sidebarItemsMin;
    },
    isGroupActive() {
      return sidebarItem => {
        const path = this.$route.fullPath;
        let open = false;
        let func = function(sidebarItem) {
          if (sidebarItem.submenu) {
            sidebarItem.submenu.forEach(item => {
              if (path == item.url) {
                open = true;
              } else if (item.submenu) {
                func(item);
              }
            });
          }
        };
        func(sidebarItem);
        return open;
      };
    }
  },
  watch: {
    reduce(val) {
      if (val == true) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.dispatch("updateSidebarWidth", "default");
      }

      setTimeout(function() {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    reduceButton() {
      this.setSidebarWidth();
    },
    $route() {
      if (this.isSidebarActive && this.showCloseButton)
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
    }
  },
  methods: {
    ...mapActions(["getExchangeRate"]),

    newItem(item) {
      this.$router.push(item.new_item);
    },
    sidebarMouseEntered() {
      if (this.reduce) this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    sidebarMouseLeave() {
      if (this.reduce) {
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
      }
      this.isMouseEnter = false;
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setSidebarWidth();
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        if (this.windowWidth < 992)
          this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "md");
        else this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "lg");

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        if (this.reduceButton) this.reduce = false;
        // this.reduceButton = false;
        this.showCloseButton = true;
        this.clickNotClose = false;
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      } else {
        this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "xl");
        if (this.reduceButton) this.reduce = true;
        else this.reduce = false;

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
        if (this.reduceButton && !this.isMouseEnter)
          this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
        else this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);

        this.clickNotClose = true;
        this.showCloseButton = false;
        if (this.reduceSidebar)
          this.$store.dispatch("updateSidebarWidth", "reduced");
        else this.$store.dispatch("updateSidebarWidth", "default");
      }
    },
    psSectionScroll() {
      if (this.$refs.mainSidebarPs.$el.scrollTop > 0)
        this.showShadowBottom = true;
      else this.showShadowBottom = false;
    }
  },
  components: {
    VxSidebarGroup,
    VxSidebarItem,
    VuePerfectScrollbar
  },
  created() {
    this.getExchangeRate();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebar.scss";

.new-item {
  position: absolute;
  right: 15px;
  display: none;
  z-index: 200;
  font-weight: bold;
}

.vs-sidebar--item:hover .new-item {
  display: block;
}

.logo-side {
  width: 50px;
  height: 50px;
}

.logo-side path {
  fill: #7367f0;
}
</style>

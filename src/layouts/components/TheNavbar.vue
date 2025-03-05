<!-- =========================================================================================
	File Name: TheNavbar.vue
	Description: Navbar component
	Component Name: TheNavbar
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="relative">
    <div class="vx-navbar-wrapper" style="z-index: 401 !important;height:62px">
      <vs-navbar
        class="vx-navbar navbar-custom"
        :color="navbarColor"
        :class="classObj"
      >
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <template v-if="breakpoint != 'md'">
          <h3
            class="text-black font-weight-bold nav-bar-title"
            style="width:100%"
          >
            {{ $route.meta.name_section }}
          </h3>
          <!-- STARRED PAGES - FIRST 10 -->
          <!-- <ul class="vx-navbar__starred-pages">
					<draggable v-model="starredPagesLimited" :group="{name: 'pinList'}" class="flex cursor-move">
						<li class="starred-page" v-for="page in starredPagesLimited" :key="page.url">
							<vx-tooltip :text="page.label" position="bottom" delay=".3s">
								<feather-icon svgClasses="h-6 w-6" class="p-2 cursor-pointer" :icon="page.labelIcon" @click="$router.push(page.url)"></feather-icon>
							</vx-tooltip>
						</li>
					</draggable>
				</ul> -->

          <!-- STARRED PAGES MORE -->
          <!-- <div class="vx-navbar__starred-pages--more-dropdown" v-if="starredPagesMore.length">
					<vs-dropdown vs-custom-content vs-trigger-click>
						<feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" class="cursor-pointer p-2"></feather-icon>
						<vs-dropdown-menu>
							<ul class="vx-navbar__starred-pages-more--list">
								<draggable v-model="starredPagesMore" :group="{name: 'pinList'}" class="cursor-move">
									<li class="starred-page--more flex items-center cursor-pointer" v-for="page in starredPagesMore" :key="page.url" @click="$router.push(page.url)">
										<feather-icon svgClasses="h-5 w-5" class="ml-2 mr-1" :icon="page.labelIcon"></feather-icon>
										<span class="px-2 pt-2 pb-1">{{ page.label }}</span>
									</li>
								</draggable>
							</ul>
						</vs-dropdown-menu>
					</vs-dropdown>
				</div> -->

          <!-- <div class="bookmark-container">
					<feather-icon icon="StarIcon" :svgClasses="['stoke-current text-warning', {'text-white': navbarColor != '#fff'}]" class="cursor-pointer p-2" @click.stop="showBookmarkPagesDropdown = !showBookmarkPagesDropdown" />
                    <div v-click-outside="outside" class="absolute bookmark-list w-1/3 xl:w-1/4 mt-4" v-if="showBookmarkPagesDropdown">
					<vx-auto-suggest :autoFocus="true" :data="navbarSearchAndPinList" @selected="selected" @actionClicked="actionClicked" inputClassses="w-full" show-action show-pinned background-overlay></vx-auto-suggest>
					</div>
				</div> -->
        </template>

        <vs-spacer></vs-spacer>

        <!-- I18N -->
        <!-- <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
				<span class="cursor-pointer flex i18n-locale"><img class="h-4 w-5" :src="require(`@/assets/images/flags/${$i18n.locale}.png`)" :alt="$i18n.locale" /><span class="hidden sm:block ml-2">{{ getCurrentLocaleData.lang }}</span></span>
				<vs-dropdown-menu class="w-48 i18n-dropdown">
					<vs-dropdown-item @click="updateLocale('en')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/en.png" alt="en" /> &nbsp;English</vs-dropdown-item>
					<vs-dropdown-item @click="updateLocale('fr')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/fr.png" alt="fr" /> &nbsp;French</vs-dropdown-item>
					<vs-dropdown-item @click="updateLocale('de')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/de.png" alt="de" /> &nbsp;German</vs-dropdown-item>
					<vs-dropdown-item @click="updateLocale('pt')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/pt.png" alt="pt" /> &nbsp;Portuguese</vs-dropdown-item>
				</vs-dropdown-menu>
			</vs-dropdown> -->

        <!-- SEARCHBAR -->
        <!-- <div class="search-full-container w-full h-full absolute pin-l rounded-lg" :class="{'flex': showFullSearch}" v-show="showFullSearch">
                <vx-auto-suggest :autoFocus="showFullSearch" :data="navbarSearchAndPinList" @selected="selected" ref="navbarSearch" @closeSearchbar="showFullSearch = false" placeholder="Search..." class="w-full" inputClassses="w-full vs-input-no-border vs-input-no-shdow-focus no-icon-border" icon="SearchIcon" background-overlay></vx-auto-suggest>
                <div class="absolute pin-r h-full z-50">
                    <feather-icon icon="XIcon" class="px-4 cursor-pointer h-full close-search-icon" @click="showFullSearch = false"></feather-icon>
                </div>
            </div>
            <feather-icon icon="SearchIcon" @click="showFullSearch = true" class="cursor-pointer navbar-fuzzy-search ml-4"></feather-icon> -->

        <!-- NOTIFICATIONS -->
        <vs-dropdown
          style="max-width:400px"
          vs-custom-content
          vs-trigger-click
          class="cursor-pointer"
        >
          <span class="text-primary font-weight-bold">
            <!-- <i class="fa fa-check"></i> -->
            {{ company_default.name }}
            <i class="fa fa-chevron-down"></i>
          </span>
          <vs-dropdown-menu
            element-loading-text="Seleccionando..."
            element-loading-background="rgba(0, 0, 0, 0.8)"
            v-loading="loadingSelectCompany"
            class="notification-dropdown dropdown-custom"
          >
            <div class="text-center pt-3">
              <img
                class="logo"
                :src="url_logo + company_default.logo"
                v-if="!no_exist_logo"
                alt="logo"
              />
              <span
                v-if="no_exist_logo"
                style="font-size: 2em"
                class="text-primary"
              >
                <i class="fa fa-building"></i>
              </span>
              <p>{{ company_default.name }}</p>

              <!-- loading companies -->
              <div
                class="mb-10"
                v-show="loading"
                v-loading="loading"
                element-loading-text="Cargando tus compañias..."
              ></div>
            </div>

            <VuePerfectScrollbar
              ref="mainSidebarPs"
              class="scroll-area--nofications-dropdown p-0 mb-10"
              :settings="settings"
              @ps-y-reach-end="scrollHandler"
            >
              <ul class="bordered-items">
                <li
                  @click="selectCompany(company)"
                  v-for="company in companies"
                  :key="company.company.id"
                  :class="[
                    'flex justify-between px-3 py-4 notification cursor-pointer',
                    {
                      'tr-table-state-success':
                        company.company_id === company_default.id
                    }
                  ]"
                >
                  <div class="flex items-start">
                    <div class="mx-1">
                      <span class="font-medium block notification-title">{{
                        company.company.name
                      }}</span>
                    </div>
                  </div>
                  <!-- <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small> -->
                </li>
              </ul>
            </VuePerfectScrollbar>
            <!-- <div class="
                        checkout-footer
                        fixed
                        pin-b
                        rounded-b-lg
                        text-primary
                        w-full
                        p-2
                        font-semibold
                        text-center
                        border
                        border-b-0
                        border-l-0
                        border-r-0
                        border-solid
                        border-grey-light
                        cursor-pointer">
                        <span>View All Notifications</span>
                    </div> -->
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <!-- <div class="text-right leading-tight hidden sm:block">
					 <p class="font-semibold">User</p>
					<small>Available</small>
				</div> -->

          <!-- 
				<vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
					<div class="con-img ml-3">
						<img
							v-if="activeUserImg"
							key="onlineImg"
							:src="activeUserImg"
							alt="user-img"
							width="40"
							height="40"
							class="rounded-full shadow-md cursor-pointer block" />
						<img
							v-else
							key="localImg"
							:src="require(`@/assets/images/portrait/small/avatar-s-27.png`)"
							alt="user-img"
							width="40"
							height="40"
							class="rounded-full shadow-md cursor-pointer block" />
					</div>
                    

					<vs-dropdown-menu>
						<ul style="min-width: 9rem">
						<vs-divider class="m-1"></vs-divider>
							<li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout">
                                <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon>
                                <span class="ml-2">Salir</span>
                            </li>
						</ul>
					</vs-dropdown-menu>
				</vs-dropdown> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Salir"
            placement="top-start"
          >
            <i
              class="fa fa-sign-out-alt cursor-pointer text-primary ml-5"
              @click="logout"
              style="font-size:1.5em"
            ></i>
          </el-tooltip>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import VxAutoSuggest from "@/components/vx-auto-suggest/VxAutoSuggest.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";
import { mapState } from "vuex";
import Config from "@/config";
import companiesService from "@/services/companies.service";

export default {
  name: "the-navbar",
  props: {
    navbarColor: {
      type: String,
      default: "#fff"
    }
  },
  data() {
    return {
      loading: false,
      companies: [],
      navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
      searchQuery: "",
      showFullSearch: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
        wheelPropagation: false,
        scrollYMarginOffset: 10
      },
      autoFocusSearch: false,
      showBookmarkPagesDropdown: false,
      loadingSelectCompany: false,

      page_companies: 1,
      next_scroll: true
    };
  },
  watch: {
    $route() {
      if (this.showBookmarkPagesDropdown)
        this.showBookmarkPagesDropdown = false;
    }
  },
  computed: {
    ...mapState(["company_default"]),
    no_exist_logo() {
      return (
        !this.company_default.logo ||
        `companies/${this.company_default.id}/` == this.company_default.logo
      );
    },
    url_logo() {
      return Config.url_files;
    },
    // HELPER
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    breakpoint() {
      return this.$store.state.breakpoint;
    },

    // NAVBAR STYLE
    classObj() {
      if (this.sidebarWidth == "default") return "navbar-default";
      else if (this.sidebarWidth == "reduced") return "navbar-reduced";
      else if (this.sidebarWidth) return "navbar-full";
    },
    // I18N
    getCurrentLocaleData() {
      const locale = this.$i18n.locale;
      if (locale == "en") return { flag: "us", lang: "English" };
      else if (locale == "pt") return { flag: "br", lang: "Portuguese" };
      else if (locale == "fr") return { flag: "fr", lang: "French" };
      else if (locale == "de") return { flag: "de", lang: "German" };
    },

    // BOOKMARK & SEARCH
    data() {
      return this.$store.state.navbarSearchAndPinList;
    },
    starredPages() {
      return this.$store.state.starredPages;
    },
    starredPagesLimited: {
      get() {
        return this.starredPages.slice(0, 10);
      },
      set(list) {
        this.$store.dispatch("arrangeStarredPagesLimited", list);
      }
    },
    starredPagesMore: {
      get() {
        return this.starredPages.slice(10);
      },
      set(list) {
        this.$store.dispatch("arrangeStarredPagesMore", list);
      }
    },

    // CART DROPDOWN
    cartItems() {
      return this.$store.state.eCommerce.cartItems.slice().reverse();
    },

    // PROFILE
    user_displayName() {
      return JSON.parse(localStorage.getItem("user")).name;
    },
    activeUserImg() {
      return false;
      //return JSON.parse(localStorage.getItem('company_default')).logo || this.$store.state.company_default.logo;
    }
  },
  methods: {
    scrollHandler(ev) {
      if (this.next_scroll) {
        this.next_scroll = false;
        this.page_companies++;
        this.getCompanies(this.page_companies, {}, true);
      }
    },
    getCompanies(page = 1, search = {}, pagination = false) {
      companiesService
        .getCompanies(page, search)
        .then(res => {
          if (!pagination) {
            this.companies = res.data.data.sort(function(a, b) {
              return a.company.name
                .split(" ")[0]
                .toLowerCase()
                .localeCompare(b.company.name.split(" ")[0].toLowerCase());
            });
          } else {
            if (res.data.data.length) {
              res.data.data.forEach(i => {
                this.companies.push(i);
              });
            } else {
              this.next_scroll = false;
            }
            this.next_scroll = true;
          }
        })
        .catch(error => {
          return false;
          if (error.response.status == 401) {
          }
        });
    },
    selectCompany(company) {
      this.loadingSelectCompany = true;
      companiesService
        .selectCompany(company)
        .then(res => {
          this.loadingSelectCompany = false;
          let defaultState = {
            countries: [],
            provinces: [],
            cantons: [],
            districts: [],
            identification_types: [
              { value: "01", text: "Cédula Física" },
              { value: "02", text: "Cédula Juridica" },
              { value: "03", text: "DIMEX" },
              { value: "04", text: "NITE" }
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
              qt: 0
            },
            current_currency: {
              id: 1,
              symbol: "$",
              name: ""
            },
            company_default: {},
            general_configurations: {},
            notifications: [
              {
                title: "Documento aceptado",
                body:
                  "El documento 000000001 fue rechazado por el ministerio de hacienda...",
                classes: "text-success"
              },
              {
                title: "Documento rechazado",
                body:
                  "El documento 000000002 fue aceptado por el ministerio de hacienda...",
                classes: "text-danger"
              }
            ],
            templates_email: [],
            terms: []
          };

          this.$store.commit("resetState", { defaultState: defaultState });

          let currency = JSON.parse(
            res.data.company.general_configurations.currency
          );
          this.$CurrencyFilter.setConfig({
            symbol: currency.symbol,
            thousandsSeparator: ".",
            fractionCount: 2,
            fractionSeparator: ",",
            symbolPosition: "front",
            symbolSpacing: false
          });

          this.$store.commit("updateCompanyDefault", {
            company_default: res.data.company
          });
          this.$store.commit("updateGeneralConfigurations", {
            general_configurations: res.data.company.general_configurations
          });
          this.$store.commit("updateCurrentCurrency", {
            current_currency: currency
          });
          this.$store.commit("updateUser", { user: res.data.user });

          /*this.$notify({
                    title: `La compañia ${company.name} fue seleccionada.`,
                    type: 'success'
                });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: `La compañia ${company.company.name} fue seleccionada.`,
            type: "success"
          });

          localStorage.removeItem("company_default");
          localStorage.setItem(
            "company_default",
            JSON.stringify(res.data.company)
          );

          //Si se esta en dashboard
          if (this.$route.name === "dashboard") {
            this.$router.push({ name: "re-dashboard" });
          } else if (this.$route.name === "re-dashboard") {
            this.$router.push({ name: "dashboard" });
          } else {
            this.$router.push({ name: "dashboard" });
          }
        })
        .catch(() => {
          this.loadingSelectCompany = false;
          /*this.$notify({
                    title: `Ocurrio un problema durante la selección.`,
                    type: 'error'
                });*/
          //JRA Cambio de notificacion por mensaje
          this.$message({
            showClose: true,
            message: `Ocurrio un problema durante la selección.`,
            type: "error"
          });
        });
    },
    updateLocale(locale) {
      this.$i18n.locale = locale;
    },
    showSidebar() {
      this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
    },
    selected(item) {
      this.$router.push(item.url);
      this.showFullSearch = false;
    },
    actionClicked(item) {
      // e.stopPropogation();
      this.$store.dispatch("updateStarredPage", {
        index: item.index,
        val: !item.highlightAction
      });
    },
    showNavbarSearch() {
      this.showFullSearch = true;
    },
    showSearchbar() {
      this.showFullSearch = true;
    },
    elapsedTime(startTime) {
      let x = new Date(startTime);
      let now = new Date();
      var timeDiff = now - x;
      timeDiff /= 1000;

      var seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      var minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      var hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      var days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      var years = timeDiff;

      if (years > 0) {
        return years + (years > 1 ? " Years " : " Year ") + "ago";
      } else if (days > 0) {
        return days + (days > 1 ? " Days " : " Day ") + "ago";
      } else if (hours > 0) {
        return hours + (hours > 1 ? " Hrs " : " Hour ") + "ago";
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? " Mins " : " Min ") + "ago";
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? `${seconds} sec ago` : "just now");
      }

      return "Just Now";
    },
    logout() {
      // // if user is logged in via auth0
      // if (this.$auth.profile) this.$auth.logOut();

      // // if user is looged in via firebase
      // const firebaseCurrentUser = firebase.auth().currentUser

      // if (firebaseCurrentUser) {
      //     firebase.auth().signOut().then(() => {
      //         this.$router.push('/pages/login')
      //         localStorage.removeItem('userInfo');
      //     })
      // }
      // // Change role on logout. Same value as initialRole of acj.js
      // this.$acl.change('admin')
      // localStorage.removeItem('userRole');

      let defaultState = {
        token: null,
        countries: [],
        provinces: [],
        cantons: [],
        districts: [],
        identification_types: [
          { value: "01", text: "Cédula Física" },
          { value: "02", text: "Cédula Juridica" },
          { value: "03", text: "DIMEX" },
          { value: "04", text: "NITE" }
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
          qt: 0
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
          {
            title: "Documento aceptado",
            body:
              "El documento 000000001 fue rechazado por el ministerio de hacienda...",
            classes: "text-success"
          },
          {
            title: "Documento rechazado",
            body:
              "El documento 000000002 fue aceptado por el ministerio de hacienda...",
            classes: "text-danger"
          }
        ],
        templates_email: [],
        terms: []
      };

      localStorage.clear();

      this.$store.commit("resetState", { defaultState: defaultState });

      this.$router.push({ name: "login" });
    },

    outside: function() {
      this.showBookmarkPagesDropdown = false;
    },

    // CART DROPDOWN
    removeItemFromCart(item) {
      this.$store.dispatch("eCommerce/toggleItemInCart", item);
    }
  },
  directives: {
    "click-outside": {
      bind: function(el, binding) {
        const bubble = binding.modifiers.bubble;
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener("click", handler);
      },

      unbind: function(el) {
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  },
  components: {
    VxAutoSuggest,
    VuePerfectScrollbar,
    draggable
  },
  created() {
    this.getCompanies();
  }
};
</script>
<style scoped>
.logo {
  max-width: 230px;
  max-height: 100px;
  width: auto;
  height: auto;
}

.con-vs-dropdown--menu {
  z-index: 401 !important;
}
</style>

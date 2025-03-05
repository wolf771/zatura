<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'
import { provideToast } from 'vue-toastification/composition'
import { watch } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { useWindowSize, useCssVar } from '@vueuse/core'
import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
  },
  beforeCreate() {
    // Set colors in theme
    const colors = [
      'primary',
      'secondary',
      'success',
      'info',
      'warning',
      'danger',
      'light',
      'dark',
    ]

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(
        `--${colors[i]}`,
        document.documentElement,
      ).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(
        useCssVar(
          `--breakpoint-${breakpoints[i]}`,
          document.documentElement,
        ).value.slice(0, -2),
      )
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  },
  setup() {
    const { skinClasses } = useAppConfig()

    // If skin is dark when initialized => Add class to body
    document.body.classList.add('semi-dark-layout')
    // if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    // store.dispatch('auth/me')
    store.dispatch('app/getInitData')
    // store.dispatch('auth/getInitData')
    return {
      skinClasses,
    }
  },
}
</script>

<style>
/* Table with divs */
.rTable {
  display: block;
  width: 100%;
}
.rTableHeading,
.rTableBody,
.rTableFoot,
.rTableRow {
  clear: both;
}
.rTableHead,
.rTableFoot {
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
}

body:not(.dark-layout) .rTableHead {
  background-color: rgb(233, 233, 233);
}
.rTableCell,
.rTableHead {
  float: left;
  padding: 5px 10px;
}

body:not(.dark-layout) .rTableRowOdd {
  background-color: rgb(243, 243, 243);
}

.rTableRow {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 28px 0;
  position: relative;
  flex-wrap: wrap;
}

.rTableHead {
  height: 40px;
}

.rTable:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: ' ';
  clear: both;
  height: 0;
}

.table_economic_activity {
  width: 8%;
}

.table_cabys_code_ac {
  width: 8%;
}

.table_cabys_code {
  width: 16%;
}

.table_name {
  width: 25%;
  min-width: 200px;
}
.table_quantity {
  width: 15%;
  min-width: 200px;
}
.table_amount {
  width: 15%;
  min-width: 200px;
}
.table_discount {
  width: 15%;
  min-width: 200px;
}
.table_tax {
  width: 15%;
  position: relative;
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: 200px;
}
.table_total {
  width: 15%;
  min-width: 200px;
}
@media only screen and (max-width:1400px) {
  .table_quantity, .table_amount, .table_discount, .table_tax, .table_total {
  width: 15%;
   min-width: 100px;
}
.table_tax{
  flex-wrap: nowrap;
}
.contact{
    padding: 0%;
    padding-bottom: 20px;
    margin-left: 30px;
    position: absolute;
  }
}
</style>

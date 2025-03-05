<template>
  <b-nav-item @click="skin = isDark ? 'light' : 'dark'">
    <feather-icon
      size="21"
      :icon="`${isDark ? 'Sun' : 'Moon'}Icon`"
    />
  </b-nav-item>
</template>

<script>
import useAppConfig from '@core/app-config/useAppConfig'
import { computed } from '@vue/composition-api'
import { BNavItem } from 'bootstrap-vue'

export default {
  components: {
    BNavItem,
  },
  setup(props, { root: { $store } }) {
    const { skin } = useAppConfig()

    const isDark = computed(() => skin.value === 'dark')
    // Get exchange rate of state
    const exchangeRate = computed(
      () => $store.state.auth?.company?.exchange_rate ?? 0,
    )

    return { skin, isDark, exchangeRate }
  },
}
</script>
<style scoped>
  .nav-link{
    display: flex;
    align-items: center;
  }
</style>

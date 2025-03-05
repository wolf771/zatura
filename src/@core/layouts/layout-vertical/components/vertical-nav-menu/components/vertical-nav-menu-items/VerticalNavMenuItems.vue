<template>
  <ul>
    <component
      :is="resolveNavItemComponent(item)"
      v-for="(item, index) in items"
      :key="index || item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { provide, ref } from '@vue/composition-api'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
import VerticalNavMenuLinkWithButton from '../vertical-nav-menu-link-with-button/VerticalNavMenuLinkWithButton.vue'
import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'
import VerticalNavMenuSpacing from '../vertical-nav-menu-spacing'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    VerticalNavMenuLinkWithButton,
    VerticalNavMenuGroup,
    VerticalNavMenuSpacing,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup() {
    provide('openGroups', ref([]))

    return {
      resolveNavItemComponent,
    }
  },
}
</script>

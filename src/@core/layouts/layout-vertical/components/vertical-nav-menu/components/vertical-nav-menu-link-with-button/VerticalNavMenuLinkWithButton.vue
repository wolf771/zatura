<template>
  <li
    v-if="canViewVerticalNavMenuLink(item)"
    class="nav-item"
    :class="{
      'active': isActive,
      'disabled': item.disabled
    }"
  >
    <b-link
      v-bind="linkProps"
      class="d-flex align-items-center"
    >
      <feather-icon :icon="item.icon || 'CircleIcon'" />
      <span class="menu-title text-truncate">{{ (item.title) }}</span>
      <b-badge
        v-if="item.actionIcon"
        pill
        :variant="item.tagVariant || 'link'"
        class="ml-auto nav-item-action text-success"
        @click.stop.prevent="handleAction"
      >
        <svg-icon
          v-b-tooltip.hover.bottom="'Nueva Factura'"
          :icon="item.actionIcon || 'path'"
          type="mdi"
          :path="path"
        />
      </b-badge>
    </b-link>
  </li>
</template>

<script>
import { useUtils as useAclUtils } from '@core/libs/acl'
import { BLink, BBadge } from 'bootstrap-vue'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlusCircle } from '@mdi/js'
import useVerticalNavMenuLink from './useVerticalNavMenuLinkWithButton'
import mixinVerticalNavMenuLink from './mixinVerticalNavMenuLinkWithButton'

export default {
  components: {
    BLink,
    BBadge,
    SvgIcon,
  },
  mixins: [mixinVerticalNavMenuLink],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      path: mdiPlusCircle,
    }
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(props.item)
    const { t } = useI18nUtils()
    const { canViewVerticalNavMenuLink } = useAclUtils()

    return {
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuLink,

      // i18n
      t,
    }
  },
  created() {

  },
  methods: {
    handleAction() {
      switch (this.item.action) {
        case 'new-document':
          this.$router.push({
            name: 'document',
            params: { type: this.item.type, action: 'new' },
          })
          break
        default:
          break
      }
    },
  },

}
</script>

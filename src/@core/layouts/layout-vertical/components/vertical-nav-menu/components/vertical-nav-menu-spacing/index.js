import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { useUtils as useAclUtils } from '@core/libs/acl'

const { t } = useI18nUtils()
const { canViewVerticalNavMenuHeader } = useAclUtils()

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    const span = h('span', {}, t(''))
    //const icon = h('feather-icon', { props: { icon: 'MoreHorizontalIcon', size: '18' } })
    //if (this.item.title === 'spacing') {
    return h('li', { class: 'spacing-menu-item' }, [span])
    //}
    //return h()
  },
}

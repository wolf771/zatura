export default {
  namespaced: true,
  state: {
    multiActionSidebarVisible: false,
    componentData: {
      type: '',
      action: '',
    },
  },
  getters: {},
  mutations: {
    SET_ACTION(state, componentData) {
      state.componentData.type = componentData.type
      state.componentData.action = componentData.action
      state.multiActionSidebarVisible = true
    },
    SET_VISIBILITY(state, visible) {
      state.multiActionSidebarVisible = visible
    },
  },
  actions: {
    setAction({ commit }, componentData) {
      commit('SET_ACTION', componentData)
    },
    updateVisibility({ commit }, visible) {
      commit('SET_VISIBILITY', visible)
    },
  },
}

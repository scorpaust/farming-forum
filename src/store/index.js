import actions from "../store/actions"
import { createStore } from 'vuex'
import getters from "../store/getters"
import mutations from "../store/mutations"
import state from "../store/state"

export default createStore({
  state,
  getters,
  actions,
  mutations
})


import { docToResource, findById, makeAppendChildToParentMutation, upsert } from "@/helpers"

export default {
  clearItems(state, {modules = []}) {
    modules.forEach(thismodule => {
      state[thismodule].items = []
    })
  },
  setItem(state, {resource, item}) {
    upsert(state[resource].items, docToResource(item))
  },
  appendUnsubscribe(state, {unsubscribe}) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes(state) {
    state.unsubscribes = []
  },
}


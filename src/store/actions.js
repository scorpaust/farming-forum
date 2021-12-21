import { FieldValue, arrayUnion, collection, doc, getDoc, getDocs, increment, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from "firebase/firestore"
import { docToResource, findById } from "@/helpers"

import { db } from '../main'
import state from "@/store/state"

export default { 
    
    
    fetchItem ({state, commit}, { id, emoji, resource, handleUnsubscribe = null, once = false, onSnapshot = null}) {
      console.log('🔥', emoji, id)
      return new Promise((res) => {
        const docRef = doc(db, `${resource}/${id}`);
        const unsubscribe = getDoc(docRef).then((doc) => {
        if (once) res(unsubscribe)
        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, item })
          if (typeof onSnapshot === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            onSnapshot({ item: { ...item }, previousItem, isLocal })
          }
          res(item)
        } else {
          res(null)
        }
      })

        if (handleUnsubscribe) {
          handleUnsubscribe(unsubscribe)
        } else {
          commit('appendUnsubscribe', { unsubscribe })
        }
      })
    },
    fetchItems({ dispatch }, { ids, resource, emoji, onSnapshot = null }) {
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji, onSnapshot })))
      
    },
    async unsubscribeAllSnapshots({state, commit}) {
      state.unsubscribes.forEach((unsubscribe) => `${unsubscribe}()`)
      commit('clearAllUnsubscribes')
    }
}
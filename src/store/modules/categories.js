import {collection, getDocs} from "firebase/firestore"

import { db } from "../../main"

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏷', resource: 'categories', id }, {root: true}),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' }, {root: true}),
    fetchAllCategories({ commit }) {
      return new Promise((res) => {
        const categories = getDocs(collection(db, "categories")).then((snapshot) => {
          const cat = snapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data()}
            commit('setItem', { resource: 'categories', item}, {root: true})
            return item
          })
          res(cat)
        })    
            
        })  
    },
  }
}
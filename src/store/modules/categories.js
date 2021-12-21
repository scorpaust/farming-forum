import {collection, getDocs} from "firebase/firestore"
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'

import { db } from "../../main"

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ emoji: '🏷', resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({ emoji: '🏷', resource: 'categories' }),
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
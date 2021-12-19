import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore"

import { db } from '../../main'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    },
  },
  actions: {
    initAuthentication({state, dispatch, commit}) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((res) => {
        const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
          this.dispatch('auth/unsubscribeAuthUserSnapshot')
          if (user) {
            await this.dispatch('auth/fetchAuthUser')
            res(user)
          } else {
            res(null)
          }
        })
        commit("setAuthObserverUnsubscribe", unsubscribe)
      })
    },

    async registerUserWithEmailAndPassword({ dispatch }, {avatar = null, email, name, username, password }) {
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, {root: true} )
    },
    signInWithEmailAndPassword(context, {email, password}) {
      const auth = getAuth()
      return signInWithEmailAndPassword(auth, email, password)
    },
    async signInWithGoogle({dispatch, commit}) {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const response = await signInWithPopup(auth, provider)
      const user = response.user;
      const userRef = doc(db, 'users', user.uid)
      await getDoc(userRef).then((userDoc) => {
        if (!userDoc.exists)
          return dispatch('users/createUser', {id: user.uid, email: user.email, name: user.displayName, username: user.email, avatar: user.photoURL}, {root: true} )
        else 
          commit('setAuthId', user.uid)
      })
    },
    async signOut({commit}) {
      await getAuth().signOut()
      commit('setAuthId', null)
    },

    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = await getAuth().currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', { emoji:'🙋', resource: 'users', id: userId, handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe)
      }}, {root: true} )
      commit('setAuthId', userId)
    },
    async fetchAuthUsersPosts ({ commit, state }) {
      const postsRef = collection(db, "posts")
      const posts = await getDocs(query(postsRef, where("userId", "==", state.authId)))
      posts.forEach(item => {
        commit('setItem', { resource: 'posts', item }, {root: true})
      })
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)        
      }
    }
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    },
  }
}
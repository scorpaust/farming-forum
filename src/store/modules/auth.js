import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, updateEmail } from "firebase/auth"
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

import { db } from "../../main"
import { mystorage } from "../../main"
import useNotifications from "@/composables/useNotifications"

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
    async updateEmail({state}, {email}) {
      return updateEmail(getAuth().currentUser, email)
    },
    async reauthenticate({state}, {email, password}) {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
    },
    initAuthentication({state, dispatch, commit}) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((res) => {
        const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
          dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
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
      avatar = await dispatch('uploadAvatar', {authId: result.user.uid, file: avatar})
      await dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
    },
    async uploadAvatar({state}, {authId, file, filename}) {
      if (!file) return null
      authId = authId || state.authId
      filename = filename || file.name
      try {
        const imageref = ref(mystorage, `uploads/${authId}/images/${Date.now()}-${filename}`)
        const snapshot = await uploadBytesResumable(imageref, file)
        return getDownloadURL(snapshot.ref)   
      }catch(error) {
        const { addNotification } = useNotifications()
        addNotification({message: 'Error uploading profile image.', type: 'error'})
      }
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
      const userId = getAuth().currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', { emoji:'🙋', resource: 'users', id: userId, handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe)
      }}, {root: true} )
      commit('setAuthId', userId)
    },
    async fetchAuthUsersPosts ({ commit, state }, {lastPost}) {
      const postsRef = await collection(db, "posts")
      let postsQuery = await getDocs(query(postsRef, where("userId", "==", state.authId), orderBy("publishedAt", "desc"), limit(10)))
      const posts = []
      if (lastPost) {
        const next = query(postsQuery.query, startAfter(lastPost))
        const posts = await getDocs(next)
        posts.forEach(item => {
        commit('setItem', { resource: 'posts', item }, {root: true})
        })
      } else {
        const posts = postsQuery
        posts.forEach(item => {
          commit('setItem', { resource: 'posts', item }, {root: true})
          })
      }
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (this.state.authUserUnsubscribe) {       
        this.state.authUserUnsubscribe()
      }
      commit('setAuthUserUnsubscribe', null) 
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
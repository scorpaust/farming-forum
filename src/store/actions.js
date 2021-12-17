import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, getRedirectResult, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { arrayUnion, collection, doc, getDoc, getDocs, increment, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { docToResource, findById } from "@/helpers"

import { db } from '../main'
import state from "@/store/state"

export default { 
    async createPost({commit, state}, post) {
      post.userId  = state.authId
      post.publishedAt = serverTimestamp()
      const batch = writeBatch(db);
      const postRef = doc(collection(db, "posts"))
      const threadRef = doc(db, "threads", post.threadId) 
      const userRef = doc(db, "users", state.authId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(state.authId)
      })
      batch.update(userRef, {
        postsCount: increment(1)
      })
      await batch.commit();
      const newPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: {...newPost.data(), id: newPost.id} })
      commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async updatePost({commit, state}, { text, id}) {
      const post = { 
        text,
        edited: {
          at: serverTimestamp(),
          by: state.authId,
          moderated: false
        }
      }
      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, post)
      const updatedPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: updatedPost })
    },
    async createThread({commit, state, dispatch}, {text, title, forumId}) {
      const userId = state.authId
      const publishedAt = serverTimestamp()
      const batch = writeBatch(db)
      const threadRef = doc(collection(db, "threads"))
      const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
      const userRef = doc(db, "users", userId)
      const forumRef = doc(db, "forums", forumId)
      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await getDoc(threadRef)
      commit('setItem', { resource: 'threads', item: {...newThread.data(), id: newThread.id}})
      commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
      commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
      dispatch('createPost', { text, threadId: threadRef.id })
      return findById(state.threads, threadRef.id)
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      let newThread = { ...thread, title }
      let newPost = { ...post, text }
      const threadRef = doc(db, 'threads', id)
      const postRef = doc(db, 'posts', post.id)
      const batch = writeBatch(db)
      batch.update(threadRef, newThread)
      batch.update(postRef, newPost)
      await batch.commit()
      newThread = await getDoc(threadRef)
      newPost = await getDoc(postRef)
      commit('setItem', { resource: 'threads', item: newThread })
      commit('setItem', { resource: 'posts', item: newPost })
      return docToResource(newThread)
    },
    async registerUserWithEmailAndPassword({ dispatch }, {avatar = null, email, name, username, password } ) {
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await dispatch('createUser', { id: result.user.uid, email, name, username, avatar })
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
        if (userDoc != null)
          return dispatch('createUser', {id: user.uid, email: user.email, name: user.displayName, username: user.email, avatar: user.photoURL})
        else 
          commit('setAuthId', user.uid)
      })
    },
    async signOut({commit}) {
      await getAuth().signOut()
      commit('setAuthId', null)
    },
    async createUser({commit}, {id, email, name, username, avatar = null}) {
      const registeredAt = serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {avatar, email, name, username, usernameLower, registeredAt }
      const userRef = doc(db, 'users', id)
      await setDoc(userRef, user)
      const newUser = await getDoc(userRef)
      commit('setItem', { resource: 'users', item: newUser })
      return docToResource(newUser)
    },
    updateUser ({ commit }, user) {
      commit('setItem', { resource: 'users', item: user })
    },
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏷', resource: 'categories', id }),
  
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏁', resource: 'forums', id }),
    
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '📄', resource: 'threads', id }),
    
    fetchPost: ({dispatch}, { id }) => dispatch('fetchItem', { emoji: '💬', resource: 'posts', id }),
    
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id }),

    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = getAuth().currentUser?.uid
      if (!userId) return
      dispatch('fetchItem', { resource: 'users', id: userId, emoji:'🙋', handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe)
      }})
      commit('setAuthId', userId)
    },
    fetchAllCategories({ commit }) {
      return new Promise((res) => {
        const categories = getDocs(collection(db, "categories")).then((snapshot) => {
          const cat = snapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data()}
            commit('setItem', { resource: 'categories', item})
            return item
          })
          res(cat)
        })    
            
        })  
    },
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' }),
    
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '📬' }),
    
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),
    
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }),
    
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' }),
    
    fetchItem ({state, commit}, { id, emoji, resource, handleUnsubscribe = null}) {
      console.log('🔥', emoji, id)
      return new Promise((res) => {
        const docRef = doc(db, `${resource}/${id}`);
        const docSnap = getDoc(docRef).then((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit("setItem", { resource, id, item });
          res(item)
        })
        if (handleUnsubscribe) {
          handleUnsubscribe(docSnap)
        } else {
          commit('appendUnsubscribe', { docSnap })
        }
      })
    },
    fetchItems({ dispatch }, { ids, resource, emoji }) {
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
      
    },
    async unsubscribeAllSnapshots({state, commit}) {
      state.unsubscribes.forEach((unsubscribe) => `${unsubscribe}()`)
      commit('clearAllUnsubscribes')
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
}
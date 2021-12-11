import { arrayUnion, collection, doc, getDoc, getDocs, serverTimestamp, writeBatch } from "firebase/firestore"

import { db } from '../main'
import { findById } from "@/helpers"
import state from "@/store/state"

export default { 
    async createPost({commit, state}, post) {
      post.userId  = state.authId
      post.publishedAt = serverTimestamp()
      const batch = writeBatch(db);
      const postRef = doc(collection(db, "posts"))
      const threadRef = doc(db, "threads", post.threadId) 
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(state.authId)
      })
      await batch.commit();
      const newPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: {...newPost.data(), id: newPost.id} })
      commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
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
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setItem', { resource: 'threads', item: newThread })
      commit('setItem', { resource: 'posts', item: newPost })
      return newThread
    },
    updateUser ({ commit }, user) {
      commit('setItem', { resource: 'users', item: user })
    },
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏷', resource: 'categories', id }),
  
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏁', resource: 'forums', id }),
    
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '📄', resource: 'threads', id }),
    
    fetchPost: ({dispatch}, { id }) => dispatch('fetchItem', { emoji: '💬', resource: 'posts', id }),
    
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id }),

    fetchAuthUser: ({ dispatch }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id: state.authId }),

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
    
    fetchItem ({state, commit}, { id, emoji, resource}) {
      console.log('🔥', emoji, id)
      return new Promise((res) => {
        const docRef = doc(db, `${resource}/${id}`);
        const docSnap = getDoc(docRef).then((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit("setItem", { resource, id, item });
          res(item)
        })
      })
    },
    fetchItems({ dispatch }, { ids, resource, emoji }) {
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
      
    }
}
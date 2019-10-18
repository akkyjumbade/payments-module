import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      order: null,
   },
   mutations: {
      set_order(state, payload) {
         state.order = payload
      }
   },
   actions: {
      async setNewOrder(context, data) {
         context.commit('set_order', data)
      }
   },
   modules: {
   }
})

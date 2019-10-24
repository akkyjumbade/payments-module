import Vue from 'vue'
import Vuex from 'vuex'
import recharge from './recharge'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        order: null,
        user: null,
        gateway: null,
        payment_methods: null,
        payment_response: null,
    },
    mutations: {
        set_order(state, payload) {
            state.order = payload
        },
        set_payment_methods(state, payload) {
            state.payment_methods = payload
        },
        set_gateway(state, payload) {
            state.gateway = payload
        },
        set_payment_response(state, payload) {
            state.payment_response = payload
        },
        set_customer(state, payload) {
            state.user = payload
        },
    },
    actions: {
        async setNewOrder(context, data) {
            context.commit('set_order', data)
        },
        async setPaymentResponse(context, data) {
            context.commit('set_payment_response', data)
        },
        async setCustomer(context, data) {
            context.commit('set_customer', data)
        },
        async doMobileRecharge(context, data) {
            const response = await recharge(data)
            context.commit('do_mobile_recharge', response)
        },
        async setGatewayApi(context, apiKey) {
            var options = {
                key: apiKey,
                currency: "INR",
            };
            const api = new window.Razorpay(options);
            context.commit('set_gateway', api)
            api.once('ready', ({methods}) => context.commit('set_payment_methods', methods))
        },
    },
    modules: {
    }
})
store.dispatch('setGatewayApi', 'rzp_live_nXRYq90cXI0BAG')
if(window.customer) {
    store.dispatch('setCustomer', window.customer)
}
store.dispatch('setCustomer', {
    name: 'Akshay Jumbade',
    email: 'akshay.jumbade@hotmail.com',
    phone: '9930207580',
    orderNote: 'Order note'
})
export default store

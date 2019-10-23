import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        order: null,
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
    },
    actions: {
        async setNewOrder(context, data) {
            context.commit('set_order', data)
        },
        async setGatewayApi(context, apiKey) {
            var options = {
                key: apiKey,
                // amount
                currency: "INR",
                // order_id: this.orderId,
                //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
                handler: response => {
                    context.commit('set_payment_response', response);
                },
                notes: {
                    // address: context.state.order
                }
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
export default store

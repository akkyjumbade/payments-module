import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import PaymentsModule from '../views/PaymentsModule.vue'

Vue.use(VueRouter)

const routes = [
   {
      path: '/',
      name: 'home',
      component: PaymentsModule,
      children: [
         {
            path: '/recharge',
            name: 'recharge',
            component: () => import('../views/MobileRecharge.vue')
         },
         {
            path: '/electricity',
            name: 'electricity',
            component: () => import('../views/ElectricityPayment.vue'),
         },
         {
            path: '/payment-done/:service/:id',
            name: 'paymentDone',
            component: () => import('../views/PaymentDone.vue'),
         },
         {
            path: '/dth',
            name: 'dth',
            component: () => import('../views/DTHRecharge.vue')
         },
         {
            path: '/broadband',
            name: 'broadband',
            component: () => import('../views/Broadband.vue')
         },
         {
            path: '/gas',
            name: 'gas',
            component: () => import('../views/GasPayment.vue')
         },
         {
            path: '/sendmoney',
            name: 'sendmoney',
            component: () => import('../views/MoneyTransfer.vue')
         },
      ]
   },
   {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/Payment.vue')
   },
   {
      path: '/payment_response',
      name: 'payment_response',
      component: () => import('../views/PaymentResponse.vue')
   },
]

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
})

export default router

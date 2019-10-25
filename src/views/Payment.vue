<template>
   <div class="page">
      <div class="container">
         <main v-if="order && user && paymentMethods" >
            <h1 class="title">Select a Payment Mode</h1>
            <PaymentForm class="formcomponent" :order="order" :user="user" :payment-methods="paymentMethods" />
         </main>
         <div v-else class="loader">
            Loading...
         </div>
      </div>
   </div>
</template>
<script>
// import gateway from '../gateway'
import PaymentForm from '../components/PaymentForm'
export default {
   components: {
      PaymentForm,
   },
   computed: {
      order() {
         return this.$store.state.order
      },
      paymentMethods() {
         return this.$store.state.payment_methods
      },
      user() {
         return this.$store.state.user
      },
   },
   methods: {
      // async
   },
   mounted() {

   }
}
</script>
<style lang="scss" scoped>
.title {
   font-size: 2.5rem;
}
.formcomponent {
   width: 50%;
   @media screen and (max-width: 800px) {
      width: 100%;
   }
}
</style>

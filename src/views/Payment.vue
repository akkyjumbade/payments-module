<template>
   <div class="page">
      <div class="container">
         <h1 class="title">Select a Payment Mode</h1>
         <PaymentForm class="formcomponent" />
      </div>
   </div>
</template>
<script>
import PaymentForm from '../components/PaymentForm'
export default {
   components: {
      PaymentForm,
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

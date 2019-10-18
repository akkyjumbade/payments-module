<template>
  <div class="payment_response">
     <div class="container">
        <div v-if="succes" class="alert alert-success">
         <h3 class="">Transaction successful</h3>
         <p>

         </p>
      </div>
      <div v-else class="alert alert-danger">
         <h3 class="">Transaction failed</h3>
         <p>
            Something went wrong
         </p>
      </div>
     </div>
  </div>
</template>

<script>
export default {
   components: {
      // HelloWorld
   },
   data: function () {
      return {
         succes: false
      }
   }
};
</script>
<style lang="scss" scoped>
.alert {
   text-align: left;
   h1, h2, h3, h4 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
   }
}
</style>

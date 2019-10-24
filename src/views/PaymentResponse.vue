<template>
  <div class="payment_response">
     <div class="container">
        <div v-if="response && response.statusCode == 'success'" class="alert alert-success">
         <h3 class="">Transaction successful</h3>
         <p>
            {{response}}
         </p>
      </div>
      <div v-else class="alert alert-danger">
         <h3 class="">Transaction failed</h3>
         <p>
            {{response}}
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
         success: false
      }
   },
   computed: {
      response() {
         return this.$store.state.payment_response
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

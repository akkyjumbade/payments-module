<template>
   <div class="payment_done_page">
      {{$route.params}}
      <div class="alert alert-danger">
         {{order}}
      </div>
      <div class="alert alert-success">
         {{order}}
      </div>
   </div>
</template>
<script>
export default {
   props: {

   },
   data: function () {
      return {
         order: null
      }
   },
   methods: {
      async fetchOrder(id) {
         try {
            const {data} = await this.$http.get('wp-json/app/fetch_order/'+id)
            if(data && data.ok) {
               this.order = data.data
            }
         } catch (error) {
            console.log({error})
         }
      }
   },
   created( ) {
      this.fetchOrder(this.$router.params.id)
   }
}
</script>

<template>
   <div>
      <DTHRechargeForm v-if="operators" :operators="operators" />
   </div>
</template>
<script>
import DTHRechargeForm from "../components/DTHRechargeForm";
export default {
   components: {
      DTHRechargeForm
   },
   data: function() {
      return {
         operators: null
      }
   },
   methods: {
      async fetchProviders() {
         try {
            const { data } = await this.$http.get(
               "/wp-json/app/fetch-operators/dth"
            );
            if (data.ok) {
               this.operators = data.data;
            } else {
               console.warn({ data });
            }
         } catch (error) {
            console.warn({ error });
         }
      }
   },
   created() {
      this.fetchProviders()
   }
};
</script>

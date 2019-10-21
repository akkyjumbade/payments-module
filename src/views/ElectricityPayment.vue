<template>
  <div>
      <div class="container">
         <div class="row">
            <div class="col-sm-6">
               <ElectricityPaymentForm :user="user" :operators="operators" />
            </div>
         </div>
      </div>
  </div>
</template>
<script>
import ElectricityPaymentForm from "../components/ElectricityPaymentForm";
export default {
  components: {
    ElectricityPaymentForm
  },
  data: function() {
    return {
      operators: null,
      user: {
         name: 'Akshay Jumbade',
         email: 'akkyjumbade@gmail.com',
         phone: '9930207580',
      },
    };
  },
  methods: {
    async fetchOperators() {
      try {
        const { data } = await this.$http.get(
          "/wp-json/app/fetch_electricity_operators"
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
     this.fetchOperators()
  }
};
</script>

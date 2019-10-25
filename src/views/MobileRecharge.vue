<template>
  <div>
    <main v-if="operators && user">
       <MobileRechargeForm :user="user" v-if="operators" :operators="operators" />
    </main>
    <Loader v-else />
  </div>
</template>
<script>
import MobileRechargeForm from "../components/MobileRechargeForm";
import Loader from "../components/Loader";
export default {
  components: {
    MobileRechargeForm,
    Loader,
  },
  data: function() {
    return {
      operators: null
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async fetchOperators() {
      try {
        const { data } = await this.$http.get(
          "/wp-json/app/fetch-operators/mobile"
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
    this.fetchOperators();
  }
};
</script>

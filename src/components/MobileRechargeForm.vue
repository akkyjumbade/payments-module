<template>
  <form @submit.prevent="onSubmit" class="mobile_recharge_form">
    <dialog :open="openPlansModal" class="modal-dialog plans_dialog">
      <ul class="list-group">
        <li class="list-group-item">{{plans}}</li>
      </ul>
    </dialog>
    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label for="phone">Mobile Number (+91)</label>
            <input v-model="values.phone" name="phone" class="form-control" />
          </div>
        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label for="phone">Operator</label>
            <select v-model="values.operator" name="operator" id="operator" class="form-control">
              <option value>Select Operator</option>
              <option
                v-for="(option, i) in operators"
                :key="i"
                :value="option.id"
                v-text="option.name"
              ></option>
            </select>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input v-model="values.amount" name="amount" class="form-control" placeholder="Amount" />
            <div>
              <a href="#" @click.prevent="showPlans">View plans</a>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group text-right">
        <button class="btn btn-primary">Recharge</button>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    operators: {
      type: [Array, Object],
      required: true
    },
    user: {
      type: [Object],
      required: true
    },
    orderNote: {
      type: [String],
      default: "Mobile recharge"
    }
  },
  data: function() {
    return {
      values: {},
      isSubmitting: false,
      openPlansModal: false,
      plans: [],
      errors: null
    };
  },
  methods: {
    async generateOrder(values) {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await this.$http.post(
            "/wp-json/app/create-order/mobile",
            values
          );
          if (data.ok) {
            resolve(data.data);
          } else {
            reject(data);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    showPlans() {
      this.openPlansModal = true;
    },
    async onSubmit() {
      // return;
      const values = {
        ...this.values
      };
      const order = await this.generateOrder(values);
      this.$store.dispatch("setNewOrder", {
        ...this.values,
        order_id: order,
        service: 'mobile'
      });
      this.$router.push("payment");
    },
    async fetchPlans() {
      try {
        const { data } = await this.$http.get("/wp-json/app/get_mobile_plans");
        this.plans = data.data;
      } catch (error) {
        console.log({ error });
      }
    }
  },
};
</script>
<style scoped>
.plans_dialog {
  border: 0;
  box-shadow: 0 0 150px #ccc;
}
</style>

<template>
  <div class="mobile_recharge_form">
    <div >
      <div class="form-group">
        <label for>Select Operator</label>
        <select v-model="values.operator" class="form-control">
          <option
            v-for="(option, i) in operators"
            :key="i"
            :value="option.id"
            v-text="option.name"
          ></option>
        </select>
      </div>
      <div class="form-group" style="max-width: 200px">
        <label>Customer number</label>
        <input
          v-model="values.customer_id"
          name="customer_number"
          required
          placeholder="Customer number"
          class="form-control"
        />
      </div>
      <div class="form-group" style="max-width: 200px">
        <label>Billing Unit</label>
        <input
          v-model="values.billing_unit"
          name="billing_unit"
          required
          placeholder="Billing Unit"
          class="form-control"
        />
      </div>
      <div class="form-group" style="max-width: 100px">
        <label>Amount</label>
        <input
          v-model="values.amount"
          name="amount"
          type="number"
          min="1"
          required
          placeholder
          class="form-control"
        />
      </div>
      <button class="btn btn" @click.prevent="onPaymentClicked">Proceed to Pay</button>
    </div>
  </div>
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
      default: "Order note"
    }
  },
  data: function() {
    return {
      values: [],
      orderId: null,
      api: null,
      paymentId: null
    };
  },
  methods: {
    async fetchNewOrder() {
      let orderIdFromSession = localStorage.getItem("order_id");
      if (orderIdFromSession) {
        this.orderId = orderIdFromSession;
        return false;
      } else {
        try {
          const { data } = await this.$http.get(
            "/wp-json/app/electricity_order_create"
          );
          console.log("order");
          console.log({ data });
          this.orderId = data.data;
          localStorage.setItem("order_id", this.orderId);
          console.log("order store");
        } catch (error) {
          console.log({ error });
        }
      }
    },
    async onPaymentClicked() {
      var options = {
        key: "rzp_live_nXRYq90cXI0BAG", // Enter the Key ID generated from the Dashboard
        amount: this.values.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
        currency: "INR",
        order_id: this.orderId,
        //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
        handler: response => {
          this.doBillPayment(response);
        },
        prefill: {...this.$props.user, contact: this.$props.user.phone},
        notes: {
          address: this.$props.orderNote
        },
      };
      this.api = new window.Razorpay(options);
      this.api.open();
    },
    async doBillPayment(response) {
       let formdata = {
          ...this.values,
          ...response,
          user: this.$props.user,
          orderId: this.orderId,
       }
      try {
        const paymentURL = "/wp-json/app/do_electricity_payment_now";
        const { data } = await this.$http.post(paymentURL, formdata);
        console.log({ data });
        if (data && data.ok) {
           this.$router.push({
              name: 'paymentDone',
              params: {
                 service: 'electricity',
                 id: data.transaction_id
              }
           })
          // wow
        }
      } catch (error) {
        console.log({ error });
      }
    },
    async doPayment() {
      try {
        const { data } = await this.$http.get(
          "/wp-json/app/pay_electricity_bill"
        );
        console.log("payment response");
        console.log({ data });
        console.log("payment to gateway");
      } catch (error) {
        console.log({ error });
      }
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>

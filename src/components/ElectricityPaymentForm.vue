<template>
  <div class="mobile_recharge_form">
    <div v-if="operators">
      <div class="form-group">
        <label for>Select Operator</label>
        <v-select :options="operators" v-model="values.provider_id" label="name" value="id">
          <template slot="option" slot-scope="option">
            {{ option.name }}
          </template>
        </v-select>
      </div>
      <div class="row">
        <div class="form-group col-xs-8">
          <label>Customer number</label>
          <input
            v-model="values.customer_id"
            name="customer_id"
            required
            placeholder="Customer number"
            class="form-control"
          />
        </div>
        <div class="form-group col-xs-4">
          <label>Billing Unit</label>
          <input
            v-model="values.billing_unit"
            name="billing_unit"
            required
            placeholder="Billing Unit"
            class="form-control"
          />
        </div>
      </div>
      <!-- <div class="checkbox">
        <label>
          <input
            type="checkbox"
            v-model="values.redeemFromWallet"
            name="redeemFromWallet"
            id="redeemFromWallet"
          />
          <span>Redeem from wallet</span>
        </label>
      </div> -->
      <button class="btn btn" :class="{'loading': loading}" :disabled="loading" @click.prevent="onPaymentClicked">Proceed to Pay</button>
    </div>
  </div>
</template>
<script>
// import { async } from 'q';
// import Axios from 'axios'
const popupCustomClass = {
    header: 'text-left',
    title: 'text-left',
    content: 'text-left text',
    footer: 'text-left text',
    input: 'form-control',
}
import Swal from 'sweetalert2'
Swal.mixin({
    animation: false,
    buttonsStyling: false,
    showConfirmButton: false,
    customClass: popupCustomClass
})
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
      values: {},
      orderId: null,
      loading: false,
      billDetails: null,
      api: null,
      paymentId: null
    };
  },
  methods: {
    async generateOrder() {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.$http.get(
                    "/wp-json/app/electricity_order_create"
                );
                if(data.ok) {
                    resolve(data.data)
                } else {
                    reject(data)
                }
            } catch (error) {
                reject(error)
            }
        })
    },
    async fetchBill() {
        return new Promise(async (resolve, reject) => {
            try {
                // const apiToken = window.apiToken ? window.apiToken: ''
                const {data} = await this.$http.post('wp-json/app/fetch-bill', this.values)
                console.log({data})
                if(data.ok) {
                    return resolve(data.data)
                } else {
                    return reject(data)
                }
            } catch (error) {
                return reject(error)
            }
        })
    },
    async onPaymentClicked() {
        this.loading = true
        const fetching = Swal.fire({
            title: 'Fetching your bill details...',
        })
        const bill = await this.fetchBill();
        if(!bill) {
            // bill not found
            // alert('')
            return
        }
        fetching.close()
        Swal.fire({
            title: 'Bill details',
            html: `
            Customer name: ${bill.name}<br>
            Amount: ${bill.amount}<br>
            Due date: ${bill.duedate}<br>
            `,
            confirmButtonText: 'Pay Now',
        }).then(result => {
            if(result) {
                const order = await this.generateOrder()
                this.$store.dispatch('setNewOrder', order)
                this.$router.push({path: '/payment'})
            }
        })

    },
    async doBillPayment(response) {
      let formdata = {
        ...this.values,
        ...response,
        user: this.$props.user,
        orderId: this.orderId
      };
      try {
        const paymentURL = "/wp-json/app/do_electricity_payment_now";
        const { data } = await this.$http.post(paymentURL, formdata);
        console.log({ data });
        if (data && data.ok) {
          this.$router.push({
            name: "paymentDone",
            params: {
              service: "electricity",
              id: data.transaction_id
            }
          });
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
  mounted() {
  }
};
</script>
<style scoped>
.loading {
    position: relative;
}
.loading:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>

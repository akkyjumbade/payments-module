<template>
   <div class="payment_form" :class="{'is_submitting': isSubmitting}">
       {{order}}
      <ul class="paymentModes nav nav-pills">
         <li :class="{'active': (tab == 'card')}">
            <a href="#" @click.prevent="tab = 'card'">Debit/ Credit Card</a>
         </li>
         <li :class="{'active': (tab == 'upi')}">
            <a href="#" @click.prevent="tab = 'upi'">UPI</a>
         </li>
         <!-- <li :class="{'active': (tab == 'wallet')}">
            <a href="#" @click.prevent="tab = 'wallet'">Wallet</a>
         </li> -->
      </ul>
      <div>
         <div v-if="tab == 'card'" >
            <legend>Enter Card Details</legend>
            <div class="form-group">
               <label>Name on card</label>
               <input class="form-control" v-model="values.name_on_card" placeholder="Name on card" >
            </div>
            <div class="form-group">
               <label>Card number</label>
               <input class="form-control" v-model="values.card_number" placeholder="Enter Debit / Credit Card Number" >
            </div>
            <div class="row">
               <div class="form-group col-xs-4">
                  <label>Expiry Month</label>
                  <select class="form-control" v-model="values.card_exp_month">
                     <option disabled value="">MM</option>
                     <option v-for="(month, i) in months" :key="i" :value="month.value">
                        ({{month.value}}) {{month.label}}
                     </option>
                  </select>
               </div>
               <div class="form-group col-xs-4">
                  <label>Expiry Year</label>
                  <select class="form-control" v-model="values.card_exp_year">
                     <option value="">YY</option>
                     <option v-for="(option, i) in years" :key="i" :value="option.toString().replace('20', '')">
                        {{option}}
                     </option>
                  </select>
               </div>
               <div class="form-group col-xs-4">
                  <label>Enter CVV</label>
                  <input class="form-control" placeholder="***" v-model="values.cvv">
               </div>
            </div>
            <div class="form-group">
               <button :disabled="isSubmitting" @click.prevent="cardPayment" class="btn btn-primary btn-color">Pay Now</button>
               <button @click.prevent="cancelPayment" class="btn btn-default">Cancel</button>
            </div>
         </div>
         <form v-if="tab == 'upi'" @submit.prevent="onUPIPayment">
            <div class="form-group">
               <label>Enter UPI Id</label>
               <input class="form-control" v-model="values.vpaAddress" >
            </div>
            <button class="btn btn-primary">Submit</button>
         </form>
         <form v-if="tab == 'wallet'" @submit.prevent="onPayment">
            <div class="form-group">
               <label>Wallet</label>
               <input class="form-control" >
            </div>
            <button class="btn btn-primary">Submit</button>
         </form>
      </div>
      {{paymentData}}
   </div>
</template>
<script>
const months = [
   {
      label: 'Jan',
      value: '1',
   },
   {
      label: 'Feb',
      value: '2',
   },
   {
      label: 'Mar',
      value: '3',
   },
   {
      label: 'Apr',
      value: '4',
   },
   {
      label: 'May',
      value: '5',
   },
   {
      label: 'Jun',
      value: '6',
   },
   {
      label: 'Jul',
      value: '7',
   },
   {
      label: 'Aug',
      value: '8',
   },
   {
      label: 'Sep',
      value: '9',
   },
   {
      label: 'Oct',
      value: '10',
   },
   {
      label: 'Nov',
      value: '11',
   },
   {
      label: 'Dec',
      value: '12',
   },
]
let years = []
var min = new Date().getFullYear(),
   max = min + 30
for (var i = min; i<=max; i++){
    years.push(i)
}
import gateway from '../gateway'
const razorpay = new gateway({})

export default {
   props: {
      order: {
         type: [Object],
         required: true,
      },
      user: {
         type: [Object],
         required: true,
      },
      paymentMethods: {
         type: [Object],
         required: true,
      },
   },
   data: function () {
      return {
         tab: 'card',
         months,
         years,
         values: {},
         isSubmitting: false,
         errors: null,
         paymentData: {

         }
      }
   },
   methods: {
      async handlePayment(responseFromApi) {
         const {statusCode} = responseFromApi
         if(statusCode == 'success') {
            const order = this.order;
            try {
               const paidOrder = await this.processOrder(order.service, responseFromApi)
               this.$store.dispatch('setPaymentResponse', {
                  ...paidOrder,
                  transactionStatus: 'completed',
               })
            } catch (error) {
               this.$store.dispatch('setPaymentResponse', {
                  ...responseFromApi,
                  ...error,
                  transactionStatus: 'completed',
               })
               this.$router.push({path: 'payment_response'})
            }
         } else {
            this.$store.dispatch('setPaymentResponse', {
               ...responseFromApi,
               transactionStatus: 'failed',
            })
            this.$router.push({path: 'payment_response'})
         }
      },
      async processOrder(service, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               const {data} = await this.$http.post('/wp-json/app/pay-for/'+service, {
                  ...payload,
                  ...this.order,
               })
               if(data.ok) {
                  resolve(data.data)
               } else {
                  reject(data)
               }
               console.log({data})
            } catch (error) {
               reject(error)
               console.log({error})
            }
         })
      },
      async onUPIPayment() {
         this.isSubmitting = true
         this.paymentData = {
            order_id: this.order.order_id,
            email: this.user.email,
            contact: this.user.phone,
            amount: Math.round(this.order.amount) * 100,
            notes: {
               address: this.user.orderNote,
            },
            method: 'upi',
            vpa: this.values.vpaAddress,
         }
         razorpay.createPayment(this.paymentData)
      },
      async cardPayment() {
         this.isSubmitting = true
         const card = {
            expiry_month: this.values.card_exp_month,
            expiry_year: this.values.card_exp_year,
            number: this.values.card_number,
            cvv: this.values.cvv,
            name: this.values.name_on_card,
            // save: this.values.save_card ? 1: 0
         }
         try {
            this.paymentData = {
               order_id: this.order.order_id,
               currency: "INR",
               email: this.user.email,
               contact: this.user.phone,
               amount: Math.round(this.order.amount) * 100,
               notes: {
                  address: this.user.orderNote,
               },
               method: 'card',
               card
            }
            razorpay.createPayment(this.paymentData)
         } catch (error) {
            this.isSubmitting = false
            console.log({error})
         }
      },
      async walletPayment() {

      },
      cancelPayment() {
         this.$store.dispatch('cancelOrder')
         this.$router.push({
            path: '/'
         })
      }
   },
   mounted() {
      razorpay.on('payment.success', response => {
         this.isSubmitting = false
         // proceed to pay
         this.$store.dispatch('setPaymentResponse', this.handlePayment({
            ...response,
            statusCode: 'success',
         }))
      })
      razorpay.on('payment.error', response => {
         this.isSubmitting = false
         this.$store.dispatch('setPaymentResponse', this.handlePayment({
            ...response,
            statusCode: 'failed',
         }))
      })
   }
}
</script>
<style lang="scss" scoped>
.paymentModes {
   display: flex;
   list-style: none;
   padding: 0;
   margin: 0;
   margin-bottom: 1rem;
   align-items: center;
   li {
      display: block;
      a {
         display: block;
         border-bottom: 2px solid #f5f5f5;
      }
   }
}
.checkbox {
   label {
      display: flex;
      align-items: center;
   }
}
.is_submitting {
   opacity: 0.5;
   cursor: wait;
}
</style>

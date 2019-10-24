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
         <li :class="{'active': (tab == 'wallet')}">
            <a href="#" @click.prevent="tab = 'wallet'">Wallet</a>
         </li>
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
            <div class="checkbox">
               <label>
                  <input type="checkbox" name="save_card" v-model="values.save_card">
                  <span>Save this card for faster checkout</span>
               </label>
               <!-- Save this card for faster checkout -->
            </div>
            <button :disabled="isSubmitting" @click.prevent="cardPayment" class="btn btn-primary btn-color">Pay Now</button>
         </div>
         <form v-if="tab == 'upi'" @submit.prevent="onPayment">
            <div class="form-group">
               <label>Enter UPI Id</label>
               <input class="form-control" >
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

export default {
   data: function () {
      return {
         tab: 'card',
         months,
         years,
         values: {},
         isSubmitting: false,
         errors: null,
      }
   },
   computed: {
       order() {
           return this.$store.state.order
       },
       user() {
           return this.$store.state.user
       },
       cardExpiry() {
           if(this.tab == 'card') {
              return this.values.card_exp_month + '/' + this.values.card_exp_year
           }
           return ''
       },
   },
   methods: {
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
            const paymentData = {
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
            // debugger
            const razorpay = new gateway({

            })
            razorpay.createPayment(paymentData)
            razorpay.on('payment.success', response => {
               // proceed to pay
               this.$store.dispatch('setPaymentResponse', {
                  ...response,
                  statusCode: 'success',
               })
               this.$store.dispatch('doMobileRecharge', {
                  phone: this.order.phone,
                  amount: this.order.amount,
                  provider_id: this.order.operator,
               })
            })
            razorpay.on('payment.error', response => {
                this.$store.dispatch('setPaymentResponse', {
                   ...response,
                  statusCode: 'failed',
                })
            })


            this.isSubmitting = false
            this.$router.push('payment_response')
         } catch (error) {
            this.isSubmitting = false
            // this.$router.push('payment_response', {
            //    error
            // })
            console.log({error})
         }
      },
      async upiPayment() {

      },
      async walletPayment() {

      },
      async checkValidation() {
         // try {
         //    const {data} = await this.$http.post('/wp-json/')
         // } catch (error) {

         // }
      }
   },
   mounted() {

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

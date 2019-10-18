<template>
   <div class="payment_form" :class="{'is_submitting': isSubmitting}">
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
         <form v-if="tab == 'card'" @submit.prevent="cardPayment">
            <legend>Enter Card Details</legend>
            <div class="form-group">
               <label>Card number</label>
               <input class="form-control" v-model="values.card_number" placeholder="Enter Debit / Credit Card Number" >
            </div>
            <div class="row">
               <div class="form-group col-sm-4">
                  <label>Expiry Month</label>
                  <select class="form-control" v-model="values.card_exp_month">
                     <option disabled value="">MM</option>
                     <option v-for="(month, i) in months" :key="i" :value="month.value">
                        ({{month.value}}) {{month.label}}
                     </option>
                  </select>
               </div>
               <div class="form-group col-sm-4">
                  <label>Expiry Year</label>
                  <select class="form-control" v-model="values.card_exp_year">
                     <option value="">YY</option>
                  </select>
               </div>
               <div class="form-group col-sm-4">
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
            <button :disabled="isSubmitting" class="btn btn-primary btn-color">Pay Now</button>
         </form>
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
export default {
   data: function () {
      return {
         tab: 'card',
         months,
         values: {},
         isSubmitting: false,
         errors: null,
      }
   },
   methods: {
      async cardPayment() {
         this.isSubmitting = true
         const values = this.values
         try {
            const {data} = await this.$http.post('/wp-json/app/recharge_card_payment', values)
            console.log({data})
            this.isSubmitting = false
            this.$router.push('payment_response')
         } catch (error) {
            this.isSubmitting = false
            this.$router.push('payment_response', {
               error
            })
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

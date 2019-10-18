<template>
   <div>
      <nav class="tab-nav">
         <ul>
            <li v-for="(tab, k) in tabs" :key="k">
               <router-link :to="tab.to">
                  <span class="icon">
                     <img :src="tab.icon" :alt="tab.label" class="tab_nav_icon" />
                  </span>
                  <span v-text="tab.label"></span>
               </router-link>
            </li>
         </ul>
      </nav>
      <router-view></router-view>
   </div>
</template>
<script>
const tabs = [
   {
      label: 'Mobile Recharge',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: '/recharge',
   },
   {
      label: 'Electricity Bill',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: '/electricity',
   },
   {
      label: 'DTH',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: 'dth',
   },
   {
      label: 'Broadband',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: 'broadband',
   },
   {
      label: 'Gas',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: 'gas',
   },
   {
      label: 'Money Transfer',
      icon: 'https://www.stpatil.com/wp-content/themes/__main_/assets/images/stp-service-mobile-recharge.png',
      to: 'sendmoney',
   },
]
export default {
   data: function () {
      return {
         tabs
      }
   }
}
</script>
<style lang="scss" scoped>
.tab-nav {
   display: flex;
   justify-content: center;
   max-width: 100vw;
   overflow: hidden;
   ul {
       overflow: auto;
      list-style: none;
      padding: 0;
      margin: 0;
      margin-bottom: 1rem;
      display: flex;
      white-space: nowrap;
      align-items: center;
      li {
         padding: .3rem 1rem;
         a {
            display: block;
            .icon {
               display: block;
               .tab_nav_icon {
                  display: block;
                  width: var(--size, 34px);
                  height: var(--size);
                  margin: .5rem auto;
               }
            }
         }


      }
   }
}
</style>

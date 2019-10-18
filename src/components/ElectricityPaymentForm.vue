<template>
    <div class="mobile_recharge_form">
        {{providers}}
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            providers: []
        }
    },
    methods: {
        async fetchProviders() {
            try {
                const {data} = await this.$http.get('/wp-json/app/get_dth_providers')
                this.providers = data.data
            } catch (error) {
                console.log({error})
            }
        }
    },
    created() {
        this.fetchProviders()
    }
}
</script>
<style scoped>

</style>

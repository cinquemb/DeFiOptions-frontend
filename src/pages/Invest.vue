<template>
  <div>
    <div class="section-big row mt-4 mx-3">
      <div class="col-md-3">
        <LpData />
      </div>

      <div class="col-md-9">
        <LpDeposit />

        <LpWithdraw />
      </div>
    </div>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <LpCreatePool />
      </div>
    </div>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <LpToggle :pools="getExchangeLiquidityPools" />
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LpData from '../components/invest/LpData.vue';
import LpDeposit from '../components/invest/LpDeposit.vue';
import LpWithdraw from '../components/invest/LpWithdraw.vue';
import LpCreatePool from '../components/invest/LpCreatePool.vue';
import LpToggle from '../components/invest/LpToggle.vue';

export default {
  name: 'Invest',
  components: { 
    LpData,
    LpDeposit,
    LpWithdraw,
    LpCreatePool,
    LpToggle
  },
  computed: {
    ...mapGetters("accounts", ["isUserConnected", "getWeb3"]),
    ...mapGetters("optionsExchange", ["getExchangeUserBalance", "getSelectedPoolAddr", "getExchangeLiquidityPools"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("optionsExchange/fetchLiquidityPools");
    //this.$store.dispatch("liquidityPool/fetchContract");
    this.$store.dispatch("dai/fetchContract");
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("dai/storeAddress");
    this.$store.dispatch("usdc/fetchContract");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("usdc/storeAddress");
    //this.$store.dispatch("liquidityPool/fetchUserBalance");
    //this.$store.dispatch("optionsExchange/fetchLiquidityPoolBalance");
    //this.$store.dispatch("liquidityPool/fetchApy");
    //this.$store.dispatch("liquidityPool/storeAddress");
    //this.$store.dispatch("liquidityPool/fetchUserPoolUsdValue");
    //this.$store.dispatch("liquidityPool/fetchPoolFreeBalance");
    //this.$store.dispatch("liquidityPool/fetchPoolMaturityDate");
    //this.$store.dispatch("liquidityPool/fetchPoolWithdrawalFee");
  }
}
</script>

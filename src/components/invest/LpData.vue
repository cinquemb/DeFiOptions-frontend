<template>
  <div>
    <h3>Liquidity pool: {{poolSymbol}}({{poolAddress}})</h3>

    <Card cardClass="card-green" title="Your Pool Balance" :text="'$'+Number(getUserPoolUsdValue).toFixed(2)" />

    <Card cardClass="card-blue" title="Total Pool Balance" :text="'$'+Number(getLiquidityPoolBalance).toFixed(2)" />

    <Card cardClass="card-blue" title="Yield (Since start)" :text="Number(getApy).toFixed(2)+'%'" class="mb-3" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Card from '../Card.vue';
//import { signERC2612Permit } from 'eth-permit';

export default {
  name: "LpData",

  components: { 
    Card
  },

  data() {
    return {
      poolAddress: "N/A",
      poolSymbol: "N/A",
    }
  },

  computed: {
    ...mapGetters("optionsExchange", ["getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getApy", "getUserPoolUsdValue", "getselectedPoolAddress"]),
  },

  created() {
      this.currentPoolAddress();
  },

  method: {
    async currentPoolAddress() {
      this.poolAddress = this.getselectedPoolAddress();
      this.poolSymbol = this.getSelectedPool();
    }
  }
}
</script>

<style>

</style>
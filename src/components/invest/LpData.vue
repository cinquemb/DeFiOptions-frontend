<template>
  <div>
    <h3>Liquidity pool: {{getSelectedPool}}({{getSelectedPoolAddress.substring(0, 6)}}...{{getSelectedPoolAddress.substring(38, 42)}})</h3>

    <Card cardClass="card-green" title="Your Pool Balance" :text="'$'+Number(getUserPoolUsdValue).toFixed(2)" />

    <Card cardClass="card-blue" title="Total Pool Balance" :text="'$'+Number(getLiquidityPoolBalance).toFixed(2)" />

    <Card cardClass="card-blue" title="Yield (Since start)" :text="Number(getApy).toFixed(2)+'%'" class="mb-3" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Card from '../Card.vue';

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
    ...mapGetters("liquidityPool", ["getApy", "getUserPoolUsdValue", "getSelectedPoolAddress"]),
  },

  mounted() {
    this.$root.$on('poolToggleEvent', this.handlpoolToggleEvent);
  },

  methods: {
    handlpoolToggleEvent (obj) {
      this.poolAddress = obj[1];
      this.poolSymbol = obj[0];
    }
  }
}
</script>

<style>

</style>
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
        <LpToggle :pools="poolSyms" />
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
    ...mapGetters("optionsExchange", ["getExchangeUserBalance", "getExchangeLiquidityPools","getOptionsExchangeContract"]),

  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("optionsExchange/fetchLiquidityPools");
    this.$store.dispatch("proposalManager/fetchContract");
    this.$store.dispatch("proposalManager/fetchProposalCount");

    this.getFilteredPools();
    //this.$store.dispatch("liquidityPool/fetchContract");
    this.$store.dispatch("dai/fetchContract");
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("dai/storeAddress");
    this.$store.dispatch("usdc/fetchContract");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("usdc/storeAddress");
  },

  data() {
    return { 
      poolSyms: []
    }
  },

  methods: {
    async getFilteredPools(){

      let poolSymbols = [];
      let poolSymbolsAddrsMap = {};
      let exchangePools = [];

      let poolSymbolsMaxLen = await this.getOptionsExchangeContract.methods.totalPoolSymbols().call();
      for (var i=0; i < poolSymbolsMaxLen; i++) {
          let pSym = await this.getOptionsExchangeContract.methods.poolSymbols(i).call();
          let poolAddr = await this.getOptionsExchangeContract.methods.getPoolAddress(String(pSym)).call();

          poolSymbolsAddrsMap[pSym] = poolAddr;
          poolSymbols.push(pSym);
          let symbol = poolSymbols[i];
          let address = poolSymbolsAddrsMap[symbol];
          // option object
          let poolObject = {symbol, address};
          exchangePools.push(poolObject);
      }

      this.$store.commit("optionsExchange/setPoolSymbols", poolSymbols);
      this.$store.commit("optionsExchange/setPoolSymbolsAddrsMap", poolSymbolsAddrsMap);
      this.$store.commit("optionsExchange/setExchangeLiquidityPools", exchangePools);
      this.$store.dispatch("proposalManager/fetchProposals");

      this.poolSyms =  exchangePools;
    }
  }
}
</script>

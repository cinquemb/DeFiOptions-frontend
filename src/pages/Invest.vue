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
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
import addresses from '../contracts/addresses.json';
import ProtocolReaderJSON from '../contracts/ProtocolReader.json';

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
    ...mapGetters("accounts", ["isUserConnected", "getWeb3", "getChainId"]),
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
      poolSyms: [],
      loading: true
    }
  },

  methods: {
    async getFilteredPools(){

      let poolSymbols = [];
      let poolSymbolsAddrsMap = {};
      let exchangePools = [];

      let protocolReaderAddr = addresses["ProtocolReader"][parseInt(this.getChainId)];
      const protocolReaderContract = await new this.getWeb3.eth.Contract(ProtocolReaderJSON.abi, protocolReaderAddr);

      let poolData = await protocolReaderContract.methods.listPoolsData().call();

      for (var i=0; i < poolData[0].length; i++) {
          let pSym = poolData[0][i];
          let poolAddr = poolData[1][i];

          poolSymbolsAddrsMap[pSym] = poolAddr;
          poolSymbols.push(pSym);
          let symbol = poolSymbols[i];
          let address = poolSymbolsAddrsMap[symbol];
          // option object
          let poolObject = {symbol, address};
          exchangePools.push(poolObject);

          for(let lKey in this.$store.state.liquidityPool) {
            let tKey = lKey;

            console.error(this.$store.state.liquidityPool[tKey]);

            if(typeof this.$store.state.liquidityPool[tKey] === 'object') {
              if (!(poolAddr in this.$store.state.liquidityPool[tKey])) {
                this.$store.state.liquidityPool[tKey][poolAddr] = null;
              }
            }
          }

          this.$store.commit("liquidityPool/setSelectedPoolAddress", poolAddr);
          this.$store.dispatch("liquidityPool/fetchContract");
          this.$store.dispatch("liquidityPool/fetchUserBalance");
          this.$store.dispatch("optionsExchange/fetchLiquidityPoolBalance");
          this.$store.dispatch("liquidityPool/fetchApy");
          this.$store.dispatch("liquidityPool/storeAddress");
          this.$store.dispatch("liquidityPool/fetchUserPoolUsdValue");
          this.$store.dispatch("liquidityPool/fetchPoolFreeBalance");
          this.$store.dispatch("liquidityPool/fetchPoolMaturityDate");
          this.$store.dispatch("liquidityPool/fetchPoolWithdrawalFee");
      }

      this.$store.commit("optionsExchange/setPoolSymbols", poolSymbols);
      this.$store.commit("optionsExchange/setPoolSymbolsAddrsMap", poolSymbolsAddrsMap);
      this.$store.commit("optionsExchange/setExchangeLiquidityPools", exchangePools);
      this.$store.dispatch("proposalManager/fetchProposals");

      this.poolSyms =  exchangePools;
      this.loading = false;
    }
  }
}
</script>

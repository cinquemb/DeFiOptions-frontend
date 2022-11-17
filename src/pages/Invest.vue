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
    ...mapGetters("accounts", ["getActiveAccount", "isUserConnected", "getWeb3", "getChainId"]),
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

      let poolData = await protocolReaderContract.methods.listPoolsData(this.getActiveAccount).call();

      for (var i=0; i < poolData[0].length; i++) {
          let pSym = poolData[0][i];
          let poolAddr = poolData[1][i];
          let poolApy = poolData[2][i];
          let poolBalance = poolData[3][i];
          let poolFreeBalance = poolData[4][i];
          let userPoolBalance = poolData[5][i];
          let userPoolUsdValue = poolData[6][i];
          let poolMaturityDate = poolData[7][i];
          let poolWithdrawalFee = poolData[8][i];
          let poolSymbolList = poolData[9][i];

          let tmpPoolData = {
            "poolApy": poolApy,
            "poolBalance": poolBalance,
            "poolFreeBalance": poolFreeBalance,
            "userPoolBalance": userPoolBalance,
            "userPoolUsdValue": userPoolUsdValue,
            "poolMaturityDate": poolMaturityDate,
            "poolWithdrawalFee": poolWithdrawalFee,
            "poolSymbolList": poolSymbolList
          };

          poolSymbolsAddrsMap[pSym] = poolAddr;
          poolSymbols.push(pSym);
          let symbol = poolSymbols[i];
          let address = poolSymbolsAddrsMap[symbol];
          // option object
          let poolObject = {symbol, address};
          exchangePools.push(poolObject);



          for(let lKey in this.$store.state.liquidityPool) {
            let tKey = lKey;
            if(typeof this.$store.state.liquidityPool[tKey] === 'object') {
              if (!(poolAddr in this.$store.state.liquidityPool[tKey])) {
                this.$store.state.liquidityPool[tKey][poolAddr] = null;
              }
            }
          }
          //hack because that commit shit doesn't work
          this.$store.state.liquidityPool["pool"][poolAddr] = tmpPoolData;
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

<template>
  <div>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRange :ranges="setRanges" />
        <span></span>
      </div>
      <button @click="addRange" class="btn btn-success">
        Add/Modify Range
      </button>
    </div>
    <span></span>
    <span></span>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <AddSymbol :symbols="addSymbols" />
        <span></span>
      </div>
      <button @click="addSymbol" class="btn btn-success">
        Add/Modify Symbol
      </button>
    </div>
  

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddSymbol from '../components/manage/AddSymbol.vue';
import SetRange from '../components/manage/SetRange.vue';

export default {
  name: 'Portfolio',
  data() {
    return {
      setParams: { //non gov
        reserveRatio: null,
        withdrawFee: null,
        maturity: null,
        leverageMultiplier: null,
        hedgingManagerAddress: null,
      },
      setRanges: [], //gov
      addSymbols: [],//gov
      removeSymbols: [],//non gov
      createOptions: []//non gov
    }
  },
  components: {
    AddSymbol,
    SetRange,
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getApy", "getUserPoolUsdValue", "getSelectedPoolAddress"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("liquidityPool/fetchContract");
    this.$store.dispatch("dai/fetchContract");
    this.$store.dispatch("usdc/fetchContract");
    this.$store.dispatch("creditToken/fetchContract");
    this.$store.dispatch("optionsExchange/fetchLiquidityPools");
    this.$store.dispatch("liquidityPool/fetchUserBalance");
    this.$store.dispatch("liquidityPool/storeAddress");
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("creditToken/fetchUserBalance");
    this.$store.dispatch("accounts/fetchActiveBalance");
  },

  methods: {
    addSymbol: function () {
      this.addSymbols.push({
        address: '',
        strike: '',
        maturity: '', 
        optionType: '',
        t0: '',
        t1: '',
        x: '',
        y: '',
        bsStockSpread: ''
      });
    },
    addRange: function () {
      this.setRanges.push({ symbol: '', op: '', start: '', end: '' });
    }
  }
}
</script>

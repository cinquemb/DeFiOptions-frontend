<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- Pool data -->
    <div class="div-flex justify-content-center flex-wrap">
      <LpDataItem class="data-item" title="Symbol" :data="formatSymbol" :divider="true" />
      <LpDataItem class="data-item" title="Address" :data="formatAddress" :divider="true" :info="formatAddressInfo" />
      <div class="data-item" >
        <button @click="togglePool" class="btn btn-success">
          Select Pool
        </button>
      </div>

      <div class="data-item" @mouseover="togglePool">
        <router-link to="/manage" class="btn btn-success">
          Manage pool
        </router-link>
      </div>

      <div class="data-item" @mouseover="togglePool">
        <router-link to="/pool-governance" class="btn btn-success">
          Govern pool
        </router-link>
      </div>

    </div>

    <!-- Action button -->
    <div>
      
      <span></span>
    </div>
  </div>
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import LpDataItem from '../LpDataItem.vue';

export default {
  name: "Lp",
  props: ["pool"],
  data() {
    return {}
  },

  components: { 
    LpDataItem
  },

  created() {
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("dai/fetchLpAllowance");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("usdc/fetchLpAllowance");
    this.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
    this.$store.dispatch("optionsExchange/fetchExchangeBalanceAllowance");
  },

  computed: {
    ...mapGetters("accounts", ["getWeb3"]),

    formatAddress () {
      return this.pool.address.substring(0, 6) + '...' + this.pool.address.substring(38, 42)
    }, 

    formatSymbol () {
      if (this.pool.symbol.length > 10) {
        let ts = '0x' + this.pool.symbol
        return ts.substring(0, 6) + '...' + ts.substring(38, 42)
      } else {
        return this.pool.symbol
      }
    }, 

    formatAddressInfo () {
      return "Pool Address (copy to clipboard when selecting pool)"
    }, 
  },

  methods: {
    async togglePool() {
      this.$root.$emit('poolToggleEvent', [this.pool.symbol, this.pool.address]);
      this.$store.commit("optionsExchange/setSelectedPool", this.pool.symbol);
      this.$store.state.liquidityPool["selectedPoolAddress"] = this.pool.address;

      this.$store.dispatch("liquidityPool/fetchContract");
      this.$store.dispatch("liquidityPool/fetchUserBalance");
      this.$store.dispatch("optionsExchange/fetchLiquidityPoolBalance");
      this.$store.dispatch("optionsExchange/fetchPoolOptions");
      this.$store.dispatch("liquidityPool/fetchApy");
      this.$store.dispatch("liquidityPool/storeAddress");
      this.$store.dispatch("liquidityPool/fetchUserPoolUsdValue");
      this.$store.dispatch("liquidityPool/fetchPoolFreeBalance");
      this.$store.dispatch("liquidityPool/fetchPoolMaturityDate");
      this.$store.dispatch("liquidityPool/fetchPoolWithdrawalFee");
      this.$store.dispatch("liquidityPool/fetchSymbolsList");


      this.$store.commit("liquidityPool/setSelectedPoolAddress", this.pool.address);
      this.copyPoolAddr();

    },
    async copyPoolAddr() {
      try {
        await navigator.clipboard.writeText(this.$store.state.liquidityPool["selectedPoolAddress"]);
        let msg = "Copied Pool Address (" + this.$store.state.liquidityPool["selectedPoolAddress"] + ") to clipboard";
        this.$toast.success(msg);
      } catch($e) {return;}
    }
  }
}
</script>

<style>
.data-item {
  margin-right: 5px;
}

.div-flex {
  display: flex;
}

.fa-chevron-down, .fa-chevron-up {
  margin-left: 10px;
}

.show-form {
  margin-top: 24px;
}

.section-small {
  margin-top: 16px;
}

/* Mobile screens */
@media screen and (max-width: 600px) {
  .data-item {
    margin-right: 0px;
  }

  .div-flex {
    display: block;
  }
}
</style>
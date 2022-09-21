<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- Pool data -->
    <div class="div-flex justify-content-center flex-wrap">
      <LpDataItem class="data-item" title="Symbol" :data="pool.symbol" :divider="true" />
      <LpDataItem class="data-item" title="Address" :data="pool.address" :divider="true" />
    </div>

    <!-- Action button -->
    <div>
      <button @click="togglePool" class="btn btn-success">
        Select Pool
      </button>

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
  },

  methods: {
    async togglePool() {
      this.$store.commit("optionsExchange/setSelectedPool", this.pool.symbol);
      this.$store.commit("liquidityPool/setSelectedPoolAddress", this.pool.address);
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
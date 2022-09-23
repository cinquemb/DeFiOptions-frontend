<template>
  <div>

    <!------ Proposals for current pool ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <LpProposalList :proposals="filteredCurrentPoolProposals" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LpProposalList from '../components/invest/LpProposalList.vue';

export default {
  name: 'PoolGovernance',
  data() {
    return {
      loading: false
    }
  },
  components: {
    LpProposalList
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAbi","getApy", "getUserPoolUsdValue", "getSelectedPoolAddress"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract", "getProposals"]),
    filteredCurrentPoolProposals() {
      let filtered = [];

      console.error(this.getProposals);

      for (let proposal of this.getProposals) {
        if (proposal.addr == this.getSelectedPoolAddress) {
          filtered.push(proposal);
        }
      }

      return filtered;
    },
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }
    
    this.$store.dispatch("proposalManager/fetchProposalCount");
    this.$store.dispatch("proposalManager/fetchProposals");
    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("liquidityPool/fetchContract");
    this.$store.dispatch("optionsExchange/fetchLiquidityPools");
    this.$store.dispatch("liquidityPool/fetchUserBalance");
    this.$store.dispatch("liquidityPool/storeAddress");
    this.$store.dispatch("creditToken/fetchUserBalance");

    console.error(this.getProposals);
  },
  methods: {}
}
</script>

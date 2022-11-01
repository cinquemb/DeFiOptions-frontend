<template>
  <div>

    <!------ Proposals for current pool ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <ProtocolProposalList :proposals="filteredCurrentPoolProposals" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProtocolProposalList from '../components/invest/ProtocolProposalList.vue';

export default {
  name: 'ProtocolGovernance',
  data() {
    return {
      loading: false
    }
  },
  components: {
    ProtocolProposalList
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("protocolSettings", ["getProtocolSettingsContract", "getDODAddress"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract", "getProposals"]),
    filteredCurrentPoolProposals() {
      let filtered = [];
      for (let proposal of this.getProposals) {
        if (proposal.govToken == this.getDODAddress) {
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
  },
  methods: {}
}
</script>

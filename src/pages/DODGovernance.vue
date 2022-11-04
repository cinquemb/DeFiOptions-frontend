<template>
  <div>
    <div class="section-big row mt-4 mx-3">
      <router-link to="/manage-dod" class="btn btn-success">
        Manage DOD
      </router-link>
    </div>

    <div class="section-big row mt-4 mx-3">
      <router-link to="/dod-governance" class="btn btn-success">
        Govern DOD
      </router-link>
    </div>

    <div class="section-big row mt-4 mx-3">
      <router-link to="/manage-exchange" class="btn btn-success">
        Manage Exchange
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'DODGovernance',
  components: {},
  computed: {
    ...mapGetters("accounts", ["isUserConnected", "getWeb3"]),
    ...mapGetters("optionsExchange", ["getExchangeUserBalance", "getExchangeLiquidityPools","getOptionsExchangeContract"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("protocolSettings/fetchContract");
    this.$store.dispatch("protocolSettings/storeAbi");

    this.$store.dispatch("incentivized/fetchContract");
    this.$store.dispatch("incentivized/storeAbi");
  },
}
</script>

<template>
  <div>

    <!------ Delegate Gov Tokens ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddress :data="DelegateTo" />
        <span></span>
        <button @click="delegateTo" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Delegate DOD
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

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
import SetAddress from '../components/manage/exchange/SetAddress.vue';
import GovTokenJSON from "../contracts/GovToken.json";



export default {
  name: 'DODGovernance',
  components: {SetAddress},
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getExchangeUserBalance", "getExchangeLiquidityPools","getOptionsExchangeContract"]),
    ...mapGetters("protocolSettings", ["getProtocolSettingsContract", "getDODAddress"]),

  },
  data() {
    return {
      loading: false,
      DelegateTo: {
        addr: null,
        desc: "Delegate Governance Token To Address"
      },
    }
  },

  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("protocolSettings/fetchContract");
    this.$store.dispatch("protocolSettings/storeAddress");
    this.$store.dispatch("protocolSettings/storeAbi");

    this.$store.dispatch("incentivized/fetchContract");
    this.$store.dispatch("incentivized/storeAbi");

    this.$store.dispatch("proposalManager/fetchContract");
    this.$store.dispatch("proposalManager/fetchProposalCount");
    this.$store.dispatch("proposalManager/fetchProposals");
  },

  methods: {
    async delegateTo() {
      let component = this;
      if (component.DelegateTo.addr != null) {
        component.loading = true;
        // deploy proposal contract
        const DODContract = await new component.getWeb3.eth.Contract(GovTokenJSON.abi, component.getDODAddress);

        await DODContract.methods.delegateTo(
          component.DelegateTo.addr
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("Delegation of Governance Tokens Succeeded");
          } else {
            component.$toast.error("The delegateTo tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      }

    }
  }
}
</script>

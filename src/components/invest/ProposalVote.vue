<template>
  <div>
    <div class="d-flex flex-wrap mt-3">

      <!-- More Proposal data -->

      <div v-for="detail in details" v-bind:key="detail.function">
        <div class="div-flex justify-content-center flex-wrap">
        <LpProposalItem class="data-item" title="Function" :data="detail.function" :divider="true" />
        <LpProposalItem class="data-item" title="Function Input" :data="detail.inputs" :divider="true" />
      </div>

      </div>
      
      <div class="form-button-mobile" v-if="isClosable">
        <div class="btn-group" aria-describedby="button-text">
          <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
            {{(vote == true)? "YEA" : "NAY"}}
          </button>
          <ul class="dropdown-menu">
            <li>
              <span class="dropdown-item text-uppercase" @click="setVoteChoice(true)">YEA</span>
              <span class="dropdown-item text-uppercase" @click="setVoteChoice(false)">NAY</span>
            </li>
          </ul>
        </div>
      </div>

      <button @click="castVote" class="btn btn-success" v-if="isClosable">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Sumbit Vote
      </button>


    </div>
  </div>
</template>

<script>
import LpProposalItem from '../LpProposalItem.vue';
import { mapGetters } from "vuex";
import ProposalWrapperJSON from "../../contracts/ProposalWrapper.json";


export default {
  name: "ProposalVote",
  props: ["proposal", "details"],

  data() {
    return {
      vote: null,
      loading: false,
    }
  },

  created() {},

  components: { 
    LpProposalItem
  },

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getWeb3"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAddress"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeAddress", "getOptionsExchangeContract", "getExchangeUserBalance", "getUserCollateralSurplus", "getUserExchangeBalanceAllowance", "getUserOptions"]),
    isClosable () {
      return this.proposal.status == "1";
    },
  },


  methods: {
    setVoteChoice(choice) {
      this.vote = choice;
    },

    async castVote(){
      let component = this;
      let pWrapperContract = new component.getWeb3.eth.Contract(ProposalWrapperJSON.abi, component.proposal.wrapperAddr);
      await pWrapperContract.methods.castVote(
        (component.vote == true) ? 1 : 0
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
          component.$toast.success("You have successfully casted your vote.");
          
        } else {
          component.$toast.error("The voting tx has failed. Please contact the DeFi Options support.");
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
</script>

<style>
.show-text {
  color: white;
  font-weight: 400;
  font-size: 12px;
}
</style>
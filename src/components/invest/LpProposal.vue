<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- let proposal = {wrapperAddr: null, addr: null, govToken: null, voteType: null, status: null};-->

    <!-- Proposal data -->
    <div class="div-flex justify-content-center flex-wrap">
      <LpProposalItem class="data-item" title="Wrapper Address" :data="formatWrapperAddress" :divider="true" />
      <LpProposalItem class="data-item" title="Address" :data="formatAddress" :divider="true" />
      <LpProposalItem class="data-item" title="Status" :data="formatStatus" :divider="true" />
    </div>

     <!-- Action button -->
    <div>
      <button @click="toggleForm" class="btn btn-success" v-if="!showForm">
        Vote
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-up" v-if="showForm"></i>
      </button>

      <button @click="closeVote" class="btn btn-success" v-if="!showForm && isClosable">
        Close
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-up" v-if="showForm"></i>
      </button>
    </div>
  </div>

  <!-- Proposal Vote form -->
  <ProposalVote v-if="showForm" class="sell-form" :proposal="proposal" />
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import LpProposalItem from '../LpProposalItem.vue';
import ProposalVote from './ProposalVote.vue';
import ProposalWrapperJSON from "../../contracts/ProposalWrapper.json";


export default {
  name: "LpProposal",
  props: ["proposal"],
  data() {
    return {
      showForm: false
    }
  },

  components: { 
    LpProposalItem,
    ProposalVote
  },

  created() {
  },

  computed: {
    ...mapGetters("accounts", ["getWeb3", "getActiveAccount"]),
    formatAddress () {
      return this.proposal.addr.substring(0, 6) + '...' + this.proposal.addr.substring(38, 42)
    },
    formatWrapperAddress () {
      return this.proposal.wrapperAddr.substring(0, 6) + '...' + this.proposal.wrapperAddr.substring(38, 42)
    },
    isClosable () {
      return this.proposal.status == "1";
    },
    formatStatus (){
      //    enum Status { PENDING, OPEN, APPROVED, REJECTED }

      let status;
      switch(this.proposal.status){
        case "0":
          status = "pending";
          break;
        case "1":
          status = "open";
          break;
        case "2":
          status = "approved";
          break;
        case "3":
          status = "rejected";
      }

      return status;
    },
  },

  methods: {
    toggleForm() {
      if (this.showForm) {
        this.showForm = false;
      } else {
        this.showForm = true;
      }
    },
    async closeVote(){
      let component = this;
      let pWrapperContract = new component.getWeb3.eth.Contract(ProposalWrapperJSON.abi, component.proposal.wrapperAddr);
      await pWrapperContract.methods.close().send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
      }).on('receipt', function(receipt){
        console.log(receipt);
        if (receipt.status) {
          component.$toast.success("You have successfully closed this proposal.");
          
        } else {
          component.$toast.error("Closing proposal tx has failed. Please contact the DeFi Options support.");
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
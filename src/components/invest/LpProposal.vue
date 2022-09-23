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
    </div>
  </div>

  <!-- Sell option form -->
  <ProposalVote v-if="showForm" class="sell-form" :proposal="proposal" />
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import LpProposalItem from '../LpProposalItem.vue';
import ProposalVote from './ProposalVote.vue';

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
    ...mapGetters("accounts", ["getWeb3"]),
    formatAddress () {
      return this.proposal.addr.substring(0, 6) + '...' + this.proposal.addr.substring(38, 42)
    },
    formatWrapperAddress () {
      return this.proposal.wrapperAddr.substring(0, 6) + '...' + this.proposal.wrapperAddr.substring(38, 42)
    },
    formatStatus (){
      //    enum Status { PENDING, OPEN, APPROVED, REJECTED }

      let status;
      switch(this.proposal.status){
        case 0:
          status = "pending";
          break;
        case 1:
          status = "open";
          break;
        case 2:
          status = "approved";
          break;
        case 3:
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
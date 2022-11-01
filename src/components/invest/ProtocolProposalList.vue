<template>
  <div>
    <div v-for="proposal in proposals" v-bind:key="proposal.addr">
      <ProtocolProposal :proposal="proposal" />
    </div>
  </div>
</template>

<script>
import ProtocolProposal from './ProtocolProposal.vue';

export default {
  name: "ProtocolProposalList",
  props: ["proposals"],

  components: { 
    ProtocolProposal 
  },
}
</script>

<style>

</style>
<template>
  <div>
    <div v-for="proposal in proposals" v-bind:key="proposal.addr">
      <LpProposal :proposal="proposal" />
    </div>
  </div>
</template>

<script>
import LpProposal from './LpProposal.vue';

export default {
  name: "LpProposalList",
  props: ["proposals"],

  components: { 
    LpProposal 
  },
}
</script>

<style>

</style>
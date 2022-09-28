<template>
  <div>
    <h3>Set Pool Parameters</h3>
    <input v-model="params.reserveRatio" class="form-control deposit-input" placeholder="Reserve Ratio (Float: from 0 to 100, Ex: 2)">
    <input v-model="params.withdrawFee" class="form-control deposit-input" placeholder="Early withdraw fee - % (Float: from 0 to 100, Ex: 2)">
    <input v-model="params.maturity" class="form-control deposit-input"  placeholder="Pool Maturity (Unix Timestamp, Ex: 1979397234)">
    <input v-model="params.leverageMultiplier" class="form-control deposit-input" placeholder="Leverage multiplier (Float: from 1 to 30, Ex: 10)">
    <input v-model="params.hedgingManagerAddress" class="form-control deposit-input" placeholder="Hedging manager address (Contract address, Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52)">
    <pre>{{ params }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetParams",
  props: ["params"],

  components: { 
  },
}
</script>

<style>

</style>
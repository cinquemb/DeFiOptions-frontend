<template>
  <div>
    <h3>Set Pool Parameters</h3>
    <input v-model="params.reserveRatio" class="form-control deposit-input" placeholder="">
    <input v-model="params.maturity" class="form-control deposit-input"  placeholder="">
    <input v-model="params.withdrawFee" class="form-control deposit-input" placeholder="">
    <input v-model="params.leverageMultiplier" class="form-control deposit-input" placeholder="">
    <input v-model="params.hedgingManagerAddress" class="form-control deposit-input" placeholder="">
    <pre>{{ params | json }}</pre>
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
<template>
  <div>
    <div v-for="symbol in symbols" v-bind:key="symbol.strike">
      <h3>Add or Modify Existing Symbol </h3>
      <input v-model="symbol.udlFeed" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.strike" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.maturity" class="form-control deposit-input"  placeholder="">
      <input v-model="symbol.optionType" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.t0" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.t1" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.x" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.y" class="form-control deposit-input" placeholder="">
      <input v-model="symbol.bsStockSpread" class="form-control deposit-input" placeholder="0,0,0">
    </div>

    <pre>{{ symbols }}</pre>
  </div>
</template>

<script>

export default {
  name: "AddAymbol",
  props: ["symbols"],

  components: { 
  },
}
</script>

<style>

</style>
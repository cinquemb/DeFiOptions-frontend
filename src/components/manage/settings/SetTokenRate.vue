<template>
  <div>
    <h3>Add/modifying allowed stablecoin on exchange (and what it needs to normalize it to the exchange decimals)</h3>
    <input v-model="data.base" class="form-control deposit-input" placeholder="Denominator">
    <input v-model="data.value" class="form-control deposit-input" placeholder="Numerator">
    <input v-model="data.token" class="form-control deposit-input" placeholder="Token Address">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetTokenRate",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
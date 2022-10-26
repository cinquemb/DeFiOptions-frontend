<template>
  <div>
    <h3> The frequency of when the dex oracle is able to pull updates </h3>
    <input v-model="data.dexOracleAddress" class="form-control deposit-input" placeholder="Dex Oracle Addr">
    <input v-model="data.twapPeriod" class="form-control deposit-input" placeholder="TWAP period in seconds (min 1 hour, max 24 hours)">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetDexOracleTwapPeriod",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
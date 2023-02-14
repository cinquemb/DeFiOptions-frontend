<template>
  <div>
    <div v-for="range in ranges" v-bind:key="range.symbol" class="flex flex-col gap-2">
      <h3>Add or Modify Existing Range of the Underling Where Option Remains Valid </h3>
      <input v-model="range.symbol" class="form-control deposit-input" placeholder="(String), Ex: LINK/USD-EP-24e18-1643356800">
      <input v-model="range.op" class="form-control deposit-input"  placeholder="Options: (None, BUY, SELL), Ex: BUY">
      <input v-model="range.start" class="form-control deposit-input" placeholder="(Lower end of underlying price of option pricing validity), Ex: 500">
      <input v-model="range.end" class="form-control deposit-input" placeholder="(Top end of underlying price of option pricing validity), Ex: 4000">
    </div>
    <pre>{{ ranges }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetRange",
  props: ["ranges"],

  components: { 
  },
}
</script>

<style>

</style>
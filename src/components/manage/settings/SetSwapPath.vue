<template>
  <div>
    <h3>Add/modifying swap path from token a to token b on a dex (used during liquidations</h3>
    <input v-model="data.from" class="form-control deposit-input" placeholder="Held token address">
    <input v-model="data.to" class="form-control deposit-input" placeholder="Desired token out address">
    <input v-model="data.path" class="form-control deposit-input" placeholder="List of intermediate tokens to swap for">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetSwapPath",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
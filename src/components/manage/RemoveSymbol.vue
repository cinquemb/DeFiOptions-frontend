<template>
  <div>
    <div v-for="symbol in symbols" v-bind:key="symbol.value">
      <h3>Remove Symbols</h3>
      <input v-model="symbol.value" class="form-control deposit-input" placeholder="(String), Ex: LINK/USD-EP-24e18-1643356800">
    </div>
    <pre>{{ symbols }}</pre>
  </div>
</template>

<script>

export default {
  name: "RemoveSymbol",
  props: ["symbols"],

  components: { 
  },
}
</script>

<style>

</style>
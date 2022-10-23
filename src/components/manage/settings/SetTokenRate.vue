<template>
  <div>
    <div v-for="node in data" v-bind:key="node.desc">
      <h3>{{ node.desc }} </h3>
      <input v-model="node.base" class="form-control deposit-input" placeholder="Denominator">
      <input v-model="node.value" class="form-control deposit-input" placeholder="Numerator">
    </div>
    <pre>{{ ranges }}</pre>
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
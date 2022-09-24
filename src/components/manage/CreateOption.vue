<template>
  <div>
    <div v-for="option in options" v-bind:key="option.udlFeedAddr">
      <h3>Add or Modify Existing Range of the Underling Where Option Remains Valid </h3>
      <input v-model="option.udlFeedAddr" class="form-control deposit-input" placeholder="">
      <input v-model="option.optType" class="form-control deposit-input"  placeholder="">
      <input v-model="option.strike" class="form-control deposit-input" placeholder="">
      <input v-model="option.maturity" class="form-control deposit-input" placeholder="">
    </div>
    <pre>{{ options }}</pre>
  </div>
</template>

<script>

export default {
  name: "CreateOption",
  props: ["options"],

  components: { 
  },
}
</script>

<style>

</style>
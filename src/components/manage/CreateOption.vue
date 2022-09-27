<template>
  <div>
    <div v-for="option in options" v-bind:key="option.udlFeedAddr">
      <h3>Add or Modify Existing Range of the Underling Where Option Remains Valid </h3>
      <input v-model="option.udlFeedAddr" class="form-control deposit-input" placeholder="(Feed Address), Ex: 0xd81F810fc394e96c5D67af8395607C71B0a42d52">
      <input v-model="option.optType" class="form-control deposit-input"  placeholder="(Option Type), Ex: CALL or PUT">
      <input v-model="option.strike" class="form-control deposit-input" placeholder="(Strike Price), Ex: 1000">
      <input v-model="option.maturity" class="form-control deposit-input" placeholder="(Unix Timestamp), Ex: 1979397234">
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
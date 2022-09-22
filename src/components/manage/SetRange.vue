<template>
  <div>
    <div v-for="range in ranges" v-bind:key="range.symbol">
      <h3>Add or Modify Existing Range of the Underling Where Option Remains Valid </h3>
      <input v-model="range.sybol" class="form-control deposit-input" placeholder="">
      <input v-model="range.op" class="form-control deposit-input"  placeholder="">
      <input v-model="range.start" class="form-control deposit-input" placeholder="">
      <input v-model="range.end" class="form-control deposit-input" placeholder="">
    </div>
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
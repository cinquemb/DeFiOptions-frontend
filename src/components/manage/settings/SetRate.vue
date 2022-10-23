<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.base" class="form-control deposit-input" placeholder="Denominator">
    <input v-model="data.value" class="form-control deposit-input" placeholder="Numerator">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetRate",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
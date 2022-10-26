<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.to" class="form-control deposit-input" placeholder="Receiving Address">
    <input v-model="data.amount" class="form-control deposit-input" placeholder="Amount">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "Transfer",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
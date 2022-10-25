<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.addr" class="form-control deposit-input" placeholder="address">
    <input v-model="data.bool" class="form-control deposit-input" placeholder="True or False">

    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressBoolable",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
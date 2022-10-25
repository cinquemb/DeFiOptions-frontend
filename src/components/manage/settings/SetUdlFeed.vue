<template>
  <div>
    <h3>Add/modify underlying feed allowed on exchange</h3>
    <input v-model="data.value" class="form-control deposit-input" placeholder="0 for not allowed, 1 or higher for allowed">
    <input v-model="data.addr" class="form-control deposit-input" placeholder="UDL feed Address">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetUdlFeed",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
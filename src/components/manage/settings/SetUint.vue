<template>
  <div>
    <h3>{{ data.field_name }} </h3>
    <input v-model="data.value" class="form-control deposit-input" placeholder="data.desc">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetUint",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
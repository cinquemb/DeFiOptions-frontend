<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.value1" class="form-control deposit-input" placeholder="{{data.field_name1}}">
    <input v-model="data.value2" class="form-control deposit-input" placeholder="{{data.field_name2}}">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressMap",
  props: ["data"],

  components: { 
  },
}
</script>

<style>

</style>
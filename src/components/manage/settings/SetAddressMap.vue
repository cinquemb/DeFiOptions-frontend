<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.value1" class="form-control deposit-input" :placeholder="getFname1">
    <input v-model="data.value2" class="form-control deposit-input" :placeholder="getFname2">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressMap",
  props: ["data"],

  components: { 
  },

  computed: {
    getFname1() {
      return this.data.field_name1
    },
    getFname2() {
      return this.data.field_name2
    }
  },
}
</script>

<style>

</style>
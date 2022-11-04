<template>
  <div>
    <h3>{{ data.field_name }} </h3>
    <input v-model="data.addr" class="form-control deposit-input" :placeholder="getDesc">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressUint",
  props: ["data"],

  components: { 
  },

  computed: {
    getDesc() {
      return this.data.desc
    },
  },
}
</script>

<style>

</style>
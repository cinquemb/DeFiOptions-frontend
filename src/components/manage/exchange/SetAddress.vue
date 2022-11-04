<template>
  <div>
    <h3>{{ data.desc }} </h3>
    <input v-model="data.addr" class="form-control deposit-input" :placeholder="getDesc">
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

export default {
  name: "SetAddressBoolable",
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
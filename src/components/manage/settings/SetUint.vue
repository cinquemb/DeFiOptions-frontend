<template>
  <div>
    <div v-for="node in data" v-bind:key="node.field_name">
      <h3>{{ node.field_name }} </h3>
      <input v-model="node.value" class="form-control deposit-input" placeholder="{{ node.desc }}">
    </div>
    <pre>{{ ranges }}</pre>
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
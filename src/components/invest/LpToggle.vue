<template>
  <div>
    <div v-for="pool in pools" v-bind:key="pool.symbol">
      <Lp :pool="pool" />
    </div>
  </div>
</template>

<script>
import Lp from './Lp.vue';

export default {
  name: "LpToggle",
  props: ["pools"],

  components: { 
    Lp 
  },
}
</script>

<style>

</style>
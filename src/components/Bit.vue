<template>
  <v-container class="pa-0 d-flex align-center justify-center w-100">
    <v-btn-toggle class="pa-0 ma-0 d-flex align-center justify-center flex-column w-100">
      <v-btn stacked class="pa-0 ma-0 d-flex align-center justify-center flex-column w-100" style="width: 100%"
             :value="value" :active="Boolean(value)" @click="$emit('bitToggled')">
        <span>{{ title }}</span>
        <h2>{{ value }}</h2>
      </v-btn>
    </v-btn-toggle>
  </v-container>
  <v-divider vertical></v-divider>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "Bit",
  props: ['title', 'value', 'bitIndex'],

  data() {
    return {
      toggle: undefined,
    }
  },

  methods: {},

}
</script>

<style scoped>

span {
  font-size: 0.8rem;
}

</style>
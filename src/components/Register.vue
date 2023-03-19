<template>
  <h3 class="mr-5">{{title}}</h3>
  <v-sheet rounded elevation="12" class="mb-4 d-flex align-center">
    <slot/>
  </v-sheet>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "Register",
  props: ['title'],

}
</script>

<style scoped>

</style>
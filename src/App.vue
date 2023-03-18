<script setup>
import TimerPage from "@/components/TimerPage.vue";
</script>

<template>

  <header>
    <h1>Embedded Systems</h1>
    <v-divider></v-divider>
  </header>
  <main>
    <v-tabs v-model="tab" hide-slider>
      <v-tab value="timers">Timers</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="timers">
        <timer-page></timer-page>
      </v-window-item>

    </v-window>
  </main>
</template>

<script>

export default {
  data: () => ({
    tab: null,
  }),
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');

h1 {
  font-family: "Roboto", sans-serif;
}

header {
}

.v-tab__slider {
  height: 1px;
}

</style>
